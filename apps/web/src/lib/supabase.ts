import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.PUBLIC_SUPABASE_URL;
const anonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

if (url && anonKey) {
  client = createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

export const supabase = client;

export async function getCurrentUser() {
  if (!supabase) {
    return null;
  }

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    const message = error.message || '';
    if (message.includes('Auth session missing') || message.includes('No active session') || message.includes('session')) {
      return null;
    }
    return null;
  }

  return user;
}

export async function signInAdmin(email: string, password: string) {
  if (!supabase) {
    throw new Error('Supabase is not configured. Add PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY.');
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw error;
  }

  const role = data.user?.app_metadata?.role ?? data.user?.user_metadata?.role;
  if (role !== 'admin') {
    await supabase.auth.signOut();
    throw new Error('This account is not an admin.');
  }

  return data.user;
}

export async function signOutAdmin() {
  if (!supabase) {
    return;
  }

  await supabase.auth.signOut();
}

export interface Product {
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

export function formatCatalogProduct(product: any): Product {
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

export async function getProducts(): Promise<Product[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    const message = error.message || '';
    if (message.includes('Could not find the table') || message.includes('does not exist')) {
      return [];
    }
    console.error('Error fetching products:', error);
    return [];
  }

  return (data ?? []).map(formatCatalogProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    const message = error.message || '';
    if (message.includes('Could not find the table') || message.includes('does not exist')) {
      return null;
    }
    console.error('Error fetching product:', error);
    return null;
  }

  return data ? formatCatalogProduct(data) : null;
}

export function subscribeToProducts(onProducts: (products: Product[]) => void): () => void {
  if (!supabase) {
    return () => {};
  }

  const channel = supabase
    .channel('products-marketplace')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'products' },
      async () => {
        const nextProducts = await getProducts();
        onProducts(nextProducts);
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export interface SponsorshipGoal {
  id: string;
  title: string;
  description?: string;
  target_amount: number;
  current_amount: number;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
}

export async function getSponsorshipGoals(): Promise<SponsorshipGoal[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('sponsorship_goals')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) {
    const message = error.message || '';
    if (message.includes('Could not find the table') || message.includes('does not exist')) {
      return [];
    }
    console.error('Error fetching sponsorship goals:', error);
    return [];
  }

  return (data ?? []) as SponsorshipGoal[];
}
