'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { HiX, HiStar, HiEye, HiCheck, HiClipboardCopy } from 'react-icons/hi';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ProjectInspectorModalProps {
    slug: string;
    onClose: () => void;
}

interface ProjectRepoDetails {
    slug: string;
    name: string;
    description: string;
    readme: string;
    stars: number;
    watchers: number;
    tech: string[];
    github: string;
    live: string;
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
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest cursor-pointer"
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

export default function ProjectInspectorModal({ slug, onClose }: ProjectInspectorModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);
    const [project, setProject] = useState<ProjectRepoDetails | null>(null);
    const [loadingStatus, setLoadingStatus] = useState<string[]>([]);

    // Block scrolling on document body when modal is active
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // Handle Esc key to close modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // Dynamic loading diagnostics sequence on mount
    useEffect(() => {
        const logs = [
            'CONNECTING PORTFOLIO INTEL LINK... SUCCESS',
            'FETCHING GITHUB REPOS CORE METADATA... OK',
            'RESOLVING MAIN CODE BRANCH FILE POINTERS... OK',
            'RETRIEVING READ-ME DOCUMENT FILE DATA... SYSTEM RETRIEVED',
            'INITIALIZING MARKDOWN ENGINE TELEMETRY... READY'
        ];

        let index = 0;
        const interval = setInterval(() => {
            if (index < logs.length) {
                const nextLog = logs[index];
                setLoadingStatus(prev => [...prev, nextLog]);
                index++;
            } else {
                clearInterval(interval);
            }
        }, 180);

        return () => clearInterval(interval);
    }, []);

    // Fetch dynamic project files and stats
    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                // Fetch GitHub Repository parameters
                const repoRes = await fetch(`https://api.github.com/repos/ChamikaShashipriya99/${slug}`);
                if (!repoRes.ok) {
                    throw new Error(`Repository data could not be parsed.`);
                }
                const repoData = await repoRes.json();

                // Fetch README content dynamically from main or master
                const branches = ['main', 'master'];
                let readmeText = '';
                
                for (const branch of branches) {
                    try {
                        const readmeRes = await fetch(`https://raw.githubusercontent.com/ChamikaShashipriya99/${slug}/${branch}/README.md`);
                        if (readmeRes.ok) {
                            readmeText = await readmeRes.text();
                            break;
                        }
                    } catch (e) {}
                }

                if (!readmeText) {
                    readmeText = `# ${repoData.name.replace(/-/g, ' ')}\n\nRepository diagnostic file empty. No README.md logs registered.`;
                }

                setProject({
                    slug: repoData.name,
                    name: repoData.name.replace(/-/g, ' '),
                    description: repoData.description || 'No description registered.',
                    readme: readmeText,
                    stars: repoData.stargazers_count,
                    watchers: repoData.watchers_count,
                    tech: repoData.language ? [repoData.language] : ['Web'],
                    github: repoData.html_url,
                    live: repoData.homepage || repoData.html_url,
                });
            } catch (e) {
                console.error(e);
            } finally {
                // Keep loading screen active briefly to let console logs animate
                setTimeout(() => {
                    setLoading(false);
                }, 1100);
            }
        };

        fetchProjectDetails();
    }, [slug]);

    const theme = getTheme(project?.tech[0] || 'Web');

    const MarkdownComponents = {
        code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const codeContent = String(children).replace(/\n$/, '');

            return !inline && match ? (
                <div className="rounded-xl overflow-hidden my-6 border border-white/10 shadow-2xl group/code">
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
                        className="!m-0 !bg-transparent !p-4 font-mono text-xs md:text-sm leading-relaxed overflow-x-auto"
                        {...props}
                    >
                        {codeContent}
                    </SyntaxHighlighter>
                </div>
            ) : (
                <code className="bg-white/5 text-blue-400 px-1.5 py-0.5 rounded font-mono text-xs md:text-sm" {...props}>
                    {children}
                </code>
            );
        },
        h1: (props: any) => {
            const id = generateId(String(props.children));
            return <h1 id={id} className={`text-2xl md:text-4xl font-black text-white mt-10 mb-6 uppercase tracking-tighter border-l-4 ${theme.border} pl-4`} {...props} />;
        },
        h2: (props: any) => {
            const id = generateId(String(props.children));
            return (
                <h2 id={id} className="text-xl md:text-2xl font-black text-white mt-8 mb-4 uppercase tracking-tight flex items-center gap-3">
                    <span className={`h-1 w-6 ${theme.bg} rounded-full`} /> {props.children}
                </h2>
            );
        },
        h3: (props: any) => {
            const id = generateId(String(props.children));
            return <h3 id={id} className={`text-lg md:text-xl font-bold mt-6 mb-3 tracking-tight ${theme.text}`} {...props} />;
        },
        p: ({ children, ...props }: any) => {
            if (React.Children.toArray(children).some((child: any) =>
                child.type === 'div' || (child.props && (child.type === 'img' || child.props.node?.tagName === 'img'))
            )) {
                return <div className="mb-4">{children}</div>;
            }
            return <p className="text-gray-400 leading-relaxed mb-4 text-xs md:text-sm" {...props}>{children}</p>;
        },
        ul: (props: any) => (
            <ul className="space-y-2 mb-6 ml-4" {...props} />
        ),
        li: (props: any) => (
            <li className="flex gap-2 text-gray-400 text-xs md:text-sm">
                <span className={`${theme.text}`}>▹</span> <span>{props.children}</span>
            </li>
        ),
        blockquote: (props: any) => (
            <div className="my-8 p-6 bg-white/5 border border-white/5 rounded-2xl relative overflow-hidden group">
                <div className={`absolute top-0 left-0 w-1.5 h-full ${theme.bg}`} />
                <div className="italic text-gray-300 relative z-10 leading-relaxed text-xs md:text-sm">
                    {props.children}
                </div>
            </div>
        ),
        a: (props: any) => (
            <a className={`${theme.text} hover:opacity-80 underline decoration-current/30 underline-offset-4 transition-all`} target="_blank" rel="noopener noreferrer" {...props} />
        ),
        img: ({ src, alt, ...props }: any) => {
            const isRelative = src && !src.startsWith('http') && !src.startsWith('https') && !src.startsWith('/');
            const absoluteSrc = isRelative
                ? `https://raw.githubusercontent.com/ChamikaShashipriya99/${slug}/main/${src.replace(/^\.\//, '')}`
                : src;

            return (
                <div className="my-6 rounded-2xl overflow-hidden border border-white/5 shadow-2xl relative">
                    <img
                        src={absoluteSrc}
                        alt={alt || "Markdown image"}
                        className="w-full h-auto object-contain"
                        {...props}
                    />
                </div>
            );
        }
    };

    return (
        <div 
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 md:p-8"
        >
            {/* Main Terminal Frame */}
            <motion.div
                ref={modalRef}
                data-lenis-prevent
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: 'spring', damping: 26, stiffness: 220 }}
                className="relative w-full max-w-5xl h-[90vh] md:h-[80vh] border border-blue-500/20 bg-[#06080f]/90 rounded-3xl overflow-hidden flex flex-col shadow-[0_0_50px_rgba(59,130,246,0.15)] select-none text-gray-300"
            >
                {/* CRT Screen Scanlines overlay */}
                <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-[0.05]" />

                {/* Header Terminal Bar */}
                <div className="px-6 py-4 bg-black/45 border-b border-white/5 flex items-center justify-between shrink-0 font-mono text-[10px] md:text-xs">
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                            <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors flex items-center justify-center text-[7px] text-red-950 font-bold group cursor-pointer">
                                <span className="opacity-0 group-hover:opacity-100">×</span>
                            </button>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
                            <div className="w-3 h-3 rounded-full bg-green-500/40" />
                        </div>
                        <span className="text-gray-500">|</span>
                        <span className="text-blue-500 font-bold uppercase tracking-widest animate-pulse">Diagnostics Console</span>
                        <span className="text-gray-600 hidden sm:inline">~/projects/{slug}</span>
                    </div>

                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors cursor-pointer p-1 rounded hover:bg-white/5"
                        title="Close Inspector"
                    >
                        <HiX size={18} />
                    </button>
                </div>

                <div className="flex-1 min-h-0 flex flex-col md:flex-row relative">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            // Cyber Diagnostics Scanner Loading State
                            <motion.div 
                                key="loader"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-[#06080f] flex flex-col items-center justify-center p-6 z-40 font-mono text-[10px] md:text-xs text-blue-400 uppercase tracking-widest select-none"
                            >
                                <div className="space-y-2 mb-8 max-w-md w-full">
                                    {loadingStatus.map((status, i) => (
                                        <div key={i} className="flex gap-2 items-center">
                                            <span className="text-blue-500/40">&gt;&gt;</span>
                                            <span className={status.includes('SUCCESS') || status.includes('SYSTEM') ? 'text-emerald-400 font-bold' : ''}>{status}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-12 h-12 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                                    <span className="text-blue-500/60 animate-pulse text-[9px]">DIAGNOSTIC SYSTEM IN PROGRESS</span>
                                </div>
                            </motion.div>
                        ) : (
                            // Main Modal Content
                            <motion.div 
                                key="content"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden"
                            >
                                {/* Left Content Area (Markdown Readme) */}
                                <div className="flex-1 overflow-y-auto px-6 py-6 md:px-8 select-text relative scrollbar-thin scrollbar-thumb-white/10">
                                    <div className="prose prose-invert max-w-none">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents as any}>
                                            {project?.readme || ''}
                                        </ReactMarkdown>
                                    </div>
                                </div>

                                {/* Right Stats Sidebar */}
                                <div className="w-full md:w-80 bg-black/30 border-t md:border-t-0 md:border-l border-white/5 p-6 flex flex-col gap-6 shrink-0 font-mono text-xs select-none">
                                    {/* Project Stats Panel */}
                                    <div className="space-y-4">
                                        <span className="text-gray-500 uppercase tracking-widest text-[9px] font-bold">Repository Telemetry</span>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white/5 border border-white/5 p-3 rounded-2xl flex flex-col items-center justify-center gap-1">
                                                <HiStar className="text-yellow-400 text-lg" />
                                                <span className="text-white font-bold">{project?.stars}</span>
                                                <span className="text-[9px] text-gray-500 uppercase">Stars</span>
                                            </div>
                                            <div className="bg-white/5 border border-white/5 p-3 rounded-2xl flex flex-col items-center justify-center gap-1">
                                                <HiEye className="text-blue-400 text-lg" />
                                                <span className="text-white font-bold">{project?.watchers}</span>
                                                <span className="text-[9px] text-gray-500 uppercase">Watchers</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Verification Checklist */}
                                    <div className="space-y-3">
                                        <span className="text-gray-500 uppercase tracking-widest text-[9px] font-bold">Build Checklists</span>
                                        <div className="space-y-2 bg-white/5 border border-white/5 p-4 rounded-2xl">
                                            {[
                                                { label: 'System Build', status: 'PASS' },
                                                { label: 'Dependencies', status: 'SECURE' },
                                                { label: 'Code Quality', status: 'CLEAN' },
                                                { label: 'Diagnostics', status: 'ONLINE' }
                                            ].map((check, idx) => (
                                                <div key={idx} className="flex justify-between items-center text-[10px]">
                                                    <span className="text-gray-400 flex items-center gap-1.5">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                        {check.label}
                                                    </span>
                                                    <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded text-[8px]">
                                                        {check.status}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-auto space-y-3 pt-4 border-t border-white/5">
                                        <a 
                                            href={project?.github} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold uppercase tracking-wider text-[10px] transition-all cursor-pointer"
                                        >
                                            <FaGithub className="text-sm" /> View Repository
                                        </a>
                                        {project?.live && project?.live !== project?.github && (
                                            <a 
                                                href={project?.live} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className={`w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r ${theme.from || 'from-blue-600/20'} to-indigo-600/20 hover:opacity-90 border ${theme.borderLight || 'border-blue-500/20'} ${theme.text} rounded-xl font-bold uppercase tracking-wider text-[10px] transition-all cursor-pointer shadow-lg shadow-blue-500/5`}
                                            >
                                                <FaExternalLinkAlt className="text-xs" /> Live Sandbox Demo
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
