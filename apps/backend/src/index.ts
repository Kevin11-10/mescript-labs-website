import fs from 'fs';
import { fileURLToPath } from 'url';

const distPath = fileURLToPath(new URL('../dist/index.js', import.meta.url));

if (fs.existsSync(distPath)) {
	// If the compiled runtime exists, delegate to it.
	const mod = await import('../dist/index.js');
	export default mod.default;
} else {
	// Fallback: inline the router implementation so a process running
	// `node src/index.ts` without a prior build still serves requests.
	import { Router } from 'itty-router';
	import { corsHeaders, validateEnv, type Env } from './config.js';
	import { handleHealth } from './handlers/health.js';
	import { handleCheckoutCreate } from './handlers/checkout.js';
	import { handleProductList, handleProductById } from './handlers/products.js';
	import { handleCreemWebhook } from './handlers/webhooks.js';
	import { handleAssetDownload } from './handlers/assets.js';
	import { handleUploadRequest, handleUploadComplete, handleUploadStatus } from './handlers/uploads.js';
	import { handleMockBuy } from './handlers/mock.js';
	import { handleAdminRepoStatus, handleAdminContentUpdate } from './handlers/admin.js';
	import { handleAiGenerate, handleAiApprove } from './handlers/ai.js';

	const router = Router();

	// Handle OPTIONS requests for CORS
	router.options('*', () => new Response(null, { headers: corsHeaders }));

	// Health check endpoint
	router.get('/health', handleHealth);

	// Catalog endpoints
	router.get('/api/v1/products', handleProductList);
	router.get('/api/v1/products/:id', (request: Request, { id }: { id: string }) => handleProductById(request, id));

	// Checkout endpoints
	router.post('/api/v1/checkout/create', handleCheckoutCreate);

	// Webhook endpoints
	router.post('/webhooks/creem', handleCreemWebhook);

	// Asset download endpoint
	router.get('/api/v1/assets/download', handleAssetDownload);

	// Upload endpoints (R2 presigned URL flow)
	router.post('/api/v1/uploads/request', (request: Request) => handleUploadRequest(request));
	router.post('/api/v1/uploads/complete', (request: Request) => handleUploadComplete(request));
	router.get('/api/v1/uploads/status', (request: Request) => handleUploadStatus(request));

	// Admin content management endpoints
	router.get('/api/v1/admin/repo-status', handleAdminRepoStatus);
	router.post('/api/v1/admin/content/update', handleAdminContentUpdate);

	// AI endpoints
	router.post('/api/v1/ai/generate', handleAiGenerate);
	router.post('/api/v1/ai/approve', handleAiApprove);

	// Mock endpoint for local testing
	router.post('/mock/simulate-buy', handleMockBuy);

	// 404 handler
	router.all('*', () => new Response('Not Found', { status: 404, headers: corsHeaders }));

	export default {
		async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
			// Validate environment variables
			try {
				validateEnv(env);
			} catch (error) {
				return new Response(
					JSON.stringify({ error: 'Server configuration error' }),
					{ status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
				);
			}

			// Attach env to request for use in handlers
			(request as any).env = env;

			return router.handle(request).catch((error: Error) => {
				console.error('Request error:', error);
				return new Response(
					JSON.stringify({ error: error.message }),
					{ status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
				);
			});
		}
	};
}
