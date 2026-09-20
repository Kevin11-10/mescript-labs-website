// API client for backend communication

const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:8787';

export interface CheckoutRequest {
  product_id: string;
  license_tier: 'individual' | 'indie_team' | 'aaa_studio';
  requested_format: string;
  buyer_email: string;
}

export interface CheckoutResponse {
  checkout_url: string;
  calculated_gross_price: number;
  net_target: number;
  currency: string;
  product_title: string;
  license_tier: string;
}

export interface ProductRecord {
  id: string;
  title: string;
  description: string;
  category: string;
  individual_price: number;
  indie_team_price: number;
  aaa_studio_price: number;
  currency: string;
  hf_model_key?: string;
  model_url?: string;
  sketchfab_model_uid?: string;
  github_asset_id?: string;
  thumbnail_url?: string;
  metadata?: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const FALLBACK_PRODUCTS: ProductRecord[] = [
  {
    id: '1',
    title: 'Sci-Fi Character Pack',
    description: 'Collection of futuristic character models with full rigging and animations for game development.',
    category: 'Characters',
    individual_price: 15,
    indie_team_price: 25,
    aaa_studio_price: 50,
    currency: 'USD',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    hf_model_key: 'sci-fi-character-pack.glb',
    model_url: 'https://example.com/models/sci-fi-character-pack.glb',
  },
  {
    id: '2',
    title: 'Urban Environment Set',
    description: 'Modular city buildings and street props for creating realistic urban environments.',
    category: 'Environment',
    individual_price: 20,
    indie_team_price: 35,
    aaa_studio_price: 60,
    currency: 'USD',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    hf_model_key: 'urban-environment-set.glb',
    model_url: 'https://example.com/models/urban-environment-set.glb',
  },
];

function normalizeProduct(product: any): ProductRecord {
  return {
    id: String(product?.id ?? '0'),
    title: product?.title ?? 'Untitled Product',
    description: product?.description ?? '',
    category: product?.category ?? 'General',
    individual_price: Number(product?.individual_price ?? product?.individualPrice ?? 0),
    indie_team_price: Number(product?.indie_team_price ?? product?.indieTeamPrice ?? 0),
    aaa_studio_price: Number(product?.aaa_studio_price ?? product?.aaaStudioPrice ?? 0),
    currency: product?.currency ?? 'USD',
    hf_model_key: product?.hf_model_key ?? product?.r2_model_key ?? product?.r2ModelKey,
    model_url: product?.model_url ?? product?.modelUrl ?? product?.sketchfab_model_uid ?? product?.sketchfabModelUid,
    sketchfab_model_uid: product?.sketchfab_model_uid ?? product?.sketchfabModelUid,
    github_asset_id: product?.github_asset_id ?? product?.githubAssetId,
    thumbnail_url: product?.thumbnail_url ?? product?.thumbnailUrl,
    metadata: product?.metadata ?? {},
    is_active: Boolean(product?.is_active ?? product?.isActive ?? true),
    created_at: product?.created_at ?? product?.createdAt ?? new Date().toISOString(),
    updated_at: product?.updated_at ?? product?.updatedAt ?? new Date().toISOString(),
  };
}

export async function fetchProducts(): Promise<ProductRecord[]> {
  try {
    const response = await fetch(`${API_URL}/api/v1/products`, { method: 'GET' });
    if (!response.ok) {
      return FALLBACK_PRODUCTS;
    }
    const data = await response.json();
    const products = Array.isArray(data) ? data.map(normalizeProduct) : FALLBACK_PRODUCTS;
    return products.length > 0 ? products : FALLBACK_PRODUCTS;
  } catch {
    return FALLBACK_PRODUCTS;
  }
}

export async function fetchProductById(productId: string): Promise<ProductRecord | null> {
  try {
    const response = await fetch(`${API_URL}/api/v1/products/${productId}`);
    if (!response.ok) {
      return FALLBACK_PRODUCTS.find((product) => product.id === productId) ?? null;
    }
    const data = await response.json();
    const normalized = data ? normalizeProduct(data) : FALLBACK_PRODUCTS.find((product) => product.id === productId) ?? null;
    return normalized;
  } catch {
    return FALLBACK_PRODUCTS.find((product) => product.id === productId) ?? null;
  }
}

export async function createCheckout(request: CheckoutRequest): Promise<CheckoutResponse> {
  const response = await fetch(`${API_URL}/api/v1/checkout/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      product_id: request.product_id,
      license_tier: request.license_tier,
      requested_format: request.requested_format,
      buyer_email: request.buyer_email,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create checkout');
  }

  return response.json();
}

export async function downloadAsset(token: string): Promise<Blob> {
  const response = await fetch(`${API_URL}/api/v1/assets/download?token=${token}`);

  if (!response.ok) {
    throw new Error('Failed to download asset');
  }

  return response.blob();
}

export async function mockBuy(productId: string, email: string): Promise<any> {
  const response = await fetch(`${API_URL}/mock/simulate-buy`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ product_id: productId, email }),
  });

  if (!response.ok) {
    throw new Error('Failed to simulate buy');
  }

  return response.json();
}
