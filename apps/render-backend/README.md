Mescript Labs — Render fallback AI proxy

This small Express app is designed to run on Render as a lightweight AI proxy that calls the Hugging Face Inference API and returns structured JSON drafts for the backend to consume.

Environment variables
- `HUGGINGFACE_API_KEY` — (optional) your HF API key. If omitted, the server returns a simple template-based fallback.
- `HUGGINGFACE_MODEL` — (optional) HF model to use, defaults to `gpt2`.

Start locally
1. Install deps: `npm install`
2. Run: `npm start`

Deploy to Render
1. Create a new Web Service in Render, connect to this repo path `apps/render-backend`.
2. Set Build Command: `npm ci` and Start Command: `npm start`.
3. Add environment variables `HUGGINGFACE_API_KEY` and `HUGGINGFACE_MODEL` in Render dashboard.

Usage
- `POST /generate` with JSON `{ "prompt": "...", "context": "..." }` returns `{ title, summary, body, suggestions }`.
- `GET /health` for readiness.
