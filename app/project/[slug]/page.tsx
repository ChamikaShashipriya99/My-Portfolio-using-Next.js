import React from 'react';
import { Metadata } from 'next';
import ProjectPageClient from './ProjectPageClient';

interface ProjectDetails {
    slug: string;
    name: string;
    description: string;
    readme: string;
    stars: number;
    watchers: number;
    tech: string[];
    github: string;
    live: string;
    image: string;
}

async function getProjectData(slug: string): Promise<ProjectDetails | null> {
    try {
        const [repoRes, readmeRes] = await Promise.all([
            fetch(`https://api.github.com/repos/ChamikaShashipriya99/${slug}`, { next: { revalidate: 3600 } }),
            fetch(`https://raw.githubusercontent.com/ChamikaShashipriya99/${slug}/main/README.md`)
                .then(res => res.ok ? res : fetch(`https://raw.githubusercontent.com/ChamikaShashipriya99/${slug}/master/README.md`))
        ]);

        if (!repoRes.ok) return null;

        const repoData = await repoRes.json();
        let readmeText = '';
        if (readmeRes.ok) {
            readmeText = await readmeRes.text();
        }

        return {
            slug: repoData.name,
            name: repoData.name.replace(/-/g, ' '),
            description: repoData.description || 'No description available.',
            readme: readmeText,
            stars: repoData.stargazers_count,
            watchers: repoData.watchers_count,
            tech: repoData.language ? [repoData.language] : ['Web'],
            github: repoData.html_url,
            live: repoData.homepage || repoData.html_url,
            image: `https://opengraph.githubassets.com/1/ChamikaShashipriya99/${slug}`
        };
    } catch (error) {
        console.error('Error fetching project:', error);
        return null;
    }
}

async function getRelatedProjects(excludeSlug: string): Promise<ProjectDetails[]> {
    try {
        const response = await fetch('https://api.github.com/users/ChamikaShashipriya99/repos?sort=updated&per_page=10', { next: { revalidate: 3600 } });
        if (!response.ok) return [];

        const data = await response.json();
        const filteredRepos = data
            .filter((repo: any) => repo.name.toLowerCase() !== excludeSlug.toLowerCase() && !repo.fork)
            .slice(0, 3);

        const enhancedProjects = await Promise.all(filteredRepos.map(async (repo: any) => {
            const slug = repo.name;
            // Try to find if thumbnail exists, otherwise fallback to OG
            const thumbnailUrl = `https://raw.githubusercontent.com/ChamikaShashipriya99/${slug}/main/thumbnail.png`;

            // Fetch readme for description snippet
            const readmeRes = await fetch(`https://raw.githubusercontent.com/ChamikaShashipriya99/${slug}/main/README.md`);
            let readmeSnippet = repo.description || 'No description available.';

            if (readmeRes.ok) {
                const fullReadme = await readmeRes.text();
                // Extract first paragraph or first 150 chars, removing markdown headers/links
                readmeSnippet = fullReadme
                    .replace(/#.*?\n/g, '') // Remove headers
                    .replace(/\[.*?\]\(.*?\)/g, '') // Remove links
                    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
                    .trim()
                    .slice(0, 160) + '...';
            }

            return {
                slug: repo.name,
                name: repo.name.replace(/-/g, ' '),
                description: readmeSnippet,
                tech: repo.language ? [repo.language] : ['Web'],
                github: repo.html_url,
                live: repo.homepage || repo.html_url,
                image: thumbnailUrl // We'll handle fallback in the client
            };
        }));

        return enhancedProjects;
    } catch (e) {
        return [];
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const project = await getProjectData(slug);

    if (!project) {
        return {
            title: 'Project Not Found | Chamika Shashipriya',
            description: 'The requested project could not be found.'
        };
    }

    return {
        title: `${project.name} | Project Intel`,
        description: project.description,
        openGraph: {
            title: `${project.name} | Chamika Shashipriya`,
            description: project.description,
            images: [project.image],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${project.name} | Chamika Shashipriya`,
            description: project.description,
            images: [project.image],
        }
    };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project = await getProjectData(slug);
    const relatedProjects = await getRelatedProjects(slug);

    if (!project) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center space-y-6">
                    <h1 className="text-4xl text-white font-black uppercase">Project Not Found</h1>
                    <a href="/#projects" className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold uppercase tracking-widest text-xs inline-block">
                        Return to Base
                    </a>
                </div>
            </div>
        );
    }

    return <ProjectPageClient project={project} relatedProjects={relatedProjects} />;
}
