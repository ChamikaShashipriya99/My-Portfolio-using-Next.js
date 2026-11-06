import { NextRequest, NextResponse } from 'next/server';

interface Repo {
    id: number; name: string; description: string | null; language: string | null;
    default_branch: string; html_url: string; homepage: string | null; fork: boolean; archived: boolean;
}
interface Entry { name: string; type: string; download_url: string | null }

const projectCache = new Map<number, { expires: number; projects: unknown[] }>();

async function github(path: string, signal: AbortSignal) {
    return fetch(`https://api.github.com/${path}`, {
        headers: { Accept: 'application/vnd.github+json', ...(process.env.GITHUB_PAT ? { Authorization: `Bearer ${process.env.GITHUB_PAT}` } : {}) },
        cache: 'no-store', signal
    });
}

export async function GET(request: NextRequest) {
    const requested = request.nextUrl.searchParams.get('limit');
    const limit = requested === null ? 100 : Number(requested);
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) return NextResponse.json({ error: 'Invalid project limit' }, { status: 400 });
    const cached = projectCache.get(limit);
    if (cached && cached.expires > Date.now()) return NextResponse.json({ projects: cached.projects });
    // One deadline covers the repository list and all optional thumbnail lookups.
    const signal = AbortSignal.timeout(8000);
    try {
        const response = await github(`users/ChamikaShashipriya99/repos?sort=updated&direction=desc&per_page=${limit}`, signal);
        if (!response.ok) return NextResponse.json({ error: 'Projects unavailable' }, { status: 503 });
        const repos: Repo[] = await response.json();
        if (!Array.isArray(repos)) throw new Error('Invalid repository response');
        // Bound concurrency and preserve GitHub's repository order.
        const projects = [];
        for (let offset = 0; offset < repos.length; offset += 6) {
            projects.push(...await Promise.all(repos.slice(offset, offset + 6).map(async repo => {
                let image = `https://opengraph.githubassets.com/1/ChamikaShashipriya99/${encodeURIComponent(repo.name)}`;
                const description = repo.description;
                try {
                    signal.throwIfAborted();
                    const contents = await github(`repos/ChamikaShashipriya99/${encodeURIComponent(repo.name)}/contents?ref=${encodeURIComponent(repo.default_branch)}`, signal);
                    if (contents.ok) {
                        const entries: Entry[] = await contents.json();
                        if (Array.isArray(entries)) {
                            const thumbnail = entries.find(entry => entry.type === 'file' && entry.name.toLowerCase() === 'thumbnail.png');
                            if (thumbnail?.download_url) image = thumbnail.download_url;

                        }
                    }
                } catch { /* Repository metadata and GitHub preview remain valid fallbacks. */ }
                return { ...repo, image, description };
            })));
        }
        projectCache.set(limit, { expires: Date.now() + 3600000, projects });
        return NextResponse.json({ projects });
    } catch {
        return NextResponse.json({ error: 'Projects unavailable' }, { status: 503 });
    }
}
