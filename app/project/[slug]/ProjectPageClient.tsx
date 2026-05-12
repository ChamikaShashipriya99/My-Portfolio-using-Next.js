'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { HiArrowLeft, HiExternalLink, HiCode, HiStar, HiEye, HiClipboardCopy, HiCheck, HiClock, HiArrowUp } from 'react-icons/hi';
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

const getTheme = (tech: string) => {
    const t = (tech || '').toLowerCase();
    
    const themes: Record<string, any> = {
        yellow: { text: 'text-yellow-400', bg: 'bg-yellow-400', border: 'border-yellow-400', bgLight: 'bg-yellow-400/10', borderLight: 'border-yellow-400/20', glow: 'shadow-yellow-400/20', from: 'from-yellow-400/20' },
        blue: { text: 'text-blue-400', bg: 'bg-blue-400', border: 'border-blue-400', bgLight: 'bg-blue-400/10', borderLight: 'border-blue-400/20', glow: 'shadow-blue-400/20', from: 'from-blue-400/20' },
        green: { text: 'text-green-400', bg: 'bg-green-400', border: 'border-green-400', bgLight: 'bg-green-400/10', borderLight: 'border-green-400/20', glow: 'shadow-green-400/20', from: 'from-green-400/20' },
        orange: { text: 'text-orange-400', bg: 'bg-orange-400', border: 'border-orange-400', bgLight: 'bg-orange-400/10', borderLight: 'border-orange-400/20', glow: 'shadow-orange-400/20', from: 'from-orange-400/20' },
        red: { text: 'text-red-400', bg: 'bg-red-400', border: 'border-red-400', bgLight: 'bg-red-400/10', borderLight: 'border-red-400/20', glow: 'shadow-red-400/20', from: 'from-red-400/20' },
        cyan: { text: 'text-cyan-400', bg: 'bg-cyan-400', border: 'border-cyan-400', bgLight: 'bg-cyan-400/10', borderLight: 'border-cyan-400/20', glow: 'shadow-cyan-400/20', from: 'from-cyan-400/20' },
        emerald: { text: 'text-emerald-400', bg: 'bg-emerald-400', border: 'border-emerald-400', bgLight: 'bg-emerald-400/10', borderLight: 'border-emerald-400/20', glow: 'shadow-emerald-400/20', from: 'from-emerald-400/20' },
        purple: { text: 'text-purple-400', bg: 'bg-purple-400', border: 'border-purple-400', bgLight: 'bg-purple-400/10', borderLight: 'border-purple-400/20', glow: 'shadow-purple-400/20', from: 'from-purple-400/20' },
    };

    if (['javascript', 'js'].includes(t)) return themes.yellow;
    if (['typescript', 'ts'].includes(t)) return themes.blue;
    if (['python'].includes(t)) return themes.green;
    if (['java', 'kotlin'].includes(t)) return themes.orange;
    if (['rust', 'ruby', 'html'].includes(t)) return themes.red;
    if (['css', 'react', 'next.js', 'web'].includes(t)) return themes.cyan;
    if (['vue', 'nuxt'].includes(t)) return themes.emerald;
    if (['c++', 'c', 'c#'].includes(t)) return themes.purple;
    
    return themes.blue;
};

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

const generateId = (text: string) => {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
};

const HorizontalTOC = ({ sections, theme }: { sections: { id: string; text: string; level: number }[], theme: any }) => {
    if (sections.length === 0) return null;

    const mainSections = sections.filter(s => s.level <= 2);

    return (
        <div className="flex gap-2 overflow-x-auto items-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <span className={`text-[10px] uppercase tracking-widest font-bold ${theme.text} shrink-0 mr-4 flex items-center gap-2`}>
                <span className={`w-2 h-2 ${theme.bg} rounded-full animate-pulse`} /> Index
            </span>
            {mainSections.map((s) => (
                <a
                    key={s.id}
                    href={`#${s.id}`}
                    className={`shrink-0 text-xs font-medium text-gray-400 hover:text-white px-4 py-1.5 rounded-full hover:${theme.bgLight} transition-all`}
                >
                    {s.text}
                </a>
            ))}
        </div>
    );
};

export default function ProjectPageClient({ project, relatedProjects }: { project: ProjectDetails, relatedProjects: ProjectDetails[] }) {
    const router = useRouter();
    const theme = React.useMemo(() => getTheme(project.tech[0]), [project.tech]);

    const [lightboxImage, setLightboxImage] = React.useState<string | null>(null);
    const [showBackToTop, setShowBackToTop] = React.useState(false);

    const { scrollYProgress, scrollY } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    React.useEffect(() => {
        return scrollY.onChange((latest) => {
            setShowBackToTop(latest > 500);
        });
    }, [scrollY]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const readTime = React.useMemo(() => {
        if (!project.readme) return 1;
        const words = project.readme.trim().split(/\s+/).length;
        return Math.max(1, Math.ceil(words / 200));
    }, [project.readme]);

    const sections = React.useMemo(() => {
        if (!project.readme) return [];
        const lines = project.readme.split('\n');
        const extracted: { id: string; text: string; level: number }[] = [];
        const seenIds = new Set<string>();

        lines.forEach(line => {
            const match = line.match(/^(#{1,3})\s+(.+)$/);
            if (match) {
                const text = match[2].trim();
                let id = generateId(text);

                let counter = 1;
                const originalId = id;
                while (seenIds.has(id)) {
                    id = `${originalId}-${counter}`;
                    counter++;
                }
                seenIds.add(id);

                extracted.push({
                    level: match[1].length,
                    text,
                    id
                });
            }
        });
        return extracted;
    }, [project.readme]);

    const MarkdownComponents = {
        code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const codeContent = String(children).replace(/\n$/, '');

            return !inline && match ? (
                <div className="rounded-xl overflow-hidden my-8 border border-white/10 shadow-2xl group/code">
                    <div className="bg-white/5 px-4 py-2 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className={`text-[10px] uppercase tracking-widest font-mono ${theme.text}`}>{match[1]}</span>
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
                <code className={`${theme.bgLight} ${theme.text} px-1.5 py-0.5 rounded font-mono text-sm`} {...props}>
                    {children}
                </code>
            );
        },
        h1: (props: any) => {
            const id = generateId(String(props.children));
            return <h1 id={id} className={`text-3xl md:text-5xl font-black text-white mt-16 mb-8 uppercase tracking-tighter border-l-4 ${theme.border} pl-6 scroll-mt-32`} {...props} />;
        },
        h2: (props: any) => {
            const id = generateId(String(props.children));
            return (
                <h2 id={id} className="text-2xl md:text-3xl font-black text-white mt-12 mb-6 uppercase tracking-tight flex items-center gap-4 scroll-mt-32">
                    <span className={`h-1 w-8 ${theme.bg} rounded-full`} /> {props.children}
                </h2>
            );
        },
        h3: (props: any) => {
            const id = generateId(String(props.children));
            return <h3 id={id} className={`text-xl md:text-2xl font-bold mt-10 mb-4 tracking-tight ${theme.text} scroll-mt-32`} {...props} />;
        },
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
                <span className={`${theme.text} mt-1.5`}>▹</span> {props.children}
            </li>
        ),
        blockquote: (props: any) => (
            <div className={`my-12 p-8 ${theme.bgLight} border ${theme.borderLight} rounded-3xl relative overflow-hidden group`}>
                <div className={`absolute top-0 left-0 w-1 h-full ${theme.bg}`} />
                <div className="italic text-xl text-gray-300 relative z-10 leading-relaxed">
                    {props.children}
                </div>
                <div className={`absolute -right-4 -bottom-4 ${theme.text} opacity-10 text-8xl font-serif`}>"</div>
            </div>
        ),
        a: (props: any) => (
            <a className={`${theme.text} hover:opacity-80 underline decoration-current/30 underline-offset-4 transition-all`} {...props} />
        ),
        img: ({ src, alt, ...props }: any) => {
            const isRelative = src && !src.startsWith('http') && !src.startsWith('https') && !src.startsWith('/');
            const absoluteSrc = isRelative
                ? `https://raw.githubusercontent.com/ChamikaShashipriya99/${project.slug}/main/${src.replace(/^\.\//, '')}`
                : src;

            return (
                <div 
                    className={`my-12 rounded-3xl overflow-hidden border ${theme.borderLight} shadow-2xl group cursor-zoom-in relative`}
                    onClick={() => setLightboxImage(absoluteSrc)}
                >
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 pointer-events-none">
                        <span className="text-white font-bold tracking-widest uppercase text-xs">View Image</span>
                    </div>
                    <img
                        src={absoluteSrc}
                        alt={alt || "Markdown image"}
                        className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-700"
                        {...props}
                    />
                </div>
            );
        }
    };

    return (
        <main className="min-h-screen bg-black text-gray-300 pb-24 selection:bg-white/20">
            {/* Scroll Progress Bar */}
            <motion.div
                className={`fixed top-0 left-0 right-0 h-1.5 origin-left z-[100] ${theme.bg} ${theme.glow}`}
                style={{ scaleX }}
            />

            {/* Lightbox Modal */}
            <AnimatePresence>
                {lightboxImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setLightboxImage(null)}
                        className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-6 cursor-zoom-out"
                    >
                        <motion.img
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            src={lightboxImage}
                            alt="Expanded view"
                            className="max-w-full max-h-full rounded-2xl border border-white/10 shadow-2xl object-contain"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Back to Top Button */}
            <AnimatePresence>
                {showBackToTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        onClick={scrollToTop}
                        className={`fixed bottom-8 right-8 z-[90] p-4 rounded-full ${theme.bg} text-black shadow-2xl ${theme.glow} hover:scale-110 transition-transform`}
                    >
                        <HiArrowUp className="text-xl font-bold" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Header Re-design: Animated Gradient Background */}
            <header className="relative pt-32 pb-24 overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 z-0 bg-black">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b ${theme.from} to-transparent rounded-full blur-[100px] opacity-40`}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
                </div>

                <div className="max-w-4xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
                    <button
                        onClick={() => router.push('/#projects')}
                        className="group inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-12 uppercase text-xs tracking-widest font-bold"
                    >
                        <HiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Inventory
                    </button>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="space-y-8 flex flex-col items-center"
                    >
                        <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-tight">
                            {project.name}
                        </h1>
                        
                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-mono text-gray-400 tracking-widest">
                            <span className={`flex items-center gap-2 px-4 py-1.5 rounded-full border ${theme.borderLight} ${theme.bgLight} ${theme.text}`}>
                                <HiCode /> {project.tech[0] || 'Web'}
                            </span>
                            <span className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5"><HiClock className={theme.text} /> {readTime} Min Read</span>
                            <span className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5"><HiStar className="text-yellow-500" /> {project.stars} Stars</span>
                            <span className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5"><HiEye className="text-green-500" /> {project.watchers} Watchers</span>
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* Sticky Top Bar (TOC & Actions) */}
            <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black">
                <div className="max-w-4xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="w-full sm:w-auto flex-1 overflow-hidden">
                        <HorizontalTOC sections={sections} theme={theme} />
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest ${theme.bg} text-black hover:opacity-80 transition-all flex items-center gap-2`}
                        >
                            Live Demo <HiExternalLink />
                        </a>
                        <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest border border-white/20 hover:bg-white/10 text-white transition-all flex items-center gap-2"
                        >
                            Source <FaGithub />
                        </a>
                    </div>
                </div>
            </div>

            {/* Single Column Content */}
            <div className="max-w-4xl mx-auto px-6 py-16">
                <div className="space-y-12">
                    <section className="max-w-none">
                        {project.readme ? (
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={MarkdownComponents}
                            >
                                {project.readme}
                            </ReactMarkdown>
                        ) : (
                            <p className="text-xl leading-relaxed text-gray-400 italic text-center py-12">
                                {project.description}
                            </p>
                        )}
                    </section>
                </div>

                {/* Mission Pipeline (Related Projects) */}
                {relatedProjects.length > 0 && (
                    <section className="mt-32 pt-24 border-t border-white/5">
                        <div className="flex flex-col items-center text-center mb-16 gap-4">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tighter uppercase leading-tight">
                                Mission <span className={theme.text}>Pipeline</span>
                            </h2>
                            <div className={`h-1.5 w-16 ${theme.bg} rounded-full`} />
                            <p className="text-gray-500 font-mono text-xs uppercase tracking-[0.4em]">Suggested Technical Reconnaissance</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {relatedProjects.map((p) => {
                                const pTheme = getTheme(p.tech[0] || 'Web');
                                return (
                                    <GlassCard key={p.github} className={`h-full flex flex-col group p-4 3xl:p-8 hover:${pTheme.borderLight} transition-all duration-500`}>
                                        <div className="aspect-video mb-6 rounded-2xl overflow-hidden bg-neutral-900 border border-white/5 relative">
                                            <img
                                                src={p.image}
                                                alt={p.name}
                                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = `https://opengraph.githubassets.com/1/ChamikaShashipriya99/${p.slug}`;
                                                }}
                                            />
                                            <div className={`absolute inset-0 ${pTheme.bgLight} group-hover:bg-transparent transition-colors`} />
                                        </div>

                                        <h3 className="text-lg md:text-xl font-bold text-white mb-2 capitalize line-clamp-1">{p.name}</h3>
                                        <p className="text-gray-400 text-xs md:text-sm mb-6 flex-grow line-clamp-2 opacity-80">{p.description}</p>

                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {p.tech.map(t => (
                                                <span key={t} className={`text-[10px] font-mono ${pTheme.text} px-2 py-1 rounded ${pTheme.bgLight} border ${pTheme.borderLight}`}>
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
                                                className={`w-full py-3 ${pTheme.bgLight} border ${pTheme.borderLight} ${pTheme.text} rounded-xl text-xs font-bold uppercase tracking-widest text-center hover:${pTheme.bg} hover:text-white transition-all shadow-lg ${pTheme.glow}`}
                                            >
                                                View Project Intel
                                            </a>
                                        </div>
                                    </GlassCard>
                                );
                            })}
                        </div>
                    </section>
                )}
            </div>

            {/* Seamless Next Mission Footer */}
            {relatedProjects.length > 0 && (() => {
                const nextProject = relatedProjects[0];
                const nextTheme = getTheme(nextProject.tech[0]);
                return (
                    <a 
                        href={`/project/${nextProject.name.toLowerCase().replace(/ /g, '-')}`}
                        className={`block relative mt-16 py-32 border-t border-white/5 overflow-hidden group`}
                    >
                        <div className="absolute inset-0 z-0 bg-black">
                            <div className={`absolute inset-0 bg-gradient-to-t ${nextTheme.from} to-black opacity-0 group-hover:opacity-40 transition-opacity duration-1000 z-10`} />
                            <img 
                                src={nextProject.image}
                                alt={nextProject.name}
                                className="w-full h-full object-cover opacity-10 group-hover:opacity-30 group-hover:scale-105 transition-all duration-1000 blur-sm group-hover:blur-none grayscale group-hover:grayscale-0"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = `https://opengraph.githubassets.com/1/ChamikaShashipriya99/${nextProject.slug}`;
                                }}
                            />
                        </div>
                        <div className="relative z-20 max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
                            <p className="text-gray-500 font-mono text-sm uppercase tracking-[0.4em] mb-4">Proceed to Next Mission</p>
                            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tighter group-hover:scale-105 transition-transform duration-500 flex flex-wrap items-center justify-center gap-6">
                                <span className="line-clamp-1">{nextProject.name}</span> <span className={`${nextTheme.text} transition-all group-hover:translate-x-6 duration-500`}>➔</span>
                            </h2>
                        </div>
                    </a>
                );
            })()}
        </main>
    );
}
