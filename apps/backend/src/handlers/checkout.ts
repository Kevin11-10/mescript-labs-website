import { corsHeaders, type Env } from '../config.js';
import { CreemService } from '../services/creem.js';
import { createSupabaseService } from '../services/supabase.js';

interface CheckoutRequest {
  product_id: string;
  license_tier: 'individual' | 'indie_team' | 'aaa_studio';
  requested_format: string;
  buyer_email: string;
}

interface CheckoutResponse {
  checkout_url: string;
  calculated_gross_price: number;
  net_target: number;
  currency: string;
  product_title: string;
  license_tier: string;
}

function calculateGrossPrice(targetNet: number): number {
  const gross = (targetNet + 0.45) / (1.0 - 0.048);
  return Math.round(gross * 100) / 100;
}

function getProductPrice(product: any, licenseTier: string): number {
  switch (licenseTier) {
    case 'individual':
      return Number(product.individual_price);
    case 'indie_team':
      return Number(product.indie_team_price);
    case 'aaa_studio':
      return Number(product.aaa_studio_price);
    default:
      return Number(product.individual_price);
  }
}

export async function handleCheckoutCreate(request: Request): Promise<Response> {
  try {
    const body = await request.json() as CheckoutRequest;
    const env = (request as any).env as Env;

    if (!body.product_id || !body.license_tier || !body.buyer_email) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createSupabaseService({
      url: env.SUPABASE_URL,
      serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
    });

    const { data: productFromDb, error: productError } = await supabase.getProductById(body.product_id);
    const product = productFromDb ?? {
      id: 'default-product',
      title: 'Sci-Fi Character Pack',
      individual_price: 15,
      indie_team_price: 25,
      aaa_studio_price: 50,
    };

    if (productError && !productFromDb) {
      console.warn('Product lookup failed; falling back to default mock product:', productError.message);
    }

    const netTarget = getProductPrice(product, body.license_tier);
    const grossPrice = calculateGrossPrice(netTarget);

    let checkoutUrl = `https://creem.io/checkout/mock_${Date.now()}`;

    if (env.CREEM_API_KEY) {
      const creem = new CreemService(env.CREEM_API_KEY);
      const checkoutResponse = await creem.createCheckout({
        amount: grossPrice,
        currency: product.currency || 'USD',
        customer_email: body.buyer_email,
        product_title: product.title,
        metadata: {
          product_id: body.product_id,
          license_tier: body.license_tier,
          requested_format: body.requested_format,
        },
        success_url: `${env.ALLOWED_ORIGINS || 'http://localhost:4321'}/marketplace?checkout=success`,
        cancel_url: `${env.ALLOWED_ORIGINS || 'http://localhost:4321'}/marketplace?checkout=cancelled`,
      });

      if (checkoutResponse && checkoutResponse.checkout_url) {
        checkoutUrl = checkoutResponse.checkout_url;
      }
    }

    const response: CheckoutResponse = {
      checkout_url: checkoutUrl,
      calculated_gross_price: grossPrice,
      net_target: netTarget,
      currency: product.currency || 'USD',
      product_title: product.title,
      license_tier: body.license_tier,
    };

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Checkout error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create checkout' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
