import { createClient } from '@supabase/supabase-js';
export class SupabaseService {
    constructor(config) {
        if (!config.url || !config.serviceRoleKey) {
            throw new Error('Supabase URL and service role key are required.');
        }
        this.client = createClient(config.url, config.serviceRoleKey, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
            },
        });
    }
    getClient() {
        return this.client;
    }
    async getProducts() {
        const { data, error } = await this.client
            .from('products')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });
        return { data: data ?? [], error: error ? new Error(error.message) : null };
    }
    async getProductById(productId) {
        const { data, error } = await this.client
            .from('products')
            .select('*')
            .eq('id', productId)
            .single();
        return { data, error: error ? new Error(error.message) : null };
    }
    async getWebhookEventByTransactionId(transactionId) {
        const { data, error } = await this.client
            .from('webhook_events')
            .select('*')
            .eq('event_id', transactionId)
            .maybeSingle();
        return { data, error: error ? new Error(error.message) : null };
    }
    async insertWebhookEvent(event) {
        const { data, error } = await this.client
            .from('webhook_events')
            .insert(event)
            .select();
        return { data: data ?? null, error: error ? new Error(error.message) : null };
    }
    async markWebhookProcessed(eventId) {
        const { error } = await this.client
            .from('webhook_events')
            .update({
            status: 'processed',
            processed_at: new Date().toISOString(),
        })
            .eq('event_id', eventId);
        return { error: error ? new Error(error.message) : null };
    }
    async getDownloadToken(token) {
        const { data, error } = await this.client
            .from('download_tokens')
            .select('*')
            .eq('token', token)
            .maybeSingle();
        return { data, error: error ? new Error(error.message) : null };
    }
    async insertDownloadToken(tokenRecord) {
        const { data, error } = await this.client
            .from('download_tokens')
            .insert(tokenRecord)
            .select();
        return { data: data ?? null, error: error ? new Error(error.message) : null };
    }
    async incrementDownloadCount(token, currentCount) {
        const { error } = await this.client
            .from('download_tokens')
            .update({ download_count: currentCount + 1 })
            .eq('token', token);
        return { error: error ? new Error(error.message) : null };
    }
}
export function createSupabaseService(config) {
    return new SupabaseService(config);
}
