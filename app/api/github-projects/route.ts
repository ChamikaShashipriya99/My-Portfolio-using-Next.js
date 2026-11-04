import { NextResponse } from 'next/server';

interface Repo {
    id: number; name: string; description: string | null; language: string | null;
    default_branch: string; html_url: string; homepage: string | null; fork: boolean; archived: boolean;
}
interface Entry { name: string; type: string; download_url: string | null }

async function github(path: string) {
    return fetch(`https://api.github.com/${path}`, {
        headers: { Accept: 'application/vnd.github+json', ...(process.env.GITHUB_PAT ? { Authorization: `Bearer ${process.env.GITHUB_PAT}` } : {}) },
        next: { revalidate: 3600 }
    });
}

export async function GET() {
    try {
        const response = await github('users/ChamikaShashipriya99/repos?sort=updated&direction=desc&per_page=100');
        if (!response.ok) return NextResponse.json({ error: 'Projects unavailable' }, { status: 503 });
        const repos: Repo[] = await response.json();
        if (!Array.isArray(repos)) throw new Error('Invalid repository response');
        // Bound concurrency and preserve GitHub's repository order.
        const projects = [];
        for (let offset = 0; offset < repos.length; offset += 6) {
            projects.push(...await Promise.all(repos.slice(offset, offset + 6).map(async repo => {
                let image = `https://opengraph.githubassets.com/1/ChamikaShashipriya99/${encodeURIComponent(repo.name)}`;
                let description = repo.description;
                try {
                    const contents = await github(`repos/ChamikaShashipriya99/${encodeURIComponent(repo.name)}/contents?ref=${encodeURIComponent(repo.default_branch)}`);
                    if (contents.ok) {
                        const entries: Entry[] = await contents.json();
                        if (Array.isArray(entries)) {
                            const thumbnail = entries.find(entry => entry.type === 'file' && entry.name.toLowerCase() === 'thumbnail.png');
                            if (thumbnail?.download_url) image = thumbnail.download_url;
                            const readme = entries.find(entry => entry.type === 'file' && /^readme\.md$/i.test(entry.name));
                            if (!description && readme?.download_url) {
                                const result = await fetch(readme.download_url, { next: { revalidate: 3600 } });
                                if (result.ok) description = (await result.text()).replace(/<[^>]*>/g, '').replace(/!\[.*?\]\(.*?\)/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[#*_~`]/g, '').replace(/\s+/g, ' ').trim().slice(0, 180);
                            }
                        }
                    }
                } catch { /* Repository metadata and GitHub preview remain valid fallbacks. */ }
                return { ...repo, image, description };
            })));
        }
        return NextResponse.json({ projects });
    } catch {
        return NextResponse.json({ error: 'Projects unavailable' }, { status: 503 });
    }
}
