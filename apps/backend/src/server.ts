// Render-compatible HTTP server entry point
import { createServer } from 'http';
import { Router } from 'itty-router';
import { corsHeaders, validateEnv } from './config.js';
import { handleHealth } from './handlers/health.js';
import { handleCheckoutCreate } from './handlers/checkout.js';
import { handleProductList, handleProductById } from './handlers/products.js';
import { handleCreemWebhook } from './handlers/webhooks.js';
import { handleAssetDownload } from './handlers/assets.js';
import { handleUploadRequest, handleUploadComplete, handleUploadStatus, handleDirectUpload } from './handlers/uploads.js';
import { handleMockBuy } from './handlers/mock.js';
import { handleAdminRepoStatus, handleAdminContentUpdate } from './handlers/admin.js';
import { handleAiGenerate, handleAiApprove } from './handlers/ai.js';

const router = Router();

router.options('*', () => new Response(null, { headers: corsHeaders }));
router.get('/health', handleHealth);
router.get('/api/v1/products', handleProductList);
router.get('/api/v1/products/:id', (request: Request, ctx: any) => handleProductById(request, ctx?.id));
router.post('/api/v1/checkout/create', handleCheckoutCreate);
router.post('/webhooks/creem', handleCreemWebhook);
router.get('/api/v1/assets/download', handleAssetDownload);
router.post('/api/v1/uploads/request', (request: Request) => handleUploadRequest(request));
router.post('/api/v1/uploads/direct', (request: Request) => handleDirectUpload(request));
router.post('/api/v1/uploads/complete', (request: Request) => handleUploadComplete(request));
router.get('/api/v1/uploads/status', (request: Request) => handleUploadStatus(request));
router.get('/api/v1/admin/repo-status', handleAdminRepoStatus);
router.post('/api/v1/admin/content/update', handleAdminContentUpdate);
router.post('/api/v1/ai/generate', handleAiGenerate);
router.post('/api/v1/ai/approve', handleAiApprove);
router.post('/mock/simulate-buy', handleMockBuy);
router.all('*', () => new Response('Not Found', { status: 404, headers: corsHeaders }));

// Environment variables from process.env
const env: any = {
  CREEM_API_KEY: process.env.CREEM_API_KEY,
  CREEM_WEBHOOK_SECRET: process.env.CREEM_WEBHOOK_SECRET,
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  GITHUB_ASSET_REPO: process.env.GITHUB_ASSET_REPO,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  HF_TOKEN: process.env.HF_TOKEN,
  HF_DATASET_REPO: process.env.HF_DATASET_REPO,
  HF_ACCESS_LEVEL: process.env.HF_ACCESS_LEVEL || 'private',
  GITHUB_WRITE_TOKEN: process.env.GITHUB_WRITE_TOKEN,
  GITHUB_REPO_OWNER: process.env.GITHUB_REPO_OWNER,
  GITHUB_REPO_NAME: process.env.GITHUB_REPO_NAME,
  GITHUB_DEFAULT_BRANCH: process.env.GITHUB_DEFAULT_BRANCH,
  ALLOW_AI_OPS: process.env.ALLOW_AI_OPS,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  AI_ADMIN_APPROVAL_REQUIRED: process.env.AI_ADMIN_APPROVAL_REQUIRED,
};

// Validate environment (soft validation for development)
try {
  validateEnv(env as any);
  console.log('Environment validation passed');
} catch (error) {
  console.warn('Environment validation failed (expected in development):', error);
  // Continue anyway for development
}

// Create HTTP server
const server = createServer(async (req, res) => {
  // Convert Node.js request to fetch API Request
  const url = new URL(req.url || '/', `http://${req.headers.host}`);
  const headers = new Headers();
  
  // Copy headers
  for (const [key, value] of Object.entries(req.headers)) {
    if (value && typeof value === 'string') headers.set(key, value);
  }

  // Get body
  let body: any = null;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    body = Buffer.concat(chunks);
  }

  const request = new Request(url.toString(), {
    method: req.method,
    headers,
    body,
  });

  // Attach env to request
  (request as any).env = env;

  try {
    const response = await router.handle(request);
    
    // Convert fetch Response to Node.js response
    res.statusCode = response.status;
    response.headers.forEach((value: string, key: string) => {
      res.setHeader(key, value);
    });
    
    const responseBody = await response.text();
    res.end(responseBody);
  } catch (error) {
    console.error('Request error:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }));
  }
});

const PORT = process.env.PORT || 8787;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default server;
