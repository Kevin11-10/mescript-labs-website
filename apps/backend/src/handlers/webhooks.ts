import { corsHeaders, type Env } from '../config';
import { createSupabaseService } from '../services/supabase';

interface WebhookPayload {
  event: string;
  data: {
    transaction_id: string;
    customer: { email: string };
    metadata?: {
      product_id: string;
      license_tier: string;
      requested_format: string;
      github_asset_id: string;
    };
    amount: number;
    currency: string;
  };
}

async function verifyWebhookSignature(signature: string, body: string, secret: string): Promise<boolean> {
  try {
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const computed = await crypto.subtle.sign(
      'HMAC',
      key,
      new TextEncoder().encode(body)
    );

    const computedSig = Array.from(new Uint8Array(computed))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    return computedSig === signature;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

export async function handleCreemWebhook(request: Request): Promise<Response> {
  try {
    const env = (request as any).env as Env;
    const signature = request.headers.get('x-creem-signature');
    const body = await request.text();

    if (!signature) {
      return new Response(
        JSON.stringify({ error: 'Missing signature' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!(await verifyWebhookSignature(signature, body, env.CREEM_WEBHOOK_SECRET))) {
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const payload = JSON.parse(body) as WebhookPayload;
    const eventId = payload.data?.transaction_id;
    const eventType = payload.event;

    if (!eventId) {
      return new Response(
        JSON.stringify({ error: 'Missing transaction_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createSupabaseService({
      url: env.SUPABASE_URL,
      serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
    });

    const { data: existingEvent, error: existingEventError } = await supabase.getWebhookEventByTransactionId(eventId);
    if (existingEvent && !existingEventError) {
      return new Response(
        JSON.stringify({ status: 'already_processed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    await supabase.insertWebhookEvent({
      event_id: eventId,
      event_type: eventType,
      payload,
      status: 'processing',
    });

    if (eventType === 'checkout.paid') {
      const metadata = (payload.data.metadata as any) || {};
      const buyerEmail = payload.data.customer.email;
      const githubAssetId = metadata.github_asset_id || 'default_asset_id';

      const secureToken = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      await supabase.insertDownloadToken({
        token: secureToken,
        buyer_email: buyerEmail,
        github_asset_id: githubAssetId,
        expires_at: expiresAt,
        max_downloads: 5,
        download_count: 0,
      });

      await supabase.markWebhookProcessed(eventId);

      const downloadLink = `https://mescriptlabs.com/api/v1/assets/download?token=${secureToken}`;
      return new Response(
        JSON.stringify({ status: 'success', download_link: downloadLink }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ status: 'ignored_event' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process webhook' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
