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
  r2_model_key?: string;
  model_url?: string;
  sketchfab_model_uid?: string;
  github_asset_id?: string;
  thumbnail_url?: string;
  metadata?: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
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

  return (data ?? []) as Product[];
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

  return data as Product | null;
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
