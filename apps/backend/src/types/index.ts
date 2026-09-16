// TypeScript type definitions for the backend

export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  individual_price: number;
  indie_team_price: number;
  aaa_studio_price: number;
  currency: string;
  sketchfab_model_uid?: string;
  github_asset_id?: string;
  thumbnail_url?: string;
  metadata?: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WebhookEvent {
  id: string;
  event_id: string;
  event_type: string;
  payload: Record<string, any>;
  status: 'pending' | 'processing' | 'processed' | 'failed';
  attempts: number;
  created_at: string;
  processed_at?: string;
}

export interface DownloadToken {
  id: string;
  token: string;
  buyer_email: string;
  github_asset_id: string;
  expires_at: string;
  download_count: number;
  max_downloads: number;
  created_at: string;
}

export interface Transaction {
  id: string;
  transaction_id: string;
  amount: number;
  currency: string;
  type: string;
  status: string;
  buyer_email: string;
  metadata?: Record<string, any>;
  created_at: string;
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

export interface User {
  id: string;
  email: string;
  password_hash: string;
  role: 'owner' | 'admin' | 'editor' | 'user';
  created_at: string;
  last_login?: string;
}

export interface AIAuditLog {
  id: string;
  action_type: string;
  executed_by: string;
  details: Record<string, any>;
  status: string;
  created_at: string;
}
