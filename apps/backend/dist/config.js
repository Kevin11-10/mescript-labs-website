// CORS headers
export const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
export function validateEnv(env) {
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
    const missing = required.filter(key => !env[key]);
    if (missing.length > 0) {
        console.warn('Missing environment variables:', missing.join(', '));
        if (process.env.NODE_ENV === 'production') {
            throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
        }
    }
}
