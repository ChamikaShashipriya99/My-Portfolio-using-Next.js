'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { HiArrowLeft, HiExternalLink, HiCode, HiStar, HiEye, HiClipboardCopy, HiCheck } from 'react-icons/hi';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import GlassCard from '@/components/ui/GlassCard';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

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

const CopyButton = ({ text }: { text: string }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest"
        >
            {copied ? (
                <>
                    <HiCheck className="text-green-500" /> Copied!
                </>
            ) : (
                <>
                    <HiClipboardCopy /> Copy
                </>
            )}
        </button>
    );
};

export default function ProjectPageClient({ project, relatedProjects }: { project: ProjectDetails, relatedProjects: ProjectDetails[] }) {
    const router = useRouter();

    const MarkdownComponents = {
        code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const codeContent = String(children).replace(/\n$/, '');

            return !inline && match ? (
                <div className="rounded-xl overflow-hidden my-8 border border-white/10 shadow-2xl group/code">
                    <div className="bg-white/5 px-4 py-2 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] uppercase tracking-widest font-mono text-gray-500">{match[1]}</span>
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                            </div>
                        </div>
                        <CopyButton text={codeContent} />
                    </div>
                    <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        className="!m-0 !bg-transparent !p-6 font-mono text-sm leading-relaxed"
                        {...props}
                    >
                        {codeContent}
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

    return (
        <main className="min-h-screen bg-black text-gray-300 pb-24">
            {/* Immersive Header */}
            <header className="relative h-[60vh] flex items-end overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 z-0">
                    <img
                        src={project.image}
                        alt={project.name}
                        className="w-full h-full object-cover opacity-30 scale-110 blur-sm"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://opengraph.githubassets.com/1/ChamikaShashipriya99/${project.slug}`;
                        }}
                    />
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

                {/* Mission Pipeline (Related Projects) */}
                {relatedProjects.length > 0 && (
                    <section className="mt-32 pt-24 border-t border-white/5">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                            <div className="space-y-4">
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tighter uppercase leading-tight">
                                    Mission <span className="text-blue-500">Pipeline</span>
                                </h2>
                                <div className="h-1.5 w-16 bg-blue-600 rounded-full" />
                                <p className="text-gray-500 font-mono text-xs uppercase tracking-[0.4em]">Suggested Technical Reconnaissance</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {relatedProjects.map((p) => (
                                <GlassCard key={p.github} className="h-full flex flex-col group p-4 3xl:p-8 hover:border-blue-500/30 transition-all duration-500">
                                    <div className="aspect-video mb-6 rounded-2xl overflow-hidden bg-neutral-900 border border-white/5 relative">
                                        <img
                                            src={p.image}
                                            alt={p.name}
                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = `https://opengraph.githubassets.com/1/ChamikaShashipriya99/${p.slug}`;
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-transparent transition-colors" />
                                    </div>

                                    <h3 className="text-lg md:text-xl font-bold text-white mb-2 capitalize line-clamp-1">{p.name}</h3>
                                    <p className="text-gray-400 text-xs md:text-sm mb-6 flex-grow line-clamp-2 opacity-80">{p.description}</p>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {p.tech.map(t => (
                                            <span key={t} className="text-[10px] font-mono text-blue-400 px-2 py-1 rounded bg-blue-400/10 border border-blue-400/20">
                                                {t}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex flex-col gap-4 pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-4">
                                            <a href={p.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-xs font-medium">
                                                <FaGithub /> Source
                                            </a>
                                            {p.live !== p.github && (
                                                <a href={p.live} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-xs font-medium">
                                                    <FaExternalLinkAlt /> Live
                                                </a>
                                            )}
                                        </div>
                                        <a
                                            href={`/project/${p.name.toLowerCase().replace(/ /g, '-')}`}
                                            className="w-full py-3 bg-blue-600/10 border border-blue-600/20 text-blue-500 rounded-xl text-xs font-bold uppercase tracking-widest text-center hover:bg-blue-600 hover:text-white transition-all shadow-lg shadow-blue-600/5"
                                        >
                                            View Project Intel
                                        </a>
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}
