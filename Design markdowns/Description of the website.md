# Mescript Labs Website - Technical Specification

## Overview
Monorepo architecture with Astro frontend, Render backend, and Hugging Face Spaces AI hosting. The frontend is deployed on Cloudflare for static/site delivery and CDN performance, the backend runs on Render for API, webhooks, and orchestration, and the AI model is hosted on Hugging Face Spaces to avoid Cloudflare runtime limits and keep the inference flow separate from the site frontend. The platform supports a self-hosted 3D marketplace using Cloudflare R2 storage and a custom model embed viewer, along with Creem payments, GitHub asset delivery, and Supabase for data persistence.

### Architecture Update
- Frontend: Cloudflare Worker deployment for the Astro site at https://app.mescriptlabs.workers.dev
- Backend: Render service for API logic, webhooks, auth, Supabase access, GitHub access, and AI proxy calls (when converted to a Node runtime)
- AI host: Hugging Face Spaces for model inference and prompt processing
- Repository: One GitHub monorepo, but each app deploys to a different provider

This split is preferred because Cloudflare serverless functions have short execution limits and are not a good long-running inference runtime for model workloads, while Render is better suited for a persistent backend API and worker queue orchestration.

### Render Cron Setup
Use Render scheduled jobs to keep the AI service warm and trigger periodic health checks.

```yaml
services:
  - type: cron
    name: keep-ai-warm
    env: node
    schedule: "*/5 * * * *"
    command: curl -fsS https://your-space-name.hf.space/health || exit 1
```

Recommended cron behavior:
- Run every 5 minutes
- Ping the HF Space health endpoint
- Optionally ping a backend route such as `/api/v1/ai/health`
- If the Space is asleep, the request wakes it up and reduces cold-start delay

This is the safest free-tier pattern for a Hugging Face Spaces-based AI runtime without continuously burning compute or risking service shutdown.

### AI Chat History Persistence
Chat history may be stored directly in the repo for a lightweight internal admin dashboard, but it should live in a dedicated log directory rather than the app source tree.

Recommended structure:
```text
.ai/
  chat/
    2026-09-15.md
    2026-09-16.md
```

Recommended file format:
```md
# Mescript Labs AI Chat History

## 2026-09-15 14:32:18 UTC

### User
Write a product launch summary for the premium 3D collection.

### Assistant
**Title:** Launching the Premium 3D Collection

**Summary:**
This collection introduces a premium bundle for creative teams shipping high-quality 3D assets...

**Draft:**
Mescript Labs is launching...
```

This format is easy to render in a chat-like UI and visually resembles Gemini / Copilot style conversations.

### Safe Commit Pattern
Immediate commit-to-repo is acceptable only for a dedicated history/log directory, not for the app source or user content folders. The safer pattern is:
1. append the newest conversation to a session log file
2. debounce writes to avoid excessive commits
3. commit every 30-60 seconds or after a completed turn
4. store the repo write token only in the backend, never in the browser

Example workflow:
```ts
await fs.appendFile(' .ai/chat/2026-09-15.md', formattedContent, 'utf8');
await gitCommit('docs: add AI chat transcript');
```

This is fine if the directory is intentionally dedicated to operational logs, but it should not auto-commit arbitrary working files or production code as part of the chat loop.

---

## 1. Directory Structure

```
mescript-labs-monorepo/
├── apps/
│   ├── web/                         # Astro Frontend
│   │   ├── src/
│   │   │   ├── pages/               # Astro pages
│   │   │   │   ├── index.astro      # Home
│   │   │   │   ├── about.astro      # About page
│   │   │   │   ├── portfolio.astro  # Portfolio gallery
│   │   │   │   ├── contact.astro    # Contact form
│   │   │   │   ├── marketplace.astro # 3D asset marketplace
│   │   │   │   ├── sponsorships.astro # Funding & goals
│   │   │   │   └── admin.astro      # Admin panel
│   │   │   ├── components/          # Astro components
│   │   │   │   ├── CustomModelViewer.astro
│   │   │   │   ├── YouTubeEmbed.astro
│   │   │   │   └── CheckoutModal.astro
│   │   │   ├── lib/                 # Client utilities
│   │   │   │   ├── creem.ts
│   │   │   │   ├── supabase.ts
│   │   │   │   └── api.ts
│   │   │   └── types/               # TypeScript types
│   │   ├── public/
│   │   ├── astro.config.mjs
│   │   └── package.json
│   │
│   └── backend/                     # Cloudflare Workers Backend
│       ├── src/
│       │   ├── index.ts             # Worker entry point
│       │   ├── config.ts            # Environment validation & secrets loader
│       │   ├── handlers/
│       │   │   ├── health.ts        # Health check endpoint
│       │   │   ├── checkout.ts      # Creem checkout generation
│       │   │   ├── webhooks.ts      # Webhook signature validation
│       │   │   ├── assets.ts        # GitHub asset streaming
│       │   │   └── admin_ai.ts      # AI integration
│       │   ├── services/
│       │   │   ├── github.ts
│       │   │   ├── creem.ts
│       │   │   ├── r2.ts
│       │   │   └── supabase.ts
│       │   └── types/
│       │       └── index.ts         # TypeScript types
│       ├── wrangler.toml            # Cloudflare Workers configuration
│       ├── package.json
│       └── tsconfig.json
│
└── config/
    └── agent_instructions.md
```

---

## 2. API Endpoints

### Health Check
**GET /health**

Returns worker health status.

Response:
```json
{
  "status": "healthy",
  "timestamp": "2026-09-12T11:10:34Z"
}
```

### Create Checkout
**POST /api/v1/checkout/create**

Computes gross-up pricing based on product and license tier, returns Creem checkout URL.

Request:
```json
{
  "product_id": "uuid-of-product",
  "license_tier": "indie_team",
  "requested_format": "blend",
  "buyer_email": "creator@studio.com"
}
```

Response:
```json
{
  "checkout_url": "https://creem.io/checkout/chk_982310842091",
  "calculated_gross_price": 26.68,
  "net_target": 25.00,
  "currency": "USD",
  "product_title": "Sci-Fi Character Pack",
  "license_tier": "indie_team"
}
```

### Creem Webhook
**POST /webhooks/creem**

Headers: `x-creem-signature` (HMAC SHA-256)

Payload:
```json
{
  "event": "checkout.paid",
  "data": {
    "transaction_id": "tx_88321094",
    "customer": { "email": "creator@studio.com" },
    "metadata": {
      "product_id": "uuid-of-product",
      "license_tier": "indie_team",
      "requested_format": "blend",
      "github_asset_id": "109823104"
    },
    "amount": 26.68,
    "currency": "USD"
  }
}
```

### Asset Download
**GET /api/v1/assets/download/{asset_id}**

Streams binary from private GitHub releases.

Headers:
- `Content-Type: application/octet-stream`
- `Content-Disposition: attachment; filename="asset.zip"`
- `Cache-Control: no-store, private`

Error Responses:
- 404: Asset not found
- 401: Invalid GitHub token
- 403: Insufficient permissions

---

## 3. Database Schema (Supabase)

### Complete Schema Initialization (SQL)
```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Webhook Events Table (Idempotency & Retry Tracking)
CREATE TABLE webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT DEFAULT 'pending',
  attempts INT DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  processed_at TIMESTAMP WITH TIME ZONE
);

-- 2. Download Tokens Table (24-Hour Expiration)
CREATE TABLE download_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT UNIQUE NOT NULL,
  buyer_email TEXT NOT NULL,
  github_asset_id TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  download_count INT DEFAULT 0,
  max_downloads INT DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Transactions Table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id TEXT UNIQUE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Sponsorship Goals Table
CREATE TABLE sponsorship_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  target_amount DECIMAL(10, 2) NOT NULL,
  current_amount DECIMAL(10, 2) DEFAULT 0.00,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Users Table (Admin Panel & Regular Users)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT CHECK (role IN ('owner', 'admin', 'editor', 'user')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  last_login TIMESTAMP WITH TIME ZONE
);

-- 6. Products Table (AI-Indexed from JSON)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  individual_price DECIMAL(10, 2) NOT NULL,
  indie_team_price DECIMAL(10, 2) NOT NULL,
  aaa_studio_price DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  r2_model_key TEXT,
  r2_thumbnail_key TEXT,
  github_asset_id TEXT,
  thumbnail_url TEXT,
  metadata JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. AI Audit Logs Table
CREATE TABLE ai_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type TEXT NOT NULL,
  executed_by TEXT DEFAULT 'AI_Agent',
  details JSONB NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### Database Cleanup Snippet
```sql
-- WARNING: This will delete all data. Use with caution.
-- Drop all tables in correct order to handle foreign key constraints
DROP TABLE IF EXISTS ai_audit_logs CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS sponsorship_goals CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS download_tokens CASCADE;
DROP TABLE IF EXISTS webhook_events CASCADE;

-- Re-run the schema initialization after cleanup
```

---

## 4. Payment Flow

1. User selects license tier and format
2. Frontend calls `/api/v1/checkout/create`
3. Backend calculates gross price and requests Creem checkout
4. User redirected to Creem for payment
5. Creem sends webhook to `/webhooks/creem`
6. Backend verifies signature and logs to Supabase
7. User redirected to success page
8. User downloads asset via `/api/v1/assets/download/{asset_id}`

---

## 5. Backend Implementation Details (Cloudflare Workers)

### Main Worker Structure
```typescript
import { Router } from 'itty-router';

const router = Router();

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle OPTIONS requests for CORS
router.options('*', () => new Response(null, { headers: corsHeaders }));
```

### Pricing Calculation
```typescript
function calculateGrossPrice(targetNet: number): number {
  const gross = (targetNet + 0.45) / (1.0 - 0.048);
  return Math.round(gross * 100) / 100;
}

// Get price based on product and license tier
function getProductPrice(product: any, licenseTier: string): number {
  switch (licenseTier) {
    case 'individual':
      return product.individual_price;
    case 'indie_team':
      return product.indie_team_price;
    case 'aaa_studio':
      return product.aaa_studio_price;
    default:
      return product.individual_price;
  }
}
```

### Webhook Signature Verification
```typescript
import { crypto } from 'node:crypto';

async function verifyWebhookSignature(signature: string, body: string, secret: string): Promise<boolean> {
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
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  return computedSig === signature;
}
```

### Webhook Handler with Idempotency
```typescript
router.post('/webhooks/creem', async (request: Request) => {
  const signature = request.headers.get('x-creem-signature');
  const body = await request.text();
  
  if (!signature || !(await verifyWebhookSignature(signature, body, CREEM_WEBHOOK_SECRET))) {
    return new Response('Invalid signature', { status: 401 });
  }

  const payload = JSON.parse(body);
  const eventId = payload.data?.transaction_id;
  const eventType = payload.event;

  // Idempotency check
  const existingEvent = await supabase
    .from('webhook_events')
    .select('*')
    .eq('event_id', eventId)
    .single();
  
  if (existingEvent.data) {
    return Response.json({ status: 'already_processed' });
  }

  // Log webhook event
  await supabase.from('webhook_events').insert({
    event_id: eventId,
    event_type: eventType,
    payload: payload,
    status: 'processing'
  });

  // Process payment and issue token
  if (eventType === 'checkout.paid') {
    const metadata = payload.data.metadata || {};
    const buyerEmail = payload.data.customer.email;
    const githubAssetId = metadata.github_asset_id || 'default_asset_id';

    // Generate 24-hour token
    const secureToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    await supabase.from('download_tokens').insert({
      token: secureToken,
      buyer_email: buyerEmail,
      github_asset_id: githubAssetId,
      expires_at: expiresAt,
      max_downloads: 5
    });

    // Update webhook status
    await supabase.from('webhook_events')
      .update({ status: 'processed', processed_at: new Date().toISOString() })
      .eq('event_id', eventId);

    const downloadLink = `https://app.mescriptlabs.workers.dev/api/v1/assets/download?token=${secureToken}`;
    return Response.json({ status: 'success', download_link: downloadLink });
  }

  return Response.json({ status: 'ignored_event' });
});
```

### Token-Verified Asset Download
```typescript
router.get('/api/v1/assets/download', async (request: Request) => {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');

  if (!token) {
    return new Response('Token required', { status: 400 });
  }

  // Fetch token record
  const { data: record } = await supabase
    .from('download_tokens')
    .select('*')
    .eq('token', token)
    .single();

  if (!record) {
    return new Response('Invalid or expired token', { status: 403 });
  }

  // Verify expiration
  if (new Date() > new Date(record.expires_at)) {
    return new Response('Download link expired', { status: 410 });
  }

  // Check download limit
  if (record.download_count >= record.max_downloads) {
    return new Response('Maximum downloads reached', { status: 429 });
  }

  // Increment download count
  await supabase.from('download_tokens')
    .update({ download_count: record.download_count + 1 })
    .eq('token', token);

  // Stream from GitHub
  const assetId = record.github_asset_id;
  const githubUrl = `https://api.github.com/repos/${GITHUB_ASSET_REPO}/releases/assets/${assetId}`;
  
  const response = await fetch(githubUrl, {
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/octet-stream'
    }
  });

  if (!response.ok) {
    return new Response('Failed to fetch asset', { status: 500 });
  }

  return new Response(response.body, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="asset_${assetId}.zip"`
    }
  });
});
```

### Local Development Mock Endpoint
```typescript
router.post('/mock/simulate-buy', async (request: Request) => {
  const { product_id, email } = await request.json();
  const mockToken = `mock_${crypto.randomUUID()}`;
  
  return Response.json({
    message: 'Mock transaction successful',
    buyer_email: email,
    product_id: product_id,
    mock_download_url: `http://localhost:8787/api/v1/assets/download?token=${mockToken}`,
    expires_in: '24 hours'
  });
});

### License Tiers (Per Product Pricing)
- **Individual**: Personal use, single project (price varies per product)
- **Indie Team**: Small teams, commercial use (price varies per product)
- **AAA Studio**: Large studios, unlimited use (price varies per product)

Each product has its own pricing for each license tier, similar to a premium 3D marketplace with self-hosted model files and viewer licensing.

### Environment Variables
- `CREEM_API_KEY`: Creem API key for checkout creation
- `CREEM_WEBHOOK_SECRET`: Webhook HMAC signature secret
- `GITHUB_TOKEN`: GitHub personal access token for asset access
- `GITHUB_ASSET_REPO`: Private GitHub repository for assets
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (bypasses RLS)
- `ALLOW_AI_OPS`: Emergency kill switch for AI operations (True/False)

---

## 5.1 Cloudflare Workers Configuration

### wrangler.toml
```toml
name = "mescript-labs-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[vars]
ALLOWED_ORIGINS = "https://app.mescriptlabs.workers.dev"
GITHUB_ASSET_REPO = "MescriptLabs/private-assets"
ALLOW_AI_OPS = "true"

[[secrets]]
CREEM_API_KEY
CREEM_WEBHOOK_SECRET
GITHUB_TOKEN
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
```

### Environment Variables (Cloudflare Secrets)
```bash
# Set secrets via wrangler CLI
wrangler secret put CREEM_API_KEY
wrangler secret put CREEM_WEBHOOK_SECRET
wrangler secret put GITHUB_TOKEN
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
```

### Frontend Environment Variables (Astro)
```bash
# API Endpoints
NEXT_PUBLIC_API_URL=https://app.mescriplabs.workers.dev

# Supabase (Public)
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

---

## 6. Frontend Routing Structure (Astro)

### Page Routes
```
/                          - Home page (index.astro)
/about                     - About studio (about.astro)
/portfolio                 - Portfolio gallery (portfolio.astro)
/contact                   - Contact form (contact.astro)
/marketplace              - 3D asset marketplace (marketplace.astro)
/sponsorships              - Funding & sponsorship goals (sponsorships.astro)
/admin                     - Admin panel (admin.astro)
/admin/login              - Admin login (admin/login.astro)
```

### Dynamic Routes
```
/portfolio/[id]           - Portfolio item detail (portfolio/[id].astro)
/marketplace/[id]         - Product detail page (marketplace/[id].astro)
/sponsorships/[id]        - Sponsorship goal detail (sponsorships/[id].astro)
```

### Route Groups
- Astro uses file-based routing with no route groups needed
- All pages in src/pages/ are publicly accessible by default
- Protected routes require server-side authentication checks

---

## 7. Security Measures

### Rate Limiting
- Contact form: 5 requests per minute per IP
- API endpoints: 100 requests per minute per IP
- Checkout creation: 10 requests per hour per email

### CSRF Protection
- All state-changing POST requests require CSRF token
- Token stored in HTTP-only cookie
- Verified on server-side for each request

### Password Security
- bcrypt hashing with salt rounds of 12
- Minimum 8 characters, 1 uppercase, 1 lowercase, 1 number
- Password reset via email token (24-hour expiry)

### API Security
- All API keys stored in environment variables
- Webhook signature verification for Creem
- GitHub token scoped to repository access only
- Supabase RLS policies for data access

---

## 8. Admin Panel Features

### User Management
- Create/Edit/Delete users
- Role assignment (Owner, Admin, Editor)
- Activity logs and last login tracking
- Password reset functionality

### Content Management
- Edit portfolio items via JSON
- Update team information
- Manage sponsorship goals
- Monitor transactions

### AI Integration
- Auth K AI model integration for content automation
- GitHub API automation for repository updates
- Creem API automation for product management
- Approval workflow for AI-generated changes

### Analytics Dashboard
- Transaction overview
- Sponsorship goal progress
- User activity metrics
- Revenue tracking

---

## 10. Deployment Configuration

### Cloudflare Workers Deployment
```bash
# Deploy to Cloudflare Workers
wrangler deploy

# Workers will be deployed at: https://app.mescriplabs.workers.dev
```

### Cloudflare Pages Deployment (Frontend)
- Connect GitHub repository to Cloudflare Pages
- Configure build settings:
  - Framework: Astro
  - Build command: `npm run build`
  - Output directory: `dist`
- Auto-deploy on push to main branch
- Preview deployments on pull requests
- Custom domain: mescriptlabs.com (later)

### Architecture
- Frontend: [app.mescriptlabs.workers.dev](https://app.mescriptlabs.workers.dev) (Cloudflare Workers / Pages frontend)
- Backend: https://app.mescriptlabs.workers.dev (Cloudflare Workers)
- API calls use absolute URL: https://app.mescriptlabs.workers.dev/api/v1/checkout/create
- Webhook URL: https://app.mescriptlabs.workers.dev/webhooks/creem
- CORS configured to allow requests from app.mescriptlabs.workers.dev

---

## 11. Media Embedding

### Cloudflare R2 Self-Hosted 3D Models
- Upload .glb, .gltf, .obj, or .fbx files to a Cloudflare R2 bucket
- Store a public or signed URL in product metadata
- Use a custom embed viewer to render the model directly in the browser
- Features: lazy loading, orbit controls, auto-rotate, lighting presets, and direct CDN delivery
- Best for: asset ownership, no third-party embed dependency, and lower external platform lock-in

### File Upload API (R2 + Product Metadata)
- Upload flow overview:
  1. Client requests upload URLs from the backend: `POST /api/v1/uploads/request` with desired `filename` and `format` (`fbx`, `zip`, `glb`).
  2. Backend returns a signed upload URL (R2 PUT/POST) and an upload `id`.
  3. Client uploads the file directly to Cloudflare R2 using the signed URL.
  4. Client notifies the backend `POST /api/v1/uploads/complete` with the upload `id` and product metadata (title, thumbnail, license tiers).
  5. Backend validates the file, persists `r2_model_key` / `r2_thumbnail_key` to the `products` row in Supabase and optionally triggers AI metadata generation.

- API endpoints (recommended):
  - `POST /api/v1/uploads/request` — returns signed upload URL(s) and upload id.
  - `POST /api/v1/uploads/complete` — finalize upload, validate, and attach to product metadata.
  - `GET /api/v1/uploads/status?uploadId=...` — optional status polling.

- Expected backend responsibilities:
  - Generate short-lived signed R2 URLs using `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` or R2-compatible signed URL flow.
  - Validate uploaded file size and mime type, create thumbnails for GLB when possible, and write metadata to Supabase.
  - Provide `model_url` (public or signed) to the frontend product metadata for the `CustomModelViewer`.

- Required env vars for uploads and streaming (add to `apps/backend/.dev.vars.example` and Cloudflare/Render env settings):
  - `R2_ACCOUNT_ID` — Cloudflare account id
  - `R2_ACCESS_KEY_ID` — R2 access key id
  - `R2_SECRET_ACCESS_KEY` — R2 secret
  - `R2_BUCKET_NAME` — bucket/container name (e.g., `mescript-models`)
  - `R2_PUBLIC_URL` — optional CDN base URL for public assets
  - `MODEL_VIEWER_BASE_URL` — base path for model viewer routes

Notes:
- The backend may either sign direct uploads (preferred) or proxy uploads through a Node server on Render if stricter validation is required. Keep `GITHUB_ASSET_REPO` as a fallback for legacy GitHub release-based assets.

### YouTube Videos
- Upload videos to YouTube (unlisted option)
- Get video ID from YouTube URL
- Embed using YouTube iframe API
- Features: Lazy loading, autoplay options, playlist support

### ImgBB Images
- Upload images to ImgBB
- Get direct image URL
- Display in responsive galleries
- Features: Lightbox, lazy loading, optimization

---

## 12. AI Integration (Auth K)

### Capabilities
- Content generation and organization
- Automated metadata generation
- Smart categorization algorithms
- GitHub pull request automation
- Creem product management automation

### Safety Protocols
- Approval workflow for all automated actions
- API keys scoped to specific endpoints
- Rate limiting on AI-initiated calls
- Audit logging with timestamps
- Emergency stop capability
- Sandbox environment for testing
- Permission boundaries for sensitive data
- Time-based restrictions on operations

---

## 13. Performance Optimization

### Image Optimization
- Astro Image component for automatic optimization
- WebP format with fallback to JPEG
- Lazy loading for below-fold images
- Responsive images with srcset

### Code Splitting
- Dynamic imports for heavy components
- Route-based code splitting
- Component-level lazy loading

### Caching Strategy
- Static assets cached on CDN
- API responses cached where appropriate
- Supabase query caching
- GitHub releases cached temporarily

### Bundle Optimization
- Tree shaking to remove unused code
- Minification of JavaScript and CSS
- Gzip compression enabled
- Brotli compression where supported

---

## 14. Frontend Components

### CustomModelViewer
Interactive 3D model viewer rendered from Cloudflare R2-hosted assets using a custom browser embed flow.

### CheckoutModal
Modal for selecting license tier, format, and email before checkout.

### YouTubeEmbed
Responsive YouTube video embed with lazy loading.

---

## 15. AI Prompts for Development

### Backend Setup
```
Initialize Cloudflare Workers in /apps/backend with itty-router, CORS middleware, /health endpoint, and Creem pricing utility. Use TypeScript and wrangler.toml configuration.
```

### Asset Streaming
```
Create GET /api/v1/assets/download using fetch API to stream from GitHub releases with proper headers. Handle 404s gracefully.
```

### Marketplace UI
```
Build marketplace page with dark theme (#0B0C10), grid layout, custom self-hosted 3D model viewers, and CheckoutModal integration using Astro components.
```

---

## 16. Design System

### Colors
- Background: #0B0C10
- Cards: #1F2833
- Accent: Cyan (#00FFFF) and Amber (#FFD700)
- Text: #E0E6ED (primary), #C5C6C7 (secondary)

### Typography
- Font: Inter, JetBrains Mono, or Roboto
- Style: Clean, technical, developer-focused

### Layout
- Responsive grid
- Glassmorphism effects
- Subtle hover animations

---

## 17. Implementation Roadmap

### Phase 1: Supabase Setup (Do First)
- Run complete SQL schema in Supabase SQL Editor
- Set up Supabase cron job using pg_cron extension or external service (cron-job.org) to ping database every 10 minutes

### Phase 2: Creem Setup
- Sign up for Creem account
- Get API key and webhook secret
- Note: Webhook URL will be configured after backend deployment

### Phase 3: GitHub Setup
- Create `MescriptLabs/private-assets` repository (or multiple repos for different asset categories)
- Generate fine-grained PAT with read access to private releases
- Upload first 3D model as GitHub release
- Note: Multiple asset repositories can be used until upgrading to R3 cloud storage

### Phase 4: Backend Foundation
- Initialize Cloudflare Workers project in `apps/backend`
- Set up wrangler.toml configuration
- Set up CORS, health endpoint, and environment variables
- Test locally with `wrangler dev`

### Phase 5: Backend Core
- Implement checkout creation endpoint with Creem integration
- Implement webhook handler with idempotency and token generation
- Implement token-verified asset download endpoint
- Add mock endpoint for local testing without real payments

### Phase 6: Backend Deployment
- Deploy backend to Cloudflare Workers using `wrangler deploy`
- Configure webhook URL in Creem dashboard
- No health check cron needed (Cloudflare Workers has no cold starts)

### Phase 7: Frontend Foundation
- Initialize Astro in `apps/web`
- Set up Tailwind CSS with dark theme (#0B0C10)
- Configure environment variables

### Phase 8: Frontend Components
- Build CustomModelViewer component to load R2-hosted 3D assets
- Build CheckoutModal component
- Build YouTubeEmbed component

### Phase 9: Frontend Pages
- Build marketplace page with grid layout
- Build portfolio, about, contact pages
- Build admin panel pages

### Phase 10: Frontend Deployment
- Deploy to Cloudflare Pages
- Connect GitHub repository to Cloudflare Pages
- Configure build settings for Astro
- Configure custom domain (if available)

### Phase 11: Testing & Verification
- End-to-end payment flow test
- Asset download verification
- Webhook retry testing
- Security audit

### Recommended Starting Point
Begin with **Phase 1 (Supabase schema)** since you already have the account. This provides the database foundation before any code development.

---

## 18. Detailed Step-by-Step Implementation Plan

### Phase 1: Supabase Setup (3 tasks)
1. Enable UUID extension in Supabase SQL Editor
2. Run complete SQL schema initialization (7 tables: webhook_events, download_tokens, transactions, sponsorship_goals, users, products, ai_audit_logs)
3. Set up Supabase cron job using pg_cron extension or external service (cron-job.org) to ping database every 10 minutes

### Phase 2: Creem Setup (4 tasks)
4. Sign up for Creem account and get sandbox API keys (no ID verification needed for test mode)
5. Get CREEM_API_KEY for checkout creation
6. Get CREEM_WEBHOOK_SECRET for HMAC signature verification
7. Configure webhook endpoint URL in Creem dashboard (after backend deployment)

### Phase 3: GitHub Setup (3 tasks)
8. Create MescriptLabs/private-assets repository (or multiple repos for different asset categories)
9. Generate fine-grained PAT with read access to private releases
10. Upload first 3D model as GitHub release with asset ID

### Phase 4: Backend Foundation (11 tasks)
11. Install wrangler CLI globally (`npm install -g wrangler`)
12. Authenticate with Cloudflare (`wrangler login`)
13. Create apps/backend directory structure
14. Initialize Cloudflare Workers project (`wrangler init`)
15. Create wrangler.toml configuration with secrets and vars
16. Set up TypeScript configuration (tsconfig.json)
17. Create src/index.ts with itty-router setup
18. Implement CORS headers and OPTIONS handler
19. Implement GET /health endpoint
20. Set up environment variables (`wrangler secret put`)
21. Test locally with `wrangler dev`

### Phase 5: Backend Core (14 tasks)
22. Create src/handlers/checkout.ts
23. Implement calculateGrossPrice function (Gross = (Target + 0.45) / (1 - 0.048))
24. Implement POST /api/v1/checkout/create endpoint
25. Integrate Creem API for checkout session creation
26. Create src/handlers/webhooks.ts
27. Implement verifyWebhookSignature function (HMAC SHA-256)
28. Implement POST /webhooks/creem endpoint with idempotency check
29. Implement 24-hour token generation using crypto.randomUUID()
30. Create src/handlers/assets.ts
31. Implement GET /api/v1/assets/download with token verification
32. Implement expiration check (24-hour limit)
33. Implement download count limit (max 5 downloads)
34. Implement GitHub asset streaming using fetch API
35. Set up Supabase client integration

### Phase 6: Backend Testing (3 tasks)
36. Create src/handlers/mock.ts
37. Implement POST /mock/simulate-buy endpoint
38. Test mock endpoint locally without real payments

### Phase 7: Frontend Foundation (7 tasks)
39. Create apps/web directory structure
40. Initialize Astro project (`npm create astro@latest`)
41. Install Tailwind CSS and configure dark theme (#0B0C10)
42. Configure astro.config.mjs with adapter for Cloudflare Pages
43. Set up environment variables (.env)
44. Create src/lib/api.ts for fetch wrappers
45. Create src/lib/supabase.ts for browser-safe Supabase client

### Phase 8: Frontend Components (4 tasks)
46. Create src/components/ directory for base components
47. Build CustomModelViewer.astro to render Cloudflare R2-hosted 3D payloads
48. Build CheckoutModal.astro with tier/format selection
49. Build YouTubeEmbed.astro with lazy loading

### Phase 9: Frontend Pages (7 tasks)
50. Create src/pages/index.astro (Home)
51. Create src/pages/about.astro
52. Create src/pages/portfolio.astro with gallery
53. Create src/pages/contact.astro with form
54. Create src/pages/marketplace.astro with grid layout
55. Create src/pages/sponsorships.astro with goals
56. Create src/pages/admin.astro (protected)

### Phase 10: Deployment (6 tasks)
57. Deploy backend to Cloudflare Workers (`wrangler deploy`)
58. Configure webhook URL in Creem dashboard with Workers URL
59. Connect GitHub repo to Cloudflare Pages
60. Configure Cloudflare Pages build settings (Astro)
61. Deploy frontend to Cloudflare Pages
62. Configure custom domain (if available)

### Phase 11: Testing & Verification (6 tasks)
63. Test health endpoint on deployed Workers
64. Test mock endpoint for checkout flow
65. End-to-end payment flow test with Creem sandbox
66. Asset download verification with real token
67. Webhook retry testing (simulate duplicate webhooks)
68. Security audit (CORS, signature verification, token expiration)
