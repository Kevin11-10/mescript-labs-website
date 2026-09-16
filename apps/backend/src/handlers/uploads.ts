import { createR2Service } from '../services/r2';
import { createSupabaseService } from '../services/supabase';
import { corsHeaders, type Env } from '../config';

function jsonResponse(body: any, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}

export async function handleUploadRequest(request: Request) {
  try {
    const env: Env = (request as any).env;
    const body: any = await request.json();
    const { filename, contentType = 'application/octet-stream', productId } = body;

    if (!filename) return jsonResponse({ error: 'filename is required' }, 400);

    const r2 = createR2Service(env);

    const now = Date.now();
    const key = `uploads/${now}-${Math.random().toString(36).slice(2, 10)}-${filename}`;

    const { uploadUrl, publicUrl } = await r2.createPresignedPutUrl(key, contentType);

    // Store an upload record in Supabase (optional)
    try {
      const supa = createSupabaseService({ url: env.SUPABASE_URL!, serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY! });
      await supa.getClient().from('uploads').insert([{ product_id: productId || null, r2_key: key, status: 'requested', created_at: new Date().toISOString() }]);
    } catch (err) {
      // non-fatal
      console.warn('Failed to record upload request', err);
    }

    return jsonResponse({ uploadUrl, key, publicUrl });
  } catch (error: any) {
    console.error('Upload request error', error);
    return jsonResponse({ error: error?.message ?? 'unknown' }, 500);
  }
}

export async function handleUploadComplete(request: Request) {
  try {
    const env: Env = (request as any).env;
    const body: any = await request.json();
    const { key, productId } = body;

    if (!key) return jsonResponse({ error: 'key is required' }, 400);

    const r2PublicBase = env.R2_PUBLIC_URL;
    const fileUrl = r2PublicBase ? `${r2PublicBase.replace(/\/$/, '')}/${key}` : undefined;

    // Validate existence by HEAD request
    if (fileUrl) {
      const headResp = await fetch(fileUrl, { method: 'HEAD' });
      if (!headResp.ok) {
        return jsonResponse({ error: 'Uploaded file not accessible yet' }, 400);
      }
    }

    // Update product row with r2 key / url if productId provided
    if (productId) {
      try {
        const supa = createSupabaseService({ url: env.SUPABASE_URL!, serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY! });
        await supa.getClient().from('products').update({ r2_model_key: key, model_url: fileUrl }).eq('id', productId);
      } catch (err) {
        console.warn('Failed to update product with R2 key', err);
      }
    }

    // mark upload record completed
    try {
      const supa = createSupabaseService({ url: env.SUPABASE_URL!, serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY! });
      await supa.getClient().from('uploads').update({ status: 'completed', completed_at: new Date().toISOString() }).eq('r2_key', key);
    } catch (err) {
      // non-fatal
    }

    return jsonResponse({ success: true, url: fileUrl });
  } catch (error: any) {
    console.error('Upload complete error', error);
    return jsonResponse({ error: error?.message ?? 'unknown' }, 500);
  }
}

export async function handleUploadStatus(request: Request) {
  try {
    const url = new URL(request.url);
    const key = url.searchParams.get('key');
    if (!key) return jsonResponse({ error: 'key query param required' }, 400);

    const env: Env = (request as any).env;
    const r2PublicBase = env.R2_PUBLIC_URL;
    const fileUrl = r2PublicBase ? `${r2PublicBase.replace(/\/$/, '')}/${key}` : undefined;

    if (fileUrl) {
      const headResp = await fetch(fileUrl, { method: 'HEAD' });
      return jsonResponse({ exists: headResp.ok, status: headResp.status });
    }

    return jsonResponse({ exists: false });
  } catch (error: any) {
    console.error('Upload status error', error);
    return jsonResponse({ error: error?.message ?? 'unknown' }, 500);
  }
}
