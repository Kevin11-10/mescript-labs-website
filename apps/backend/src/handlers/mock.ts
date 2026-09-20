import { corsHeaders } from '../config.js';

interface MockBuyRequest {
  product_id: string;
  email: string;
}

export async function handleMockBuy(request: Request): Promise<Response> {
  try {
    const body = await request.json() as MockBuyRequest;
    const mockToken = `mock_${crypto.randomUUID()}`;
    
    return new Response(
      JSON.stringify({
        message: 'Mock transaction successful',
        buyer_email: body.email,
        product_id: body.product_id,
        mock_download_url: `http://localhost:8787/api/v1/assets/download?token=${mockToken}`,
        expires_in: '24 hours'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Mock buy error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process mock transaction' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
