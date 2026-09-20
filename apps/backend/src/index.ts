import fs from 'fs';
import { fileURLToPath } from 'url';

const distPath = fileURLToPath(new URL('../dist/index.js', import.meta.url));

let runtime: any = null;

if (fs.existsSync(distPath)) {
  // If compiled runtime exists, load it and use its default export.
  const mod = await import('../dist/index.js');
  runtime = mod && (mod.default || mod);
} else {
  // Build an inline runtime using dynamic imports (no TypeScript-only syntax)
  const { Router } = await import('itty-router');
  const { corsHeaders, validateEnv } = await import('./config.js');
  const { handleHealth } = await import('./handlers/health.js');
  const { handleCheckoutCreate } = await import('./handlers/checkout.js');
  const { handleProductList, handleProductById } = await import('./handlers/products.js');
  const { handleCreemWebhook } = await import('./handlers/webhooks.js');
  const { handleAssetDownload } = await import('./handlers/assets.js');
  const { handleUploadRequest, handleUploadComplete, handleUploadStatus } = await import('./handlers/uploads.js');
  const { handleMockBuy } = await import('./handlers/mock.js');
  const { handleAdminRepoStatus, handleAdminContentUpdate } = await import('./handlers/admin.js');
  const { handleAiGenerate, handleAiApprove } = await import('./handlers/ai.js');

  const router = Router();

  router.options('*', () => new Response(null, { headers: corsHeaders }));
  router.get('/health', handleHealth);
  router.get('/api/v1/products', handleProductList);
  router.get('/api/v1/products/:id', (request: Request, ctx: any) => handleProductById(request, ctx?.id));
  router.post('/api/v1/checkout/create', handleCheckoutCreate);
  router.post('/webhooks/creem', handleCreemWebhook);
  router.get('/api/v1/assets/download', handleAssetDownload);
  router.post('/api/v1/uploads/request', (request: Request) => handleUploadRequest(request));
  router.post('/api/v1/uploads/complete', (request: Request) => handleUploadComplete(request));
  router.get('/api/v1/uploads/status', (request: Request) => handleUploadStatus(request));
  router.get('/api/v1/admin/repo-status', handleAdminRepoStatus);
  router.post('/api/v1/admin/content/update', handleAdminContentUpdate);
  router.post('/api/v1/ai/generate', handleAiGenerate);
  router.post('/api/v1/ai/approve', handleAiApprove);
  router.post('/mock/simulate-buy', handleMockBuy);
  router.all('*', () => new Response('Not Found', { status: 404, headers: corsHeaders }));

  runtime = {
    async fetch(request: Request, env: Record<string, any>, ctx: ExecutionContext) {
      try {
        validateEnv(env);
      } catch (error) {
        return new Response(JSON.stringify({ error: 'Server configuration error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      (request as any).env = env;

      return router.handle(request).catch((error: Error) => {
        console.error('Request error:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      });
    }
  };
}

export default runtime;
