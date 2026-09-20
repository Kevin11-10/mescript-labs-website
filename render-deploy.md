# Render deployment instructions

Add the following two services to Render (or use `render.yaml` in this repo):

- Frontend: `mescript-labs-web`
  - Build Command: `cd apps/web && npm ci && npm run build`
  - Start Command: `cd apps/web && npm run start`
  - Environment variables:
    - `API_BASE_URL` -> URL of backend service
    - `MODEL_VIEWER_BASE_URL` -> e.g. `https://app.mescriptlabs.workers.dev/3d`

- Backend: `mescript-labs-backend`
  - Build Command: `cd apps/backend && npm ci && npm run render-build`
  - Start Command: `cd apps/backend && npm run render-start`
  - Environment variables (mark secrets as secure in Render):
    - `SUPABASE_URL`
    - `SUPABASE_SERVICE_ROLE_KEY`
    - `HUGGINGFACE_API_KEY`
    - `HUGGINGFACE_PRIVATE_DATASET_URL` (if private)
    - `CREEM_API_KEY`, `CREEM_WEBHOOK_SECRET`
    - `GITHUB_TOKEN`, `GITHUB_WRITE_TOKEN`
    - `ADMIN_SESSION_SECRET`, `ADMIN_JWT_SECRET`, `ADMIN_EMAIL`

Notes:
- `render.yaml` is included at the repo root as a template you can import into Render.
- Be sure to set the backend `API_BASE_URL` to the backend's public URL and point the frontend `API_BASE_URL` at it.
- Do NOT commit secrets to the repo; use Render's dashboard to set secure env vars.
