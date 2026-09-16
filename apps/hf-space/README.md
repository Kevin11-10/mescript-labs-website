Mescript Labs — AI Draft Prototype (Hugging Face Space)

This is a lightweight Gradio-based prototype intended to be deployed as a Hugging Face Space to serve as a predictable AI fallback for testing and local development.

How it works
- The app exposes a simple UI that accepts a `prompt` and optional `context` and returns structured JSON with `title`, `summary`, `body`, and `suggestions`.
- It's intentionally simple (template-based) so it doesn't require heavy ML dependencies and starts quickly on Hugging Face Spaces.

Deploy to Hugging Face Spaces
1. Create a new Space on Hugging Face and choose `Gradio` as the SDK.
2. Push this folder's contents to the Space (or upload files via the web UI).
3. Set the Space to public (or private if you prefer) and note its URL.

Use from backend
- Set `AI_SERVICE_URL` to your Space's base URL (e.g. `https://mescript-ai-fallback.hf.space`) in `apps/backend/.dev.vars` or Cloudflare Worker env.
- The backend will call `${AI_SERVICE_URL}/generate` (the Space UI uses Gradio but the backend already integrates with Spaces via the existing `callAiService` flow; for more advanced API usage you can adapt the Space to expose a JSON POST endpoint).
