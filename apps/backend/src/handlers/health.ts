import { corsHeaders } from '../config';

export function handleHealth(): Response {
  return new Response(
    JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString()
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
