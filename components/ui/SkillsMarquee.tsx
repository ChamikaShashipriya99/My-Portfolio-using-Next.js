'use client';

import React, { useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useInView, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Pause, Play, Search, X } from 'lucide-react';
import { mainStack, skillCategories, skillEvidence, type Skill } from './skills-data';

const Orbit = dynamic(() => import('./Skills3DCloud'), { ssr: false, loading: () => <div className="h-80 flex items-center justify-center text-sm text-gray-500" role="status">Loading orbit view…</div> });

export default function SkillsMarquee() {
    const [category, setCategory] = useState('All');
    const [query, setQuery] = useState('');
    const [paused, setPaused] = useState(false);
    const [selected, setSelected] = useState<Skill | null>(null);
    const reducedMotion = useReducedMotion();
    const section = useRef<HTMLElement>(null);
    const evidenceRef = useRef<HTMLDivElement>(null);
    const visible = useInView(section, { amount: 0.1 });
    const groups = useMemo(() => skillCategories.filter(group => category === 'All' || category === group.title).map(group => ({ ...group, skills: group.skills.filter(skill => skill.name.toLowerCase().includes(query.trim().toLowerCase())) })).filter(group => group.skills.length), [category, query]);
    const skills = useMemo(() => groups.flatMap(group => group.skills), [groups]);
    const selectSkill = (skill: Skill) => { setSelected(skill); requestAnimationFrame(() => { evidenceRef.current?.focus({ preventScroll: true }); evidenceRef.current?.scrollIntoView({ block: 'nearest', behavior: reducedMotion ? 'instant' : 'smooth' }); }); };
    const card = (skill: Skill) => <button type="button" key={skill.name} onClick={() => selectSkill(skill)} aria-label={`View project evidence for ${skill.name}`} className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/[0.025] hover:border-blue-400/50 hover:bg-blue-500/5 transition-colors text-left focus-visible:outline focus-visible:outline-blue-400">
        <skill.icon aria-hidden="true" className="text-xl shrink-0" style={{ color: skill.color }} /><span className="text-sm text-gray-200">{skill.name}</span><ArrowUpRight aria-hidden="true" size={12} className="ml-auto text-gray-600" />
    </button>;
    const stopMotion = paused || !!reducedMotion || !visible;

    return <section id="skills" ref={section} aria-labelledby="skills-title" className="py-20 sm:py-24 relative overflow-hidden bg-black/50">
        <span aria-hidden="true" className="absolute top-8 right-6 font-black text-white/[0.03] text-[10rem] lg:text-[18rem] leading-none pointer-events-none">03</span>
        <div className="container mx-auto px-6 relative z-10">
            <p className="font-mono text-xs tracking-[0.25em] uppercase text-blue-400 mb-3">The tools behind my work</p>
            <h2 id="skills-title" className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase">Skills &amp; <span className="text-blue-500">Technologies</span></h2>
            <div className="w-24 h-1 rounded-full bg-blue-600 mt-4" />
            <p className="text-sm sm:text-base text-gray-400 mt-5 max-w-xl leading-relaxed">From responsive interfaces to backend APIs. Explore my toolkit and select a technology to see mapped project evidence.</p>

            <div className="mt-9 mb-8 rounded-2xl border border-blue-500/20 bg-blue-950/10 p-5 sm:p-6">
                <div className="flex flex-wrap items-baseline gap-3 mb-4"><h3 className="text-sm font-semibold text-white">Main stack</h3><span className="text-xs font-mono text-blue-400">MERN · full-stack web development</span></div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{mainStack.map(card)}</div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                <button type="button" disabled={!!reducedMotion} onClick={() => setPaused(value => !value)} aria-pressed={paused} className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-xs text-gray-300 focus-visible:outline focus-visible:outline-blue-400 disabled:opacity-60">{stopMotion ? <Play size={13} /> : <Pause size={13} />}{reducedMotion ? 'Reduced motion enabled' : paused ? 'Resume motion' : 'Pause motion'}</button>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
                <label className="flex items-center gap-2 border border-white/10 bg-black/30 rounded-xl px-3 py-2.5 sm:w-64"><Search aria-hidden="true" size={15} className="text-gray-500" /><span className="sr-only">Search technologies</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search technologies" className="min-w-0 w-full bg-transparent text-sm text-gray-200 outline-none focus-visible:underline" /></label>
                <div role="group" aria-label="Skill categories" className="flex flex-wrap gap-2">{['All', ...skillCategories.map(group => group.title)].map(name => <button type="button" key={name} aria-pressed={category === name} onClick={() => setCategory(name)} className={`px-3 py-2 rounded-full text-[11px] border focus-visible:outline focus-visible:outline-blue-400 ${category === name ? 'text-blue-300 border-blue-400/40 bg-blue-500/10' : 'text-gray-500 border-white/10 hover:text-white'}`}>{name}</button>)}</div>
            </div>
            {!skills.length ? <p role="status" className="py-12 text-center text-gray-500">No technologies match your search. Try another name or category.</p> : <Orbit skills={skills} paused={stopMotion} onSelect={selectSkill} />}
            <div ref={evidenceRef} tabIndex={-1} role="region" aria-label="Project evidence" className="mt-8 rounded-2xl border border-blue-500/20 bg-blue-950/10 p-5 sm:p-6 focus-visible:outline focus-visible:outline-blue-400">
                {selected ? <><div className="flex items-center justify-between gap-3"><h3 className="text-base font-semibold text-white">{selected.name} · project evidence</h3><button type="button" aria-label="Close project evidence" className="text-gray-400 hover:text-white p-2" onClick={() => setSelected(null)}><X size={16} /></button></div>
                    {skillEvidence[selected.name]?.length ? <ul className="mt-4 space-y-3">{skillEvidence[selected.name].map(project => <li key={project.slug}><Link href={`/project/${encodeURIComponent(project.slug)}`} className="inline-flex items-center gap-2 text-sm text-blue-300 hover:text-white focus-visible:outline focus-visible:outline-blue-400">{project.title}<ArrowUpRight aria-hidden="true" size={14} /></Link></li>)}</ul> : <p className="mt-3 text-sm text-gray-400">No verified project mapping is listed for this technology yet.</p>}</> : <p className="text-sm text-gray-400">Select a technology to see its mapped projects. Project links describe usage rather than proficiency scores.</p>}
            </div>
        </div>
    </section>;
}
