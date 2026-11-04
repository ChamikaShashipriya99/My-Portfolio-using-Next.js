'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, Code2, Github, Pause, Play } from 'lucide-react';
import Link from 'next/link';

interface Repository {
    id: number;
    name: string;
    description: string | null;
    language: string | null;
    default_branch: string;
    html_url: string;
    homepage: string | null;
    fork: boolean;
    archived: boolean;
}

function Preview({ repo, portrait = false }: { repo: Repository; portrait?: boolean }) {
    const [attempt, setAttempt] = useState(0);
    const images = [
        `https://raw.githubusercontent.com/ChamikaShashipriya99/${encodeURIComponent(repo.name)}/${encodeURIComponent(repo.default_branch)}/thumbnail.png`,
        `https://opengraph.githubassets.com/1/ChamikaShashipriya99/${encodeURIComponent(repo.name)}`
    ];
    return <div className={`${portrait ? 'h-full w-full' : 'aspect-[16/10]'} overflow-hidden bg-gradient-to-br from-blue-950/50 to-neutral-950`}>
        {attempt < images.length ? <img src={images[attempt]} alt={`${repo.name.replace(/[-_]/g, ' ')} project preview`} className="h-full w-full object-contain object-center" onError={() => setAttempt(value => value + 1)} /> : <div className="h-full flex flex-col items-center justify-center gap-4 text-blue-300"><Code2 size={48} strokeWidth={1} /><span className="font-mono text-xs">{repo.name.replace(/[-_]/g, ' ')}</span></div>}
    </div>;
}

export default function HeroProjectCarousel() {
    const [projects, setProjects] = useState<Repository[]>([]);
    const [loading, setLoading] = useState(true);
    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const [paused, setPaused] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [focused, setFocused] = useState(false);
    const reducedMotion = useReducedMotion();
    const ref = useRef<HTMLDivElement>(null);
    const visible = useInView(ref, { amount: 0.3 });
    const move = (step: number) => {
        if (projects.length < 2) return;
        setDirection(step);
        setIndex(value => (value + step + projects.length) % projects.length);
    };

    useEffect(() => {
        const controller = new AbortController();
        async function load() {
            try {
                const response = await fetch('https://api.github.com/users/ChamikaShashipriya99/repos?sort=updated&direction=desc&per_page=6', { signal: controller.signal });
                if (!response.ok) throw new Error('Projects unavailable');
                const repos: Repository[] = await response.json();
                if (!Array.isArray(repos)) throw new Error('Invalid projects');
                const selected = repos.slice(0, 6);
                if (!controller.signal.aborted) setProjects(selected);
            } catch { /* Show a link to the full project section if GitHub is unavailable. */ }
            finally { if (!controller.signal.aborted) setLoading(false); }
        }
        load();
        return () => controller.abort();
    }, []);

    useEffect(() => {
        if (paused || hovered || focused || reducedMotion || !visible || projects.length < 2) return;
        const timer = window.setInterval(() => { setDirection(1); setIndex(value => (value + 1) % projects.length); }, 6000);
        return () => window.clearInterval(timer);
    }, [paused, hovered, focused, reducedMotion, visible, projects.length, index]);

    const project = projects[index];
    const buttonClass = 'rounded-full border border-white/10 p-2.5 text-gray-400 hover:text-white hover:border-blue-400/50 transition-colors focus-visible:outline focus-visible:outline-blue-400';
    return <div ref={ref} role="region" aria-roledescription="carousel" aria-label="Project highlights"
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }}
        onKeyDown={event => { if (event.target !== event.currentTarget || projects.length < 2) return; if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); } if (event.key === 'ArrowRight') { event.preventDefault(); move(1); } }} tabIndex={0}
        className="relative isolate w-full max-w-[560px] mx-auto py-2 focus-visible:outline focus-visible:outline-blue-400 rounded-[2rem]">
        <div className="relative">
        <div className="flex items-center justify-between px-2 py-4">
            <span className="flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] uppercase text-blue-300"><span className="h-1.5 w-1.5 rounded-full bg-blue-400" /> Project highlights</span>
            <a href="#projects" className="text-xs text-gray-400 hover:text-white inline-flex items-center gap-1">All projects <ArrowUpRight size={14} /></a>
        </div>
        {loading || !project ? <div className="min-h-[360px] flex flex-col items-center justify-center gap-4 p-8 text-center" role="status">
            <Code2 size={36} className={`text-blue-400 ${loading ? 'animate-pulse motion-reduce:animate-none' : ''}`} />
            <p className="text-sm text-gray-400">{loading ? 'Loading project highlights…' : 'Project previews are currently unavailable.'}</p>
            {!loading && <a href="#projects" className="text-sm text-blue-300">Explore my projects →</a>}
        </div> : <>
            <div className="relative h-[230px] sm:h-[290px] overflow-hidden" style={{ perspective: '1000px' }} aria-label="Choose a project preview">
                <div aria-hidden="true" className="absolute inset-[20%] rounded-full bg-blue-600/15 blur-3xl" />
                {projects.map((repo, position) => {
                    let offset = (position - index + projects.length) % projects.length;
                    if (offset > projects.length / 2) offset -= projects.length;
                    const distance = Math.abs(offset);
                    return <motion.button key={repo.id} type="button" aria-label={'Select ' + repo.name} aria-pressed={position === index}
                        tabIndex={distance > 2 ? -1 : 0} aria-hidden={distance > 2}
                        onClick={() => { setDirection(offset >= 0 ? 1 : -1); setIndex(position); }}
                        initial={false}
                        animate={{ x: offset * 82, y: distance * 5, scale: 1 - distance * 0.1, rotateY: offset === 0 ? 0 : offset > 0 ? -14 : 14, opacity: distance > 2 ? 0 : 1 - distance * 0.22 }}
                        transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 220, damping: 28 }}
                        style={{ zIndex: 10 - distance, marginLeft: '-35%', pointerEvents: distance > 2 ? 'none' : 'auto' }}
                        className="absolute left-1/2 top-1/2 -translate-y-1/2 aspect-[16/10] w-[70%] rounded-xl border border-white/20 bg-[#0a0f18] shadow-[0_12px_35px_rgba(0,0,0,0.4)] overflow-hidden text-left focus-visible:outline focus-visible:outline-blue-400">
                        <Preview repo={repo} portrait />
                    </motion.button>;
                })}
            </div>
            <div className="overflow-hidden" aria-live={paused || focused || reducedMotion ? 'polite' : 'off'} aria-atomic="true">
                <AnimatePresence mode="wait" initial={false} custom={direction}>
                    <motion.div key={project.id} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${projects.length}: ${project.name}`}
                        custom={direction}
                        variants={{ enter: (step: number) => ({ opacity: 0, x: reducedMotion ? 0 : step * 36 }), center: { opacity: 1, x: 0 }, exit: (step: number) => ({ opacity: 0, x: reducedMotion ? 0 : step * -36 }) }}
                        initial="enter" animate="center" exit="exit" transition={{ duration: reducedMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}>
                        <div className="px-2 pt-5 pb-4 h-[224px] sm:h-[212px] flex flex-col">
                            <div className="flex items-start justify-between gap-3 h-14 shrink-0"><Link href={`/project/${encodeURIComponent(project.name)}`} className="text-xl sm:text-2xl font-bold text-white capitalize hover:text-blue-300 break-words min-w-0 line-clamp-2">{project.name.replace(/[-_]/g, ' ')}</Link>{project.language && <span className="shrink-0 rounded-full bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 text-[10px] text-blue-300 font-mono">{project.language}</span>}</div>
                            <p className="mt-3 text-sm text-gray-400 leading-relaxed line-clamp-2 h-10 shrink-0">{project.description || 'Explore the project details and source code to see how it works.'}</p>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-auto pt-3 text-xs"><Link href={`/project/${encodeURIComponent(project.name)}`} className="text-blue-300 hover:text-white inline-flex items-center gap-1">View project <ArrowUpRight size={14} /></Link><a href={project.html_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white inline-flex items-center gap-1.5"><Github size={14} /> Source</a>{project.homepage && /^https?:\/\//i.test(project.homepage) && <a href={project.homepage} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white inline-flex items-center gap-1">Live demo <ArrowUpRight size={14} /></a>}</div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 px-2 py-4">
                <div className="flex items-center gap-3"><span className="font-mono text-xs text-white tabular-nums">{String(index + 1).padStart(2, '0')}<span className="text-gray-600"> / {String(projects.length).padStart(2, '0')}</span></span><div className="hidden sm:flex items-center gap-0">{projects.map((repo, position) => <button type="button" key={repo.id} aria-label={`Show ${repo.name}`} aria-current={index === position ? 'true' : undefined} onClick={() => { setDirection(position >= index ? 1 : -1); setIndex(position); }} className="p-2 focus-visible:outline focus-visible:outline-blue-400 rounded-full"><span className={`block h-1.5 rounded-full transition-all ${index === position ? 'w-6 bg-blue-400' : 'w-1.5 bg-gray-600'}`} /></button>)}</div></div>
                <div className="flex items-center gap-2">{!reducedMotion && projects.length > 1 && <button type="button" className={buttonClass} onClick={() => setPaused(value => !value)} aria-label={paused ? 'Resume automatic slides' : 'Pause automatic slides'}>{paused ? <Play size={14} /> : <Pause size={14} />}</button>}<button type="button" className={buttonClass} disabled={projects.length < 2} onClick={() => move(-1)} aria-label="Previous project"><ArrowLeft size={16} /></button><button type="button" className={buttonClass} disabled={projects.length < 2} onClick={() => move(1)} aria-label="Next project"><ArrowRight size={16} /></button></div>
            </div>
        </>}
        </div>
    </div>;
}
