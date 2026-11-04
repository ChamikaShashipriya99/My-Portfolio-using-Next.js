'use client';

import Image from 'next/image';
import React, { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Check } from 'lucide-react';

const tabs = [
    { id: 'story', label: 'My story' },
    { id: 'approach', label: 'My approach' },
    { id: 'json', label: 'profile.json' },
] as const;
type Tab = typeof tabs[number]['id'];
const profile = {
    name: 'Chamika Shashipriya',
    role: 'Full-Stack Web Developer',
    location: 'Sri Lanka',
    education: 'BSc (Hons) in Information Technology, SLIIT — in progress',
    availability: 'Open to full-time opportunities',
    background: ['Automobile motor mechanics', 'Full-stack development'],
    experience: ['Sri Lanka Telecom PLC — full-stack internship', 'DoMedia / DoAcademy — industrial training'],
    focus: ['Responsive interfaces', 'Full-stack applications', 'Backend APIs'],
};
const approach = [
    { number: '01', title: 'Understand the problem', text: 'Start with the people using the product: what they need, what gets in their way, and what a useful result looks like.' },
    { number: '02', title: 'Plan the experience', text: 'Map the main user flows, organise the data, and break the work into manageable pieces before building.' },
    { number: '03', title: 'Build with care', text: 'Connect responsive interfaces to clear backend APIs, keeping the code readable and the experience consistent.' },
    { number: '04', title: 'Test and refine', text: 'Check the key flows, look for edge cases, and improve the result through feedback and iteration.' },
];

export default function About() {
    const [activeTab, setActiveTab] = useState<Tab>('story');
    const [portraitFailed, setPortraitFailed] = useState(false);
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const reducedMotion = useReducedMotion();
    const keyboardTab = (event: React.KeyboardEvent, index: number) => {
        let next = index;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        else return;
        event.preventDefault();
        setActiveTab(tabs[next].id);
        tabRefs.current[next]?.focus();
    };

    return (
        <section id="about" aria-labelledby="about-title" className="py-20 sm:py-24 5xl:py-48 relative overflow-hidden bg-black/45">
            <div aria-hidden="true" className="absolute inset-0 hero-grain pointer-events-none opacity-[0.02]" />
            <span aria-hidden="true" className="pointer-events-none select-none absolute bottom-8 right-6 font-black text-white/[0.02] text-[10rem] lg:text-[18rem] leading-none tracking-tighter font-mono">02</span>
            <div className="container mx-auto px-6 relative">
                <div className="mb-10 sm:mb-14">
                    <p className="font-mono text-xs uppercase tracking-[0.25em] text-blue-400 mb-3">The person behind the code</p>
                    <h2 id="about-title" className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase leading-tight">About <span className="text-blue-500">Me</span></h2>
                    <div className="h-1 w-24 bg-blue-600 rounded-full mt-4" />
                </div>

                <div className="grid lg:grid-cols-12 gap-8 xl:gap-12 items-start">
                    <motion.div initial={reducedMotion ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: reducedMotion ? 0 : 0.6 }} className="lg:col-span-5 min-w-0 w-full max-w-[240px] sm:max-w-xs lg:max-w-[380px] mx-auto">
                        <div className="relative rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-950/20 to-neutral-950 p-3">
                            <div className="overflow-hidden rounded-xl bg-neutral-900">
                                {!portraitFailed ? <Image src="/images/chamika-portrait.webp" width={760} height={912} sizes="(min-width: 1024px) 354px, (min-width: 640px) 294px, 214px" alt="Chamika Shashipriya" onError={() => setPortraitFailed(true)} className="block w-full h-auto" /> : <div className="w-full aspect-[5/6] flex items-center justify-center font-black text-7xl text-blue-400" role="img" aria-label="Chamika Shashipriya initials">CS</div>}
                            </div>
                            <div className="flex items-center gap-2 px-2 pt-4 pb-1 text-xs text-blue-200"><span aria-hidden="true" className="h-2 w-2 rounded-full bg-green-400" /> Open to full-time opportunities</div>
                        </div>
                        <p className="mt-4 text-center text-xs sm:text-sm text-gray-400 leading-relaxed">Sri Lanka <span aria-hidden="true" className="mx-2 text-blue-400">·</span> Studying BSc (Hons) IT at SLIIT</p>
                    </motion.div>

                    <motion.div initial={reducedMotion ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: reducedMotion ? 0 : 0.6, delay: reducedMotion ? 0 : 0.1 }} className="lg:col-span-7 min-w-0 rounded-2xl border border-white/10 bg-[#0b0d12]/90 overflow-hidden">
                        <div aria-hidden="true" className="flex items-center gap-3 px-5 py-4 bg-white/[0.02] border-b border-white/5"><div className="flex gap-1.5"><span className="h-2 w-2 bg-red-400/60 rounded-full" /><span className="h-2 w-2 bg-amber-400/60 rounded-full" /><span className="h-2 w-2 bg-green-400/60 rounded-full" /></div><span className="text-[10px] font-mono text-gray-500 truncate">~/chamika/about</span></div>
                        <div role="tablist" aria-label="About Chamika" className="flex border-b border-white/10 px-2 sm:px-4">
                            {tabs.map((tab, index) => <button key={tab.id} ref={element => { tabRefs.current[index] = element; }} type="button" id={`about-tab-${tab.id}`} role="tab" aria-selected={activeTab === tab.id} aria-controls={`about-panel-${tab.id}`} tabIndex={activeTab === tab.id ? 0 : -1} onClick={() => setActiveTab(tab.id)} onKeyDown={event => keyboardTab(event, index)} className={`relative px-3 sm:px-5 py-4 font-mono text-[11px] sm:text-xs whitespace-nowrap transition-colors focus-visible:outline focus-visible:outline-blue-400 focus-visible:outline-offset-[-4px] ${activeTab === tab.id ? 'text-blue-300 bg-blue-500/5' : 'text-gray-500 hover:text-white'}`}>
                                {tab.label}{activeTab === tab.id && <span aria-hidden="true" className="absolute bottom-0 left-3 right-3 h-0.5 bg-blue-400" />}
                            </button>)}
                        </div>

                        {tabs.map(tab => <div key={tab.id} role="tabpanel" id={`about-panel-${tab.id}`} aria-labelledby={`about-tab-${tab.id}`} hidden={activeTab !== tab.id} tabIndex={0} className="h-[480px] sm:h-[500px] lg:h-[520px] overflow-y-auto overscroll-contain p-5 sm:p-8 focus-visible:outline focus-visible:outline-blue-400 focus-visible:outline-offset-[-2px]">
                            {tab.id === 'story' ? <div className="space-y-5 text-sm sm:text-base leading-relaxed text-gray-400">
                                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">A practical mindset.<br /><span className="text-blue-400">A new way to build.</span></h3>
                                <p>I’m Chamika, a Sri Lanka–based full-stack developer studying Information Technology at SLIIT. Before software development, I trained and worked in automobile motor mechanics.</p>
                                <p>My development experience includes a full-stack internship at <span className="text-gray-200">Sri Lanka Telecom PLC</span> and industrial training at <span className="text-gray-200">DoMedia / DoAcademy</span>. I focus on responsive interfaces, full-stack applications, and backend APIs.</p>
                                <p>I’m looking for a full-time opportunity to contribute to a team, build useful products, and continue developing my skills.</p>
                                <a href="#experience" className="inline-flex items-center gap-2 text-blue-300 hover:text-white focus-visible:outline focus-visible:outline-blue-400 rounded">Explore my experience <ArrowUpRight aria-hidden="true" size={16} /></a>
                            </div> : tab.id === 'approach' ? <div><h3 className="text-2xl font-bold text-white mb-6">How I approach a project</h3><ol className="space-y-6">{approach.map(step => <li key={step.number} className="flex gap-4"><span aria-hidden="true" className="font-mono text-xs text-blue-400 pt-1">{step.number}</span><div><h4 className="text-sm sm:text-base font-semibold text-gray-100">{step.title}</h4><p className="text-sm leading-relaxed text-gray-400 mt-2">{step.text}</p></div></li>)}</ol></div> : <div><h3 className="sr-only">Developer profile in JSON format</h3><pre className="whitespace-pre-wrap break-words font-mono text-[11px] sm:text-xs leading-loose text-blue-200">{JSON.stringify(profile, null, 2)}</pre></div>}
                        </div>)}
                        <div aria-hidden="true" className="border-t border-white/5 px-5 py-3 flex items-center justify-between gap-3 font-mono text-[9px] text-gray-500"><span>{activeTab === 'json' ? 'JSON · UTF-8' : 'CHAMIKA / PROFILE'}</span><span className="flex items-center gap-1.5"><Check size={11} className="text-blue-400" /> {activeTab === 'json' ? 'Developer view' : 'Personal perspective'}</span></div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
