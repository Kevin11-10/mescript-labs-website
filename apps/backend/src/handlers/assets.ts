import { corsHeaders, type Env } from '../config';
import { createSupabaseService } from '../services/supabase';

export async function handleAssetDownload(request: Request): Promise<Response> {
  try {
    const env = (request as any).env as Env;
    const url = new URL(request.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Token required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (token.startsWith('mock_')) {
      const mockContent = 'This is a mock asset file for testing purposes.';
      return new Response(mockContent, {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': 'attachment; filename="mock_asset.zip"',
          'Cache-Control': 'no-store, private',
        },
      });
    }

    const supabase = createSupabaseService({
      url: env.SUPABASE_URL,
      serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
    });

    const { data: record, error: tokenError } = await supabase.getDownloadToken(token);

    if (tokenError || !record) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (new Date() > new Date(record.expires_at)) {
      return new Response(
        JSON.stringify({ error: 'Download link expired' }),
        { status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (record.download_count >= record.max_downloads) {
      return new Response(
        JSON.stringify({ error: 'Maximum downloads reached' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const incrementResult = await supabase.incrementDownloadCount(token, Number(record.download_count || 0));
    if (incrementResult.error) {
      console.error('Failed to increment download count:', incrementResult.error.message);
    }

    const assetId = record.github_asset_id;
    const githubUrl = `https://api.github.com/repos/${env.GITHUB_ASSET_REPO}/releases/assets/${assetId}`;

    const response = await fetch(githubUrl, {
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        Accept: 'application/octet-stream',
      },
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch asset from GitHub' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(response.body, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="asset_${assetId}.zip"`,
        'Cache-Control': 'no-store, private',
      },
    });
  } catch (error) {
    console.error('Asset download error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process download' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
