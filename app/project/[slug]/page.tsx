'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { HiArrowLeft, HiExternalLink, HiCode, HiStar, HiEye } from 'react-icons/hi';
import { FaGithub } from 'react-icons/fa';
import GlassCard from '@/components/ui/GlassCard';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

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

export default function ProjectPage() {
    const { slug } = useParams();
    const router = useRouter();
    const [project, setProject] = useState<ProjectDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const [repoRes, readmeRes] = await Promise.all([
                    fetch(`https://api.github.com/repos/ChamikaShashipriya99/${slug}`),
                    fetch(`https://raw.githubusercontent.com/ChamikaShashipriya99/${slug}/main/README.md`)
                        .then(res => res.ok ? res : fetch(`https://raw.githubusercontent.com/ChamikaShashipriya99/${slug}/master/README.md`))
                ]);

                const repoData = await repoRes.json();
                let readmeText = '';
                if (readmeRes.ok) {
                    readmeText = await readmeRes.text();
                }

                setProject({
                    name: repoData.name.replace(/-/g, ' '),
                    description: repoData.description || 'No description available.',
                    readme: readmeText,
                    stars: repoData.stargazers_count,
                    watchers: repoData.watchers_count,
                    tech: repoData.language ? [repoData.language] : ['Web'],
                    github: repoData.html_url,
                    live: repoData.homepage || repoData.html_url,
                    image: `https://opengraph.githubassets.com/1/ChamikaShashipriya99/${slug}`
                });
            } catch (error) {
                console.error('Error fetching project:', error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchProjectDetails();
    }, [slug]);

    const MarkdownComponents = {
        code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
                <div className="rounded-xl overflow-hidden my-8 border border-white/10 shadow-2xl">
                    <div className="bg-white/5 px-4 py-2 border-b border-white/5 flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-widest font-mono text-gray-500">{match[1]} output</span>
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        className="!m-0 !bg-transparent !p-6 font-mono text-sm leading-relaxed"
                        {...props}
                    >
                        {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                </div>
            ) : (
                <code className="bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded font-mono text-sm" {...props}>
                    {children}
                </code>
            );
        },
        h1: (props: any) => (
            <h1 className="text-3xl md:text-5xl font-black text-white mt-16 mb-8 uppercase tracking-tighter border-l-4 border-blue-600 pl-6" {...props} />
        ),
        h2: (props: any) => (
            <h2 className="text-2xl md:text-3xl font-black text-white mt-12 mb-6 uppercase tracking-tight flex items-center gap-4">
                <span className="h-1 w-8 bg-blue-600 rounded-full" /> {props.children}
            </h2>
        ),
        h3: (props: any) => (
            <h3 className="text-xl md:text-2xl font-bold text-white mt-10 mb-4 tracking-tight text-blue-500" {...props} />
        ),
        p: ({ children, ...props }: any) => {
            if (React.Children.toArray(children).some((child: any) =>
                child.type === 'div' || (child.props && (child.type === 'img' || child.props.node?.tagName === 'img'))
            )) {
                return <div className="mb-6">{children}</div>;
            }
            return <p className="text-gray-400 leading-relaxed mb-6 text-lg" {...props}>{children}</p>;
        },
        ul: (props: any) => (
            <ul className="space-y-3 mb-8 ml-4" {...props} />
        ),
        li: (props: any) => (
            <li className="flex gap-4 text-gray-400 text-lg">
                <span className="text-blue-500 mt-1.5">▹</span> {props.children}
            </li>
        ),
        blockquote: (props: any) => (
            <div className="my-12 p-8 bg-blue-600/5 border border-blue-500/20 rounded-3xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-600" />
                <div className="italic text-xl text-gray-300 relative z-10 leading-relaxed">
                    {props.children}
                </div>
                <div className="absolute -right-4 -bottom-4 text-blue-600/10 text-8xl font-serif">"</div>
            </div>
        ),
        a: (props: any) => (
            <a className="text-blue-500 hover:text-blue-400 underline decoration-blue-500/30 underline-offset-4 transition-all" {...props} />
        ),
        img: (props: any) => (
            <div className="my-12 rounded-3xl overflow-hidden border border-white/5 shadow-2xl group">
                <img className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-700" {...props} />
            </div>
        )
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-blue-500 font-mono tracking-widest uppercase animate-pulse">Accessing Project Database...</p>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center space-y-6">
                    <h1 className="text-4xl text-white font-black uppercase">Project Not Found</h1>
                    <button onClick={() => router.push('/#projects')} className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold uppercase tracking-widest text-xs">
                        Return to Base
                    </button>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-black text-gray-300 pb-24">
            {/* Immersive Header */}
            <header className="relative h-[60vh] flex items-end overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 z-0">
                    <img src={project.image} alt={project.name} className="w-full h-full object-cover opacity-30 scale-110 blur-sm" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </div>

                <div className="container mx-auto px-6 relative z-10 pb-12">
                    <button
                        onClick={() => router.push('/#projects')}
                        className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-12 uppercase text-xs tracking-widest font-bold"
                    >
                        <HiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Inventory
                    </button>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-tight">
                            {project.name}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-sm font-mono text-gray-500 tracking-widest">
                            <span className="flex items-center gap-2"><HiCode className="text-blue-500" /> {project.tech[0]}</span>
                            <span className="flex items-center gap-2"><HiStar className="text-yellow-500" /> {project.stars} Stars</span>
                            <span className="flex items-center gap-2"><HiEye className="text-green-500" /> {project.watchers} Watchers</span>
                        </div>
                    </motion.div>
                </div>
            </header>

            <div className="container mx-auto px-6 py-16">
                <div className="grid lg:grid-cols-3 gap-16">
                    {/* Main Content (README) */}
                    <div className="lg:col-span-2 space-y-12">
                        <section className="max-w-none">
                            {project.readme ? (
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={MarkdownComponents}
                                >
                                    {project.readme}
                                </ReactMarkdown>
                            ) : (
                                <p className="text-xl leading-relaxed text-gray-400 italic">
                                    {project.description}
                                </p>
                            )}
                        </section>
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:col-span-1 space-y-8">
                        <GlassCard className="p-8 space-y-6">
                            <h3 className="text-white font-bold uppercase tracking-widest text-sm border-b border-white/5 pb-4">Project Intel</h3>

                            <div className="space-y-4">
                                <a
                                    href={project.live}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-blue-600/20"
                                >
                                    Access Live Demo <HiExternalLink />
                                </a>
                                <a
                                    href={project.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-4 px-6 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                                >
                                    View Source Code <FaGithub />
                                </a>
                            </div>

                            <div className="pt-4">
                                <p className="text-xs text-gray-500 font-mono leading-relaxed opacity-60">
                                    Project data synchronized with GitHub Real-time API. Last updated from Mainframe.
                                </p>
                            </div>
                        </GlassCard>
                    </aside>
                </div>
            </div>
        </main>
    );
}
