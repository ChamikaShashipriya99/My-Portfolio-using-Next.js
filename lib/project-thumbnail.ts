export async function getProjectThumbnail(name: string, branch: string): Promise<string> {
    const fallback = `https://opengraph.githubassets.com/1/ChamikaShashipriya99/${encodeURIComponent(name)}`;
    try {
        const response = await fetch(`https://api.github.com/repos/ChamikaShashipriya99/${encodeURIComponent(name)}/contents?ref=${encodeURIComponent(branch)}`, {
            headers: { Accept: 'application/vnd.github+json', ...(process.env.GITHUB_PAT ? { Authorization: `Bearer ${process.env.GITHUB_PAT}` } : {}) },
            next: { revalidate: 3600 }, signal: AbortSignal.timeout(4000),
        });
        if (!response.ok) return fallback;
        const entries: { name: string; type: string; download_url: string | null }[] = await response.json();
        if (!Array.isArray(entries)) return fallback;
        for (const name of ['thumbnail.webp', 'thumbnail.png']) {
            const file = entries.find(entry => entry.type === 'file' && entry.name.toLowerCase() === name && entry.download_url);
            if (file?.download_url) return file.download_url;
        }
    } catch { /* Use GitHub's preview when thumbnail discovery is unavailable. */ }
    return fallback;
}
