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

### Transactions Table
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id VARCHAR(255) UNIQUE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  type VARCHAR(50) NOT NULL, -- 'goal_donation', 'one_time_donation', 'marketplace_purchase'
  status VARCHAR(50) NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  user_info JSONB,
  metadata JSONB
);
```

### Sponsorship Goals Table
```sql
CREATE TABLE sponsorship_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  target_amount DECIMAL(10,2) NOT NULL,
  current_amount DECIMAL(10,2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'completed', 'cancelled'
  created_at TIMESTAMP DEFAULT NOW(),
  deadline TIMESTAMP
);
```

### Users Table (Admin Panel)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL, -- 'owner', 'admin', 'editor'
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
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

### License Tiers
- **Individual** ($10.00): Personal use, single project
- **Indie Team** ($25.00): Small teams, commercial use
- **AAA Studio** ($100.00): Large studios, unlimited use

### Environment Variables
- `ALLOWED_ORIGINS`: Comma-separated CORS origins
- `CREEM_API_KEY`: Creem API key for checkout creation
- `CREEM_WEBHOOK_SECRET`: Webhook HMAC signature secret
- `GITHUB_TOKEN`: GitHub personal access token for asset access
- `GITHUB_ASSET_REPO`: Private GitHub repository for assets
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_KEY`: Supabase service role key

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