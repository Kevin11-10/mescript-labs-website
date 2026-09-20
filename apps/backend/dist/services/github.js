// GitHub API service for asset management
export class GitHubService {
    constructor(token, repo, defaultBranch = 'main') {
        this.token = token;
        this.repo = repo;
        this.defaultBranch = defaultBranch;
    }
    toBase64(value) {
        const bytes = new TextEncoder().encode(value);
        let binary = '';
        for (const byte of bytes) {
            binary += String.fromCharCode(byte);
        }
        return btoa(binary);
    }
    async verifyRepoAccess() {
        try {
            const response = await fetch(`https://api.github.com/repos/${this.repo}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            return response.ok;
        }
        catch (error) {
            console.error('GitHub repo access error:', error);
            return false;
        }
    }
    async getRelease(releaseId) {
        try {
            const response = await fetch(`https://api.github.com/repos/${this.repo}/releases/${releaseId}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            if (!response.ok) {
                return null;
            }
            return await response.json();
        }
        catch (error) {
            console.error('GitHub API error:', error);
            return null;
        }
    }
    async getAssetStream(assetId) {
        try {
            const response = await fetch(`https://api.github.com/repos/${this.repo}/releases/assets/${assetId}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Accept': 'application/octet-stream'
                }
            });
            if (!response.ok) {
                return null;
            }
            return response;
        }
        catch (error) {
            console.error('GitHub asset download error:', error);
            return null;
        }
    }
    async listReleases() {
        try {
            const response = await fetch(`https://api.github.com/repos/${this.repo}/releases`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            if (!response.ok) {
                return [];
            }
            return await response.json();
        }
        catch (error) {
            console.error('GitHub releases list error:', error);
            return [];
        }
    }
    async updateFileContent(path, content, message) {
        const encodedContent = this.toBase64(content);
        const url = `https://api.github.com/repos/${this.repo}/contents/${encodeURIComponent(path)}`;
        try {
            let sha;
            const existing = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            if (existing.ok) {
                const existingJson = await existing.json();
                sha = existingJson.sha;
            }
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message,
                    content: encodedContent,
                    branch: this.defaultBranch,
                    sha
                })
            });
            if (!response.ok) {
                const text = await response.text();
                return { ok: false, error: text || 'GitHub content update failed' };
            }
            const json = await response.json();
            return {
                ok: true,
                sha: json.content?.sha,
                html_url: json.content?.html_url
            };
        }
        catch (error) {
            console.error('GitHub content update error:', error);
            return { ok: false, error: error instanceof Error ? error.message : 'GitHub content update failed' };
        }
    }
}
