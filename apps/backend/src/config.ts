// Environment configuration and secrets loader
export interface Env {
  CREEM_API_KEY: string;
  CREEM_WEBHOOK_SECRET: string;
  GITHUB_TOKEN: string;
  GITHUB_ASSET_REPO: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  GITHUB_WRITE_TOKEN?: string;
  GITHUB_REPO_OWNER?: string;
  GITHUB_REPO_NAME?: string;
  GITHUB_DEFAULT_BRANCH?: string;
  GITHUB_WEBHOOK_SECRET?: string;
  GITHUB_APP_ID?: string;
  GITHUB_APP_PRIVATE_KEY?: string;
  ALLOWED_ORIGINS?: string;
  ALLOW_AI_OPS?: string;
  OPENAI_API_KEY?: string;
  ANTHROPIC_API_KEY?: string;
  AI_SERVICE_URL?: string;
  AI_SERVICE_API_KEY?: string;
  AI_MODEL?: string;
  HF_TOKEN?: string;
  HF_DATASET_REPO?: string;
  HF_ACCESS_LEVEL?: string;
  HUGGINGFACE_DATASET_PUBLIC_URL?: string;
  HUGGINGFACE_DATASET_BASE_URL?: string;
  HUGGINGFACE_PRIVATE_DATASET_URL?: string;
  HUGGINGFACE_API_KEY?: string;
  HUGGINGFACE_MODEL?: string;
  AI_ADMIN_APPROVAL_REQUIRED?: string;
  ADMIN_SESSION_SECRET?: string;
  ADMIN_JWT_SECRET?: string;
  ADMIN_EMAIL?: string;
  API_BASE_URL?: string;
  MODEL_VIEWER_BASE_URL?: string;
  IMGBB_API_KEY?: string;
  R2_ACCOUNT_ID?: string;
  R2_ACCESS_KEY_ID?: string;
  R2_SECRET_ACCESS_KEY?: string;
  R2_BUCKET_NAME?: string;
  R2_PUBLIC_URL?: string;
}

// CORS headers
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export function validateEnv(env: Env): void {
  const required = [
    'CREEM_API_KEY',
    'CREEM_WEBHOOK_SECRET',
    'GITHUB_TOKEN',
    'GITHUB_ASSET_REPO',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'HF_TOKEN',
    'HF_DATASET_REPO'
  ];

  const missing = required.filter(key => !env[key as keyof Env]);
  
  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing.join(', '));
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }
}
