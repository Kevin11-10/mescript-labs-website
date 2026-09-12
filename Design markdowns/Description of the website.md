# Mescript Labs Website - Technical Specification

## Overview
Monorepo architecture with Next.js frontend and FastAPI backend, deployed on Render. Supports 3D model marketplace via Sketchfab, Creem payments, and GitHub asset delivery.

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
│   └── backend/                     # FastAPI Backend
│       ├── app/
│       │   ├── main.py              # App entry point
│       │   ├── config.py            # Config & env vars
│       │   ├── routers/
│       │   │   ├── health.py        # Health check
│       │   │   ├── checkout.py      # Payment logic
│       │   │   ├── webhooks.py      # Webhook handlers
│       │   │   ├── assets.py        # Asset streaming
│       │   │   └── admin_ai.py      # AI integration
│       │   ├── services/
│       │   │   ├── github.py
│       │   │   ├── creem.py
│       │   │   ├── sketchfab.py
│       │   │   └── supabase.py
│       │   └── models/
│       │       └── schemas.py
│       ├── requirements.txt
│       └── render.yaml
│
└── config/
    └── agent_instructions.md
```

---

## 2. API Endpoints

### Health Check
**GET /health**

Prevents Render free-tier spin-down.

Response:
```json
{
  "status": "healthy",
  "timestamp": "2026-09-12T11:10:34Z",
  "uptime_seconds": 142850
}
```

### Create Checkout
**POST /api/v1/checkout/create**

Computes gross-up pricing and returns Creem checkout URL.

Request:
```json
{
  "model_id": "model_01H9X3Z",
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
  "currency": "USD"
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
      "model_id": "model_01H9X3Z",
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

-- 5. Users Table (Admin Panel)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT CHECK (role IN ('owner', 'admin', 'editor')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. AI Audit Logs Table
CREATE TABLE ai_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type TEXT NOT NULL,
  executed_by TEXT DEFAULT 'AI_Agent',
  details JSONB NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
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

## 5. Backend Implementation Details

### Main Application Structure
```python
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import hmac
import hashlib
import os
import httpx
from pydantic import BaseModel, EmailStr

app = FastAPI(title="Mescript Labs Backend", version="1.0.0")

# CORS Configuration
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,https://mescriptlabs.com").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Pricing Calculation
```python
def calculate_gross_price(target_net: float) -> float:
    """Calculates gross price required to cover Creem transaction fees."""
    gross = (target_net + 0.45) / (1.0 - 0.048)
    return round(gross, 2)
```

### Webhook Signature Verification
```python
def verify_webhook_signature(signature: str, body: bytes, secret: str) -> bool:
    computed_sig = hmac.new(
        secret.encode("utf-8"),
        body,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(computed_sig, signature)
```

### Webhook Handler with Idempotency
```python
import secrets
from datetime import datetime, timedelta, timezone

@router.post("/webhooks/creem")
async def handle_creem_webhook(request: Request):
    # 1. Validate HMAC Signature
    signature = request.headers.get("x-creem-signature")
    body = await request.body()
    
    computed_sig = hmac.new(
        CREEM_WEBHOOK_SECRET.encode("utf-8"),
        body,
        hashlib.sha256
    ).hexdigest()
    
    if not signature or not hmac.compare_digest(computed_sig, signature):
        raise HTTPException(status_code=401, detail="Invalid signature")

    payload = await request.json()
    event_id = payload.get("data", {}).get("transaction_id")
    event_type = payload.get("event")

    # 2. Idempotency Check: Don't process duplicate webhooks
    existing_event = supabase.table("webhook_events").select("*").eq("event_id", event_id).execute()
    if existing_event.data:
        return {"status": "already_processed"}

    # 3. Log Webhook Event
    supabase.table("webhook_events").insert({
        "event_id": event_id,
        "event_type": event_type,
        "payload": payload,
        "status": "processing"
    }).execute()

    # 4. Process Payment & Issue 24-Hour Download Token
    if event_type == "checkout.paid":
        metadata = payload["data"].get("metadata", {})
        buyer_email = payload["data"]["customer"]["email"]
        github_asset_id = metadata.get("github_asset_id", "default_asset_id")

        # Generate unique 24-hour token
        secure_token = secrets.token_urlsafe(32)
        expires_at = datetime.now(timezone.utc) + timedelta(hours=24)

        supabase.table("download_tokens").insert({
            "token": secure_token,
            "buyer_email": buyer_email,
            "github_asset_id": github_asset_id,
            "expires_at": expires_at.isoformat(),
            "max_downloads": 5
        }).execute()

        # Update webhook status to processed
        supabase.table("webhook_events").update({
            "status": "processed",
            "processed_at": datetime.now(timezone.utc).isoformat()
        }).eq("event_id", event_id).execute()

        # Return download URL
        download_link = f"https://mescriptlabs.com/api/v1/assets/download?token={secure_token}"
        return {"status": "success", "download_link": download_link}

    return {"status": "ignored_event"}
```

### Token-Verified Asset Download
```python
@router.get("/api/v1/assets/download")
async def download_asset_with_token(token: str = Query(...)):
    # 1. Fetch token record from DB
    res = supabase.table("download_tokens").select("*").eq("token", token).execute()
    if not res.data:
        raise HTTPException(status_code=403, detail="Invalid or expired download token")

    record = res.data[0]
    expires_at = datetime.fromisoformat(record["expires_at"])

    # 2. Verify expiration & download limits
    if datetime.now(timezone.utc) > expires_at:
        raise HTTPException(status_code=410, detail="Download link has expired (24-hour limit reached)")
    
    if record["download_count"] >= record["max_downloads"]:
        raise HTTPException(status_code=429, detail="Maximum download attempts reached")

    # 3. Increment download count
    supabase.table("download_tokens").update({
        "download_count": record["download_count"] + 1
    }).eq("token", token).execute()

    # 4. Stream binary from GitHub Release Asset
    asset_id = record["github_asset_id"]
    github_url = f"https://api.github.com/repos/{GITHUB_ASSET_REPO}/releases/assets/{asset_id}"
    
    headers = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "application/octet-stream"
    }

    client = httpx.AsyncClient()
    req = client.build_request("GET", github_url, headers=headers)
    gh_res = await client.send(req, stream=True)

    if gh_res.status_code != 200:
        await gh_res.aclose()
        await client.aclose()
        raise HTTPException(status_code=500, detail="Failed to fetch asset from private store")

    return StreamingResponse(
        gh_res.aiter_raw(),
        media_type="application/octet-stream",
        headers={"Content-Disposition": f'attachment; filename="asset_{asset_id}.zip"'},
        background=httpx.AsyncClient().aclose
    )
```

### Local Development Mock Endpoint
```python
from fastapi import APIRouter

router = APIRouter(prefix="/mock", tags=["Development Mocking"])

@router.post("/simulate-buy")
async def simulate_purchase(model_id: str, email: str):
    """Generates a real working 24-hr download token locally without paying."""
    mock_token = f"mock_{secrets.token_urlsafe(16)}"
    
    return {
        "message": "Mock transaction successful",
        "buyer_email": email,
        "model_id": model_id,
        "mock_download_url": f"http://localhost:8000/api/v1/assets/download?token={mock_token}",
        "expires_in": "24 hours"
    }
```

### License Tiers
- **Individual** : Personal use, single project
- **Indie Team** : Small teams, commercial use
- **AAA Studio** : Large studios, unlimited use

### Environment Variables
- `ALLOWED_ORIGINS`: Comma-separated CORS origins
- `CREEM_API_KEY`: Creem API key for checkout creation
- `CREEM_WEBHOOK_SECRET`: Webhook HMAC signature secret
- `GITHUB_TOKEN`: GitHub personal access token for asset access
- `GITHUB_ASSET_REPO`: Private GitHub repository for assets
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (bypasses RLS)
- `ALLOW_AI_OPS`: Emergency kill switch for AI operations (True/False)

---

## 5.1 Environment Variables Configuration

### Backend Environment Variables (Render)
```bash
# Creem Integration
CREEM_API_KEY=your_creem_api_key_here
CREEM_WEBHOOK_SECRET=your_webhook_secret_here

# GitHub Integration
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
GITHUB_ASSET_REPO=MescriptLabs/private-assets

# Supabase Integration
SUPABASE_URL=https://xyz.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# CORS & Security
ALLOWED_ORIGINS=https://mescriptlabs.com,http://localhost:3000

# AI Operations
ALLOW_AI_OPS=True
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

### Render Backend (render.yaml)
```yaml
services:
  - type: web
    name: mescript-labs-api
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: ALLOWED_ORIGINS
        value: https://mescriptlabs.com
      - key: CREEM_API_KEY
        sync: false
      - key: CREEM_WEBHOOK_SECRET
        sync: false
      - key: GITHUB_TOKEN
        sync: false
      - key: GITHUB_ASSET_REPO
        value: MescriptLabs/private-assets
```

### Render Frontend
- Static export from Next.js (`output: "export"`)
- Deployed to Render Static Sites
- Connected to GitHub repository
- Auto-deploy on push to main branch

### Health Check Cron
- External cron service (cron-job.org or similar)
- Pings `/health` endpoint every 10 minutes
- Prevents Render free-tier spin-down

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
- Initialize FastAPI project in `apps/backend`
- Set up CORS, health endpoint, environment variables
- Test locally with `uvicorn`

### Phase 5: Backend Core
- Implement checkout creation endpoint with Creem integration
- Implement webhook handler with idempotency and token generation
- Implement token-verified asset download endpoint
- Add mock endpoint for local testing without real payments

### Phase 6: Backend Deployment
- Deploy backend to Render
- Configure webhook URL in Creem dashboard
- Set up external cron job for health check (prevent spin-down)

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
- Deploy to Render Static Sites
- Configure custom domain (if available)

### Phase 11: Testing & Verification
- End-to-end payment flow test
- Asset download verification
- Webhook retry testing
- Security audit

### Recommended Starting Point
Begin with **Phase 1 (Supabase schema)** since you already have the account. This provides the database foundation before any code development.