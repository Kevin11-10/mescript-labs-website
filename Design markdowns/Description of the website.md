# Mescript Labs Website - Technical Specification

## Overview
Monorepo architecture with Next.js frontend and Cloudflare Workers backend, deployed on Cloudflare. Supports 3D model marketplace via Sketchfab, Creem payments, and GitHub asset delivery.

---

## 1. Directory Structure

```
mescript-labs-monorepo/
├── apps/
│   ├── web/                         # Next.js App Router Frontend
│   │   ├── src/
│   │   │   ├── app/                 # App Router pages
│   │   │   │   ├── (public)/        # Public routes
│   │   │   │   │   ├── page.tsx     # Home
│   │   │   │   │   ├── about/       # About page
│   │   │   │   │   ├── portfolio/   # Portfolio gallery
│   │   │   │   │   ├── contact/     # Contact form
│   │   │   │   │   ├── marketplace/ # 3D asset marketplace
│   │   │   │   │   ├── sponsorships/# Funding & goals
│   │   │   │   │   └── admin/       # Admin panel
│   │   │   ├── components/          # UI components
│   │   │   │   ├── ui/              # Base components
│   │   │   │   ├── SketchfabViewer.tsx
│   │   │   │   ├── YouTubeEmbed.tsx
│   │   │   │   └── CheckoutModal.tsx
│   │   │   ├── lib/                 # Client utilities
│   │   │   │   ├── creem.ts
│   │   │   │   ├── supabase.ts
│   │   │   │   └── api.ts
│   │   │   └── types/               # TypeScript types
│   │   ├── public/
│   │   ├── next.config.ts
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
│       │   │   ├── sketchfab.ts
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

### Complete Schema Initialization
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
  sketchfab_model_uid TEXT,
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

    const downloadLink = `https://mescriptlabs.com/api/v1/assets/download?token=${secureToken}`;
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

Each product has its own pricing for each license tier, similar to Sketchfab or FAB marketplace.

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
ALLOWED_ORIGINS = "https://mescriptlabs.com"
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

### Frontend Environment Variables (Next.js)
```bash
# API Endpoints
NEXT_PUBLIC_API_URL=https://api.mescriptlabs.com

# Supabase (Public)
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

---

## 6. Frontend Routing Structure

### Page Routes
```
/                          - Home page
/about                     - About studio
/portfolio                 - Portfolio gallery
/contact                   - Contact form
/marketplace              - 3D asset marketplace
/sponsorships              - Funding & sponsorship goals
/admin                     - Admin panel (protected)
/admin/login              - Admin login
```

### Dynamic Routes
```
/portfolio/[id]           - Portfolio item detail
/marketplace/[id]         - Product detail page
/sponsorships/[id]        - Sponsorship goal detail
```

### Route Groups
- `(public)`: Publicly accessible pages
- `(protected)`: Authentication required
- `(admin)`: Admin role required

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

## 9. Deployment Configuration

### Cloudflare Workers Deployment
```bash
# Deploy to Cloudflare Workers
wrangler deploy

# Preview deployment
wrangler deploy --env preview
```

### Cloudflare Pages Deployment (Frontend)
- Connect GitHub repository to Cloudflare Pages
- Configure build settings:
  - Framework: Next.js
  - Build command: `npm run build`
  - Output directory: `.next`
- Auto-deploy on push to main branch
- Preview deployments on pull requests

### No Health Check Cron Needed
Cloudflare Workers has no cold start issues, so no health check cron is required. Workers are always ready to handle requests.

---

## 10. Media Embedding

### Sketchfab 3D Models
- Upload models to Sketchfab
- Get model UID from Sketchfab
- Embed using iframe with model UID
- Supports: .glb, .gltf, .obj, .fbx
- Features: Auto-rotate, orbit controls, lighting

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

## 11. AI Integration (Auth K)

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

## 12. Performance Optimization

### Image Optimization
- Next.js Image component for automatic optimization
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

## 13. Frontend Components

### SketchfabViewer
Interactive 3D model viewer using Sketchfab embeds.

### CheckoutModal
Modal for selecting license tier, format, and email before checkout.

### YouTubeEmbed
Responsive YouTube video embed with lazy loading.

---

## 14. AI Prompts for Development

### Backend Setup
```
Initialize FastAPI in /apps/backend with CORS middleware, /health endpoint, and Creem pricing utility. Use Pydantic v2 and python-dotenv.
```

### Asset Streaming
```
Create GET /api/v1/assets/download/{asset_id} using httpx.AsyncClient to stream from GitHub releases with 8KB chunks. Handle 404s gracefully.
```

### Marketplace UI
```
Build marketplace page with dark theme (#0B0C10), grid layout, Sketchfab viewers, and CheckoutModal integration.
```

---

## 15. Design System

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

## 16. Implementation Roadmap

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
- Initialize Next.js App Router in `apps/web`
- Set up Tailwind CSS with dark theme (#0B0C10)
- Configure environment variables

### Phase 8: Frontend Components
- Build SketchfabViewer component
- Build CheckoutModal component
- Build YouTubeEmbed component

### Phase 9: Frontend Pages
- Build marketplace page with grid layout
- Build portfolio, about, contact pages
- Build admin panel pages

### Phase 10: Frontend Deployment
- Deploy to Cloudflare Pages
- Connect GitHub repository to Cloudflare Pages
- Configure build settings for Next.js
- Configure custom domain (if available)

### Phase 11: Testing & Verification
- End-to-end payment flow test
- Asset download verification
- Webhook retry testing
- Security audit

### Recommended Starting Point
Begin with **Phase 1 (Supabase schema)** since you already have the account. This provides the database foundation before any code development.

---

## 17. Detailed Step-by-Step Implementation Plan

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
40. Initialize Next.js App Router project (`npx create-next-app@latest`)
41. Install Tailwind CSS and configure dark theme (#0B0C10)
42. Configure next.config.ts with output: 'export'
43. Set up environment variables (.env.local)
44. Create src/lib/api.ts for fetch wrappers
45. Create src/lib/supabase.ts for browser-safe Supabase client

### Phase 8: Frontend Components (4 tasks)
46. Create src/components/ui/ directory for base components
47. Build SketchfabViewer.tsx with iframe embed
48. Build CheckoutModal.tsx with tier/format selection
49. Build YouTubeEmbed.tsx with lazy loading

### Phase 9: Frontend Pages (7 tasks)
50. Create src/app/(public)/page.tsx (Home)
51. Create src/app/(public)/about/page.tsx
52. Create src/app/(public)/portfolio/page.tsx with gallery
53. Create src/app/(public)/contact/page.tsx with form
54. Create src/app/marketplace/page.tsx with grid layout
55. Create src/app/sponsorships/page.tsx with goals
56. Create src/app/admin/page.tsx (protected)

### Phase 10: Deployment (6 tasks)
57. Deploy backend to Cloudflare Workers (`wrangler deploy`)
58. Configure webhook URL in Creem dashboard with Workers URL
59. Connect GitHub repo to Cloudflare Pages
60. Configure Cloudflare Pages build settings (Next.js)
61. Deploy frontend to Cloudflare Pages
62. Configure custom domain (if available)

### Phase 11: Testing & Verification (6 tasks)
63. Test health endpoint on deployed Workers
64. Test mock endpoint for checkout flow
65. End-to-end payment flow test with Creem sandbox
66. Asset download verification with real token
67. Webhook retry testing (simulate duplicate webhooks)
68. Security audit (CORS, signature verification, token expiration)
