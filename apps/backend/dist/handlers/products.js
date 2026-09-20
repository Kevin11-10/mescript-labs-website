import { corsHeaders } from '../config.js';
import { createSupabaseService } from '../services/supabase.js';
const fallbackProducts = [
    {
        id: '1',
        title: 'Sci-Fi Character Pack',
        description: 'Collection of futuristic character models with full rigging and animations for game development.',
        category: 'Characters',
        individual_price: 15,
        indie_team_price: 25,
        aaa_studio_price: 50,
        currency: 'USD',
        sketchfab_model_uid: 'abc123',
        github_asset_id: 'default_asset_id',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
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
        sketchfab_model_uid: 'def456',
        github_asset_id: 'default_asset_id',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
];
export async function handleProductList(request) {
    try {
        const env = request.env;
        const supabase = createSupabaseService({
            url: env.SUPABASE_URL,
            serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
        });
        const { data, error } = await supabase.getProducts();
        const products = data && data.length > 0 ? data : fallbackProducts;
        return new Response(JSON.stringify(products), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
    catch (error) {
        console.error('Product list error:', error);
        return new Response(JSON.stringify(fallbackProducts), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
}
export async function handleProductById(request, productId) {
    try {
        const env = request.env;
        const supabase = createSupabaseService({
            url: env.SUPABASE_URL,
            serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
        });
        const { data, error } = await supabase.getProductById(productId);
        if (error || !data) {
            const fallback = fallbackProducts.find((item) => item.id === productId) ?? fallbackProducts[0];
            return new Response(JSON.stringify(fallback), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }
        return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
    catch (error) {
        console.error('Product detail error:', error);
        const fallback = fallbackProducts.find((item) => item.id === productId) ?? fallbackProducts[0];
        return new Response(JSON.stringify(fallback), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
}
