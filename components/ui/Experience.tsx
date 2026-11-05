'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, BriefcaseBusiness, GraduationCap } from 'lucide-react';

interface TimelineEntry {
    organisation: string;
    website?: string;
    title: string;
    period: string;
    type: string;
    status?: string;
    logo: string;
    bullets: string[];
    technologies?: string[];
    project?: { name: string; href: string };
}

const work: TimelineEntry[] = [
    {
        organisation: 'Sri Lanka Telecom PLC', title: 'Full-Stack Developer Intern',
        period: 'Apr 2026 – Oct 2026', type: 'Internship', logo: '/images/SLT.png',
        bullets: [
            'Developed SLTMGames, a MERN platform for corporate sports tournament management and player registration.',
            'Implemented 2FA/TOTP authentication, an administrative dashboard, and an event photo gallery.',
            'Built Express REST APIs and integrated MongoDB for tournament, team, and participant data.',
        ],
        technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT', '2FA / TOTP'],
        project: { name: 'Visit SLTMGames', href: 'https://sltmgames.slt.lk' },
    },
    {
        organisation: 'DoMedia / DoAcademy', website: 'https://www.domedia.lk/', title: 'Full-Stack Web Development Trainee',
        period: 'Nov 2025 – Jan 2026', type: 'Industrial Training', logo: '/images/domediaLogo.jpg',
        bullets: [
            'Completed a three-month, full-time industrial training programme in full-stack web development.',
            'Developed frontend and backend skills through the training programme.',
        ],
    },
    {
        organisation: 'United Motors PLC', website: 'https://www.unitedmotors.lk/', title: 'Automobile Motor Mechanic Technician',
        period: 'Jan 2020 – Jan 2022', type: 'Employment', logo: '/images/united-motors-logo.png',
        bullets: [
            'Worked in automotive repair and maintenance.',
            'Built hands-on technical and problem-solving skills through practical mechanical work.',
        ],
    },
];
const education: TimelineEntry[] = [
    {
        organisation: 'SLIIT', website: 'https://www.sliit.lk/', title: 'BSc (Hons) in Information Technology',
        period: 'Jul 2023 – Present', type: 'Degree', status: 'In progress', logo: '/images/sliit-logo.png',
        bullets: ['Studying Information Technology with a focus on computing and software development.'],
    },
    {
        organisation: 'AETI · Orugodawatta', website: 'https://aeti.naita.gov.lk/', title: 'Automobile Motor Mechanic Course',
        period: '2019 – 2022', type: 'Technical Training', status: 'Completed', logo: '/images/aeti-logo.png',
        bullets: ['Completed training in automobile motor mechanics, including engine repair, diagnostics, and automotive systems.'],
    },
    {
        organisation: 'The Open University of Sri Lanka', title: 'Listening and Speaking',
        period: '2022', type: 'Short Course', status: 'Completed', logo: '/images/open-university-logo.png',
        bullets: ['Completed a short course in listening and speaking to develop communication skills.'],
    },
    {
        organisation: 'The Open University of Sri Lanka', title: 'Information & Communication Technology',
        period: '2016', type: 'Short Course', status: 'Completed', logo: '/images/open-university-logo.png',
        bullets: ['Completed a course covering Microsoft Office applications and basic computer skills.'],
    },
];

function Timeline({ entries, label }: { entries: TimelineEntry[]; label: string }) {
    const reducedMotion = useReducedMotion();
    return <ol aria-label={label} className="relative space-y-5 border-l border-blue-500/20 ml-2 pl-5 sm:pl-7">
        {entries.map(entry => <motion.li key={`${entry.organisation}-${entry.title}`} initial={reducedMotion ? false : { opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: reducedMotion ? 0 : 0.45 }} className="relative rounded-2xl border border-white/10 bg-neutral-950/70 p-5 sm:p-6">
            <span aria-hidden="true" className="absolute -left-[26px] sm:-left-[34px] top-8 h-2 w-2 rounded-full bg-blue-400 ring-4 ring-black" />
            <div className="flex items-start gap-3 sm:gap-4">
                <div className="relative w-12 h-12 rounded-xl shrink-0 bg-white border border-white/10 overflow-hidden">
                    <Image src={entry.logo} alt="" fill sizes="48px" className="object-contain p-1.5" />
                </div>
                <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-blue-300 leading-relaxed">{entry.website ? <a href={entry.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-white underline decoration-blue-400/30 underline-offset-4 focus-visible:outline focus-visible:outline-blue-400 rounded">{entry.organisation}<ArrowUpRight size={12} aria-hidden="true" /><span className="sr-only"> (official website, opens in a new tab)</span></a> : entry.organisation}</p>
                    <h4 className="text-base sm:text-lg font-semibold text-white leading-snug mt-1 break-words">{entry.title}</h4>
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-4 text-[11px] sm:text-xs">
                <span className="text-gray-400 font-mono">{entry.period}</span>
                <span className="rounded-full border border-white/10 px-2.5 py-1 text-gray-400">{entry.type}</span>
                {entry.status && <span className={`rounded-full px-2.5 py-1 ${entry.status === 'In progress' ? 'text-blue-200 bg-blue-500/10 border border-blue-500/20' : 'text-gray-400 bg-white/5'}`}>{entry.status}</span>}
            </div>
            <ul className="mt-4 space-y-2 pl-4 list-disc marker:text-blue-500/60 text-sm leading-relaxed text-gray-400">
                {entry.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}
            </ul>
            {entry.technologies && <ul aria-label="Technologies used" className="flex flex-wrap gap-2 mt-5">{entry.technologies.map(technology => <li key={technology} className="rounded-md border border-blue-500/15 bg-blue-500/5 px-2 py-1 text-[10px] font-mono text-blue-300">{technology}</li>)}</ul>}
            {entry.project && <a href={entry.project.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-5 text-sm text-blue-300 hover:text-white focus-visible:outline focus-visible:outline-blue-400 rounded">{entry.project.name}<ArrowUpRight size={14} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>}
        </motion.li>)}
    </ol>;
}

export default function Experience() {
    return <section id="experience" aria-labelledby="experience-title" className="py-20 sm:py-24 relative overflow-hidden">
        <span aria-hidden="true" className="absolute bottom-8 right-6 font-black text-white/[0.03] text-[10rem] lg:text-[18rem] leading-none pointer-events-none">06</span>
        <div className="container mx-auto px-6 relative">
            <div className="mb-10 sm:mb-14">
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-blue-400 mb-3">Learning through hands-on work</p>
                <h2 id="experience-title" className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase leading-tight">Experience &amp; <span className="text-blue-500">Education</span></h2>
                <div className="h-1 w-24 rounded-full bg-blue-600 mt-4" />
                <p className="mt-5 text-sm sm:text-base text-gray-400 max-w-xl leading-relaxed">My path from technical work to full-stack development, alongside the education and training behind it.</p>
            </div>
            <div className="grid lg:grid-cols-2 gap-10 xl:gap-14 items-start">
                <div className="min-w-0"><h3 className="flex items-center gap-3 text-xl font-semibold text-white mb-6"><BriefcaseBusiness size={20} className="text-blue-400" aria-hidden="true" />Experience</h3><Timeline entries={work} label="Work experience, most recent first" /></div>
                <div className="min-w-0"><h3 className="flex items-center gap-3 text-xl font-semibold text-white mb-6"><GraduationCap size={20} className="text-blue-400" aria-hidden="true" />Education</h3><Timeline entries={education} label="Education, current study followed by completed courses" /></div>
            </div>
        </div>
    </section>;
}
