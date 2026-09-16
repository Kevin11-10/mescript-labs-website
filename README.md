# Mescript Labs Website

A comprehensive 3D asset marketplace website built with Astro frontend and Cloudflare Workers backend.

## Architecture

- **Frontend**: Astro with Tailwind CSS, deployed on Cloudflare Pages
- **Backend**: Cloudflare Workers with itty-router
- **Database**: Supabase for data persistence
- **Payments**: Creem for payment processing
- **Asset Storage**: Cloudflare R2 and GitHub private releases
- **3D Models**: self-hosted R2 assets with a custom model viewer

## Project Structure

```
mescript-labs-monorepo/
├── apps/
│   ├── web/                         # Astro Frontend
│   │   ├── src/
│   │   │   ├── pages/               # Astro pages
│   │   │   ├── components/          # Astro components
│   │   │   ├── lib/                 # Client utilities
│   │   │   └── styles/              # Global styles
│   │   └── package.json
│   │
│   └── backend/                     # Cloudflare Workers Backend
│       ├── src/
│       │   ├── handlers/            # API handlers
│       │   ├── services/            # External services
│       │   └── types/               # TypeScript types
│       ├── wrangler.toml            # Cloudflare Workers config
│       └── package.json
│
└── Design markdowns/                # Design specifications
```

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn
- Cloudflare account (for Workers and Pages)
- Supabase account
- Creem account
- GitHub account

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mescript-labs-monorepo
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd apps/backend
   npm install

   # Frontend
   cd ../web
   npm install
   ```

3. **Configure environment variables**

   **Backend (.dev.vars for local development):**
   ```env
   CREEM_API_KEY=your_creem_api_key
   CREEM_WEBHOOK_SECRET=your_webhook_secret
   GITHUB_TOKEN=your_github_token
   GITHUB_ASSET_REPO=MescriptLabs/private-assets
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ALLOWED_ORIGINS=http://localhost:4321,https://app.mescriptlabs.workers.dev
   ALLOW_AI_OPS=true
   ```

   **Frontend (.env):**
   ```env
   PUBLIC_API_URL=http://localhost:8787
   PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

### Database Setup

1. Create a Supabase project
2. Run the SQL schema from `Design markdowns/Description of the website.md`
3. Enable UUID extension
4. Create the required tables:
   - webhook_events
   - download_tokens
   - transactions
   - sponsorship_goals
   - users
   - products
   - ai_audit_logs

### Local Development

**Start the backend:**
```bash
cd apps/backend
npm run dev
```
Backend will run on http://localhost:8787

**Start the frontend:**
```bash
cd apps/web
npm run dev
```
Frontend will run on http://localhost:4321

### Deployment

**Deploy Backend to Cloudflare Workers:**
```bash
cd apps/backend
npm run deploy
```

**Deploy Frontend to Cloudflare Pages:**
1. Connect your GitHub repository to Cloudflare Pages
2. Configure build settings:
   - Framework: Astro
   - Build command: `npm run build`
   - Output directory: `dist`
3. Deploy on push to main branch

## API Endpoints

### Health Check
- `GET /health` - Worker health status

### Checkout
- `POST /api/v1/checkout/create` - Create checkout session

### Webhooks
- `POST /webhooks/creem` - Creem payment webhook

### Assets
- `GET /api/v1/assets/download?token={token}` - Download asset with token

### File Uploads (R2)
- `POST /api/v1/uploads/request` — Request signed upload URL(s) for `fbx`, `zip` (obj + textures), or `glb` files. Backend returns an upload `id` and a short-lived signed URL to upload directly to Cloudflare R2.
- `POST /api/v1/uploads/complete` — Notify backend the upload finished; backend validates file, creates thumbnails if needed, and writes `r2_model_key` / `model_url` metadata to the `products` table in Supabase.

Required backend env vars for uploads (add to `apps/backend/.dev.vars` or Cloudflare secrets):
- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME`
- `R2_PUBLIC_URL` (optional)

Notes:
- The frontend `CustomModelViewer` uses `model_url` for streaming GLB; the marketplace layout keeps the Sketchfab-style embed layout but sources the embed from `model_url`/r2 keys.

### Mock (for testing)
- `POST /mock/simulate-buy` - Simulate purchase without real payment

## License Tiers

- **Individual**: Personal use, single project
- **Indie Team**: Small teams, commercial use
- **AAA Studio**: Large studios, unlimited use

## Security Features

- Webhook signature verification (HMAC SHA-256)
- Token-based asset downloads with expiration
- Rate limiting on API endpoints
- CORS protection
- Environment variable secrets

## Development Roadmap

- [ ] Supabase database setup
- [ ] Creem payment integration
- [ ] GitHub asset repository setup
- [ ] Real-time asset streaming
- [ ] Admin panel authentication
- [ ] AI integration for content management
- [ ] Custom domain configuration

## Support

For issues and questions, please contact support@mescriptlabs.com

## License

Copyright © 2024 Mescript Labs. All rights reserved.
