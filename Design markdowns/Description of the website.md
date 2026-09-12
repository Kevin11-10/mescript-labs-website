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

---

## 3. Payment Flow

1. User selects license tier and format
2. Frontend calls `/api/v1/checkout/create`
3. Backend calculates gross price and requests Creem checkout
4. User redirected to Creem for payment
5. Creem sends webhook to `/webhooks/creem`
6. Backend verifies signature and logs to Supabase
7. User redirected to success page
8. User downloads asset via `/api/v1/assets/download/{asset_id}`

---

## 4. Backend Implementation

### Pricing Formula
```
Gross = (Target + 0.45) / (1 - 0.048)
```

### License Tiers
- Individual: $10.00
- Indie Team: $25.00
- AAA Studio: $100.00

### Environment Variables
- `ALLOWED_ORIGINS`: Comma-separated CORS origins
- `CREEM_API_KEY`: Creem API key
- `CREEM_WEBHOOK_SECRET`: Webhook HMAC secret
- `GITHUB_TOKEN`: GitHub personal access token
- `GITHUB_ASSET_REPO`: Private assets repo

---

## 5. Frontend Components

### SketchfabViewer
Interactive 3D model viewer using Sketchfab embeds.

### CheckoutModal
Modal for selecting license tier, format, and email before checkout.

### YouTubeEmbed
Responsive YouTube video embed with lazy loading.

---

## 6. AI Prompts for Development

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

## 7. Design System

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