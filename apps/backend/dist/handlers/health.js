import { corsHeaders } from '../config.js';
export function handleHealth() {
    return new Response(JSON.stringify({
        status: 'healthy',
        timestamp: new Date().toISOString()
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}
