'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ArrowUp, ArrowUpRight, Check, Copy, Download, Github, Linkedin, UserRoundPlus } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { SiNextdotjs, SiReact, SiTypescript, SiTailwindcss, SiThreedotjs, SiFramer, SiVercel } from 'react-icons/si';

const email = 'chamikashashipriya3@gmail.com';
const links = [
    { name: 'Home', href: '#home' }, { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' }, { name: 'Projects', href: '#projects' },
    { name: 'Activity', href: '#skyline' }, { name: 'Experience', href: '#experience' },
    { name: 'Contact', href: '#contact' }, { name: 'Arcade', href: '#arcade' },
    { name: 'Business Card', href: '#business-card' },
];
const technologies = [
    { icon: SiNextdotjs, label: 'Next.js' }, { icon: SiReact, label: 'React' },
    { icon: SiTypescript, label: 'TypeScript' }, { icon: SiTailwindcss, label: 'Tailwind CSS' },
    { icon: SiThreedotjs, label: 'Three.js' }, { icon: SiFramer, label: 'Framer Motion' },
    { icon: SiVercel, label: 'Vercel' },
];

function LocalTime() {
    const [time, setTime] = useState('');
    useEffect(() => {
        const update = () => setTime(new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Colombo', hour: '2-digit', minute: '2-digit', hour12: true }));
        update();
        const timer = window.setInterval(update, 60000);
        return () => window.clearInterval(timer);
    }, []);
    return <p className="text-xs text-gray-400 leading-relaxed">Sri Lanka · UTC+5:30{time && <span className="text-gray-500 ml-2 tabular-nums">{time}</span>}</p>;
}

export default function Footer() {
    const reducedMotion = useReducedMotion();
    const [copyStatus, setCopyStatus] = useState('');
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
    const copyEmail = async () => {
        try {
            await navigator.clipboard.writeText(email);
            setCopyStatus('Email address copied.');
            if (timer.current) clearTimeout(timer.current);
            timer.current = setTimeout(() => setCopyStatus(''), 3000);
        } catch { setCopyStatus('Copy unavailable. Select the address or open your email app.'); }
    };
    const navigate = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        const target = document.querySelector<HTMLElement>(href);
        if (!target) return;
        event.preventDefault();
        const header = document.querySelector('nav[aria-label="Main navigation"]');
        const offset = (header?.getBoundingClientRect().bottom ?? 80) + 16;
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        window.scrollTo({ top: Math.max(0, window.scrollY + target.getBoundingClientRect().top - offset), behavior: reducedMotion ? 'instant' : 'smooth' });
        window.history.replaceState(null, '', href);
    };
    const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-4 rounded';
    const linkClass = `text-sm text-gray-300 hover:text-blue-300 transition-colors ${focus}`;

    return <footer aria-label="Site footer" className="relative border-t border-white/10 bg-black/40 pt-10 sm:pt-12 pb-8 overflow-hidden">
        <div aria-hidden="true" className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-blue-600/5 blur-3xl pointer-events-none" />
        <div className="container mx-auto px-6 relative">
            <div className="grid gap-9 md:grid-cols-2 xl:grid-cols-[1.15fr_0.9fr_1fr] xl:gap-12">
                <div className="min-w-0 space-y-5">
                    <a href="#home" onClick={event => navigate(event, '#home')} aria-label="Chamika.dev — Home" className={`inline-block text-2xl font-black tracking-tight text-white ${focus}`}>CHAMIKA<span className="text-blue-500">.</span>DEV</a>
                    <p className="text-sm text-gray-400 leading-relaxed max-w-sm">Full-stack web developer building responsive interfaces and reliable applications.</p>
                    <LocalTime />
                    <div className="flex items-center gap-3">{[
                        { href: 'https://github.com/ChamikaShashipriya99', name: 'GitHub', icon: Github },
                        { href: 'https://www.linkedin.com/in/chamika-shashipriya-722366321', name: 'LinkedIn', icon: Linkedin },
                        { href: 'https://wa.me/94750471511', name: 'WhatsApp', icon: FaWhatsapp },
                    ].map(social => <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={`${social.name} (opens in a new tab)`} className={`p-3 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:border-blue-400/40 transition-colors ${focus}`}><social.icon size={18} aria-hidden="true" /></a>)}</div>
                    <div className="flex flex-wrap gap-4">
                        <a href="/resume.pdf" download="Chamika_Shashipriya_CV.pdf" className={`inline-flex items-center gap-1.5 text-xs text-blue-300 hover:text-white ${focus}`}><Download size={14} aria-hidden="true" />Download CV</a>
                        <a href="/contact/chamika-shashipriya.vcf" download="Chamika-Shashipriya.vcf" className={`inline-flex items-center gap-1.5 text-xs text-blue-300 hover:text-white ${focus}`}><UserRoundPlus size={14} aria-hidden="true" />Save contact (.vcf)</a>
                    </div>
                </div>
                <nav aria-label="Footer navigation" className="min-w-0">
                    <h2 className="text-xs font-semibold text-white uppercase tracking-widest mb-5">Explore</h2>
                    <ul className="grid grid-cols-2 gap-x-5 gap-y-3">{links.map(link => <li key={link.href}><a href={link.href} onClick={event => navigate(event, link.href)} className={linkClass}>{link.name}</a></li>)}</ul>
                </nav>
                <div className="min-w-0 md:col-span-2 xl:col-span-1">
                    <h2 className="text-xs font-semibold text-white uppercase tracking-widest mb-5">Get in touch</h2>
                    <dl className="space-y-4">
                        <div><dt className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Email</dt><dd className="mt-1.5"><a href={`mailto:${email}`} className={`${linkClass} break-all`}>{email}</a><div className="flex flex-wrap gap-4 mt-2"><button type="button" onClick={copyEmail} className={`inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white ${focus}`}>{copyStatus === 'Email address copied.' ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}Copy email</button><a href={`mailto:${email}`} className={`inline-flex items-center gap-1 text-xs text-blue-300 hover:text-white ${focus}`}>Open email app <ArrowUpRight size={13} aria-hidden="true" /></a></div><p role="status" aria-live="polite" className="text-xs text-gray-400 mt-2">{copyStatus}</p></dd></div>
                        <div className="flex flex-wrap gap-x-8 gap-y-4"><div><dt className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Calls</dt><dd className="mt-1.5"><a href="tel:+94704120358" className={linkClass}>+94 70 412 0358</a></dd></div><div><dt className="text-[10px] font-mono uppercase tracking-widest text-gray-500">WhatsApp · separate number</dt><dd className="mt-1.5"><a href="https://wa.me/94750471511" target="_blank" rel="noopener noreferrer" className={linkClass}>+94 75 047 1511<span className="sr-only"> (opens in a new tab)</span></a></dd></div></div>
                        <div><dt className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Location</dt><dd className="text-sm text-gray-300 leading-relaxed mt-1.5">Ambalangoda &amp; Malabe, Sri Lanka</dd></div>
                    </dl>
                </div>
            </div>
            <div className="mt-9 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                <p className="text-xs text-gray-400">© {new Date().getFullYear()} Chamika Shashipriya. All rights reserved.</p>
                <a href="#home" onClick={event => navigate(event, '#home')} className={`inline-flex items-center gap-2 text-xs text-gray-300 hover:text-white ${focus}`}>Back to top <ArrowUp size={14} aria-hidden="true" /></a>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
                <span className="text-[10px] uppercase tracking-widest text-gray-500">Built with</span>
                <ul aria-label="Website technologies" className="flex flex-wrap items-center gap-3">{technologies.map(technology => <li key={technology.label} className="text-gray-400" title={technology.label}><technology.icon size={16} aria-hidden="true" /><span className="sr-only">{technology.label}</span></li>)}</ul>
            </div>
        </div>
    </footer>;
}
