import type { Env } from '../config';
import { GitHubService } from '../services/github';

function requiresAdminSecret(request: Request, env: Env): boolean {
  const provided = request.headers.get('x-admin-secret') || request.headers.get('authorization')?.replace('Bearer ', '');
  return !env.ADMIN_SESSION_SECRET || provided === env.ADMIN_SESSION_SECRET;
}

export async function handleAdminRepoStatus(request: Request): Promise<Response> {
  const env = (request as any).env as Env;

  if (!requiresAdminSecret(request, env)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const repo = `${env.GITHUB_REPO_OWNER || 'MescriptLabs'}/${env.GITHUB_REPO_NAME || 'mescript-labs.com'}`;
  const token = env.GITHUB_WRITE_TOKEN || env.GITHUB_TOKEN;

  if (!token) {
    return new Response(JSON.stringify({ ok: false, error: 'GitHub token not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const github = new GitHubService(token, repo, env.GITHUB_DEFAULT_BRANCH || 'main');
  const ok = await github.verifyRepoAccess();

  return new Response(JSON.stringify({
    ok,
    repo,
    branch: env.GITHUB_DEFAULT_BRANCH || 'main',
    writeEnabled: !!env.GITHUB_WRITE_TOKEN
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function handleAdminContentUpdate(request: Request): Promise<Response> {
  const env = (request as any).env as Env;

  if (!requiresAdminSecret(request, env)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const { path, content, message, branch } = await request.json() as {
    path?: string;
    content?: string;
    message?: string;
    branch?: string;
  };

  if (!path || typeof content !== 'string') {
    return new Response(JSON.stringify({ error: 'Missing path or content payload' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const repo = `${env.GITHUB_REPO_OWNER || 'MescriptLabs'}/${env.GITHUB_REPO_NAME || 'mescript-labs.com'}`;
  const token = env.GITHUB_WRITE_TOKEN || env.GITHUB_TOKEN;

  if (!token) {
    return new Response(JSON.stringify({ error: 'GitHub write token not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const github = new GitHubService(token, repo, branch || env.GITHUB_DEFAULT_BRANCH || 'main');
  const result = await github.updateFileContent(path, content, message || `Update ${path}`);

  return new Response(JSON.stringify(result), {
    status: result.ok ? 200 : 500,
    headers: { 'Content-Type': 'application/json' }
  });
}
