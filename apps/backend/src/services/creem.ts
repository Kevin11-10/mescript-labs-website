// Creem payment service for checkout management

export interface CreemCheckoutRequest {
  amount: number;
  currency: string;
  metadata?: Record<string, any>;
  customer_email?: string;
  product_title?: string;
  success_url?: string;
  cancel_url?: string;
}

export interface CreemCheckoutResponse {
  checkout_url: string;
  checkout_id: string;
  amount: number;
  currency: string;
  status: string;
}

export class CreemService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async createCheckout(request: CreemCheckoutRequest): Promise<CreemCheckoutResponse | null> {
    try {
      const response = await fetch('https://api.creem.io/v1/checkouts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: request.amount,
          currency: request.currency,
          customer_email: request.customer_email,
          metadata: request.metadata,
          success_url: request.success_url,
          cancel_url: request.cancel_url,
          product_title: request.product_title,
        }),
      });

      if (!response.ok) {
        const payload = await response.text();
        console.error('Creem API error:', payload);
        return null;
      }

      const responseJson = (await response.json()) as Record<string, any>;
      return {
        checkout_url: responseJson.checkout_url || responseJson.url || '',
        checkout_id: responseJson.id || responseJson.checkout_id || '',
        amount: responseJson.amount ?? request.amount,
        currency: responseJson.currency ?? request.currency,
        status: responseJson.status ?? 'pending',
      };
    } catch (error) {
      console.error('Creem checkout creation error:', error);
      return null;
    }
  }

  async getCheckout(checkoutId: string): Promise<CreemCheckoutResponse | null> {
    try {
      const response = await fetch(`https://api.creem.io/v1/checkouts/${checkoutId}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return null;
      }

      const responseJson = (await response.json()) as Record<string, any>;
      return {
        checkout_url: responseJson.checkout_url || responseJson.url || '',
        checkout_id: responseJson.id || responseJson.checkout_id || checkoutId,
        amount: responseJson.amount ?? 0,
        currency: responseJson.currency ?? 'USD',
        status: responseJson.status ?? 'pending',
      };
    } catch (error) {
      console.error('Creem checkout fetch error:', error);
      return null;
    }
  }
}
