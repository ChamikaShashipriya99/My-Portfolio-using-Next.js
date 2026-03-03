import React from 'react';
import { Metadata } from 'next';
import ProjectPageClient from './ProjectPageClient';

interface ProjectDetails {
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

    return <ProjectPageClient project={project} />;
}
