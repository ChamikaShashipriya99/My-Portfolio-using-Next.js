'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from './GlassCard';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

interface Project {
    title: string;
    description: string;
    tech: string[];
    link: string;
    github: string;
    image: string;
}

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [displayCount, setDisplayCount] = useState(12);

    useEffect(() => {
        const fetchRepos = async () => {
            try {
                // Fetch up to 100 repos to ensure we get "all" (GitHub pagination limit per page)
                const response = await fetch('https://api.github.com/users/ChamikaShashipriya99/repos?sort=updated&per_page=100');
                const data = await response.json();

                const projectData = await Promise.all(data.map(async (repo: any) => {
                    // Check for thumbnail.png and README.md in main/master branches
                    const branches = ['main', 'master'];
                    let finalImage = `https://opengraph.githubassets.com/1/ChamikaShashipriya99/${repo.name}`;
                    let readmeDesc = repo.description || 'No description provided.';

                    for (const branch of branches) {
                        const thumbUrl = `https://raw.githubusercontent.com/ChamikaShashipriya99/${repo.name}/${branch}/thumbnail.png`;
                        const readmeUrl = `https://raw.githubusercontent.com/ChamikaShashipriya99/${repo.name}/${branch}/README.md`;

                        try {
                            // Try fetching thumbnail
                            if (finalImage.includes('opengraph')) {
                                const imgCheck = await fetch(thumbUrl, { method: 'HEAD' });
                                if (imgCheck.ok) finalImage = thumbUrl;
                            }

                            // Try fetching README for description
                            const readmeRes = await fetch(readmeUrl);
                            if (readmeRes.ok) {
                                const text = await readmeRes.text();
                                const cleanText = text
                                    .replace(/#.*?\n/g, '')
                                    .replace(/!\[.*?\]\(.*?\)/g, '')
                                    .replace(/\[.*?\]\(.*?\)/g, '')
                                    .replace(/[*_~`]/g, '')
                                    .trim();

                                if (cleanText.length > 50) {
                                    readmeDesc = cleanText.substring(0, 180) + '...';
                                }
                            }
                        } catch (e) { }
                    }

                    return {
                        title: repo.name.replace(/-/g, ' '),
                        description: readmeDesc,
                        tech: repo.language ? [repo.language] : ['Web'],
                        link: repo.homepage || repo.html_url,
                        github: repo.html_url,
                        image: finalImage
                    };
                }));

                setProjects(projectData);
            } catch (error) {
                console.error('Failed to fetch repositories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRepos();
    }, []);

    const visibleProjects = projects.slice(0, displayCount);
    const hasMore = projects.length > displayCount;

    if (loading) {
        return (
            <div className="py-24 text-center">
                <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="mt-4 text-gray-500 font-mono text-sm animate-pulse tracking-widest uppercase">Syncing GitHub Core...</p>
            </div>
        );
    }

    return (
        <section id="projects" className="py-24 5xl:py-48 relative">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div className="space-y-4">
                        <h2 className="text-3xl sm:text-5xl lg:text-6xl 3xl:text-7xl font-black text-white tracking-tighter uppercase leading-tight">
                            Project <span className="text-blue-500">Inventory</span>
                        </h2>
                        <div className="h-1.5 w-24 bg-blue-600 rounded-full" />
                        <p className="text-gray-500 font-mono text-xs md:text-sm 3xl:text-base uppercase tracking-[0.4em]">Showing {visibleProjects.length} of {projects.length} Repositories</p>
                    </div>
                </div>

                <motion.div
                    layout
                    className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 5xl:grid-cols-5 gap-6 md:gap-8 3xl:gap-12"
                >
                    <AnimatePresence mode="popLayout">
                        {visibleProjects.map((project) => (
                            <motion.div
                                key={project.title}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4 }}
                            >
                                <GlassCard className="h-full flex flex-col group p-4 3xl:p-8">
                                    <div className="aspect-video mb-6 rounded-2xl overflow-hidden bg-neutral-900 border border-white/5 relative">
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = `https://opengraph.githubassets.com/1/ChamikaShashipriya99/${project.title.replace(/ /g, '-')}`;
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-transparent transition-colors" />
                                    </div>

                                    <h3 className="text-lg md:text-xl 3xl:text-2xl font-bold text-white mb-2 capitalize">{project.title}</h3>
                                    <p className="text-gray-400 text-xs md:text-sm 3xl:text-lg mb-6 flex-grow line-clamp-3 opacity-80">{project.description}</p>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {project.tech.map(t => (
                                            <span key={t} className="text-[10px] 3xl:text-xs font-mono text-blue-400 px-2 py-1 rounded bg-blue-400/10 border border-blue-400/20">
                                                {t}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex flex-col gap-4 pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-4">
                                            <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-xs md:text-sm 3xl:text-base font-medium">
                                                <FaGithub /> Source
                                            </a>
                                            {project.link !== project.github && (
                                                <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-xs md:text-sm 3xl:text-base font-medium">
                                                    <FaExternalLinkAlt /> Live
                                                </a>
                                            )}
                                        </div>
                                        <a
                                            href={`/project/${project.title.toLowerCase().replace(/ /g, '-')}`}
                                            className="w-full py-3 bg-blue-600/10 border border-blue-600/20 text-blue-500 rounded-xl text-xs font-bold uppercase tracking-widest text-center hover:bg-blue-600 hover:text-white transition-all"
                                        >
                                            View Project Intel
                                        </a>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {hasMore && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="mt-16 md:mt-24 text-center"
                    >
                        <button
                            onClick={() => setDisplayCount(projects.length)}
                            className="px-8 py-4 md:px-12 md:py-6 glassmorphism border-white/10 text-white font-bold uppercase tracking-widest text-xs md:text-sm 3xl:text-lg hover:bg-white hover:text-black transition-all transform hover:scale-105 active:scale-95 shadow-2xl"
                        >
                            Initialize All Modules (Show More)
                        </button>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
