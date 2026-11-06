import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site';
export const revalidate = 86400;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const pages: MetadataRoute.Sitemap = [{ url: `${siteUrl}/`, changeFrequency: 'weekly', priority: 1 }];
    try {
        const response = await fetch('https://api.github.com/users/ChamikaShashipriya99/repos?sort=updated&per_page=100', {
            headers: process.env.GITHUB_PAT ? { Authorization: `Bearer ${process.env.GITHUB_PAT}` } : {}, next: { revalidate: 86400 }, signal: AbortSignal.timeout(5000),
        });
        if (!response.ok) return pages;
        const repos: { name: string; updated_at: string }[] = await response.json();
        if (Array.isArray(repos)) pages.push(...repos.map(repo => ({ url: `${siteUrl}/project/${encodeURIComponent(repo.name)}`, lastModified: repo.updated_at, changeFrequency: 'monthly' as const, priority: 0.6 })));
    } catch { /* Keep the homepage sitemap available during GitHub outages. */ }
    return pages;
}
