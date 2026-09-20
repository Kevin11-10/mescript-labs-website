import { createHuggingFaceService } from '../services/huggingface.js';
import { createSupabaseService } from '../services/supabase.js';
import { corsHeaders, type Env } from '../config.js';

function jsonResponse(body: any, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}

export async function handleUploadRequest(request: Request) {
  try {
    const env: Env = (request as any).env;
    const body: any = await request.json();
    const { filename, contentType = 'application/octet-stream', productId } = body;

    if (!filename) return jsonResponse({ error: 'filename is required' }, 400);

    const hf = createHuggingFaceService(env);

    const now = Date.now();
    const key = `uploads/${now}-${Math.random().toString(36).slice(2, 10)}-${filename}`;

    // Store an upload record in Supabase (optional)
    try {
      const supa = createSupabaseService({ url: env.SUPABASE_URL!, serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY! });
      await supa.getClient().from('uploads').insert([{ 
        product_id: productId || null, 
        hf_key: key, 
        status: 'requested', 
        created_at: new Date().toISOString() 
      }]);
    } catch (err) {
      // non-fatal
      console.warn('Failed to record upload request', err);
    }

    // Return the upload endpoint info
    const uploadUrl = `/api/v1/uploads/direct?key=${key}`;
    const publicUrl = hf.getPublicUrl(key);

    return jsonResponse({ uploadUrl, key, publicUrl });
  } catch (error: any) {
    console.error('Upload request error', error);
    return jsonResponse({ error: error?.message ?? 'unknown' }, 500);
  }
}

export async function handleDirectUpload(request: Request) {
  try {
    const env: Env = (request as any).env;
    const url = new URL(request.url);
    const key = url.searchParams.get('key');
    
    if (!key) return jsonResponse({ error: 'key query param required' }, 400);

    const hf = createHuggingFaceService(env);
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) return jsonResponse({ error: 'file is required' }, 400);

    const arrayBuffer = await file.arrayBuffer();
    const fileName = key.split('/').pop() || file.name;
    
    const result = await hf.uploadFile(fileName, arrayBuffer, `Upload ${fileName}`);
    
    return jsonResponse({ success: true, url: result.url, path: result.path });
  } catch (error: any) {
    console.error('Direct upload error', error);
    return jsonResponse({ error: error?.message ?? 'unknown' }, 500);
  }
}

export async function handleUploadComplete(request: Request) {
  try {
    const env: Env = (request as any).env;
    const body: any = await request.json();
    const { key, productId } = body;

    if (!key) return jsonResponse({ error: 'key is required' }, 400);

    const hf = createHuggingFaceService(env);
    const fileUrl = hf.getPublicUrl(key);

    // Validate existence by checking file
    const exists = await hf.fileExists(key);
    if (!exists) {
      return jsonResponse({ error: 'Uploaded file not accessible yet' }, 400);
    }

    // Update product row with hf key / url if productId provided
    if (productId) {
      try {
        const supa = createSupabaseService({ url: env.SUPABASE_URL!, serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY! });
        await supa.getClient().from('products').update({ 
          r2_model_key: key, // keeping r2_model_key for backward compatibility
          model_url: fileUrl 
        }).eq('id', productId);
      } catch (err) {
        console.warn('Failed to update product with Hugging Face key', err);
      }
    }

    // mark upload record completed
    try {
      const supa = createSupabaseService({ url: env.SUPABASE_URL!, serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY! });
      await supa.getClient().from('uploads').update({ 
        status: 'completed', 
        completed_at: new Date().toISOString() 
      }).eq('hf_key', key);
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
    const hf = createHuggingFaceService(env);
    
    const exists = await hf.fileExists(key);
    const fileUrl = exists ? hf.getPublicUrl(key) : null;

    return jsonResponse({ exists, url: fileUrl });
  } catch (error: any) {
    console.error('Upload status error', error);
    return jsonResponse({ error: error?.message ?? 'unknown' }, 500);
  }
}
