'use client';

import React, { useState, useEffect } from 'react';
import { FaGithub, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import { HiCheck, HiDuplicate } from 'react-icons/hi';
import {
    SiNextdotjs,
    SiReact,
    SiTypescript,
    SiTailwindcss,
    SiThreedotjs,
    SiFramer,
    SiVercel,
} from 'react-icons/si';
import { AnimatePresence, motion } from 'framer-motion';

const EMAIL = 'chamikashashipriya3@gmail.com';

const builtWith = [
    { icon: SiNextdotjs,   label: 'Next.js',       color: '#ffffff' },
    { icon: SiReact,       label: 'React',          color: '#61DAFB' },
    { icon: SiTypescript,  label: 'TypeScript',     color: '#3178C6' },
    { icon: SiTailwindcss, label: 'Tailwind CSS',   color: '#06B6D4' },
    { icon: SiThreedotjs,  label: 'Three.js',       color: '#ffffff' },
    { icon: SiFramer,      label: 'Framer Motion',  color: '#BB4B96' },
    { icon: SiVercel,      label: 'Vercel',         color: '#ffffff' },
];

// ── Stagger variants ───────────────────────────────────────────
const gridVariants = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.13, delayChildren: 0.05 },
    },
};

const colVariants = {
    hidden: { opacity: 0, y: 36 },
    show:   {
        opacity: 1,
        y: 0,
        transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] as const },
    },
};

// ── Live IST Clock ─────────────────────────────────────────────
function ISTClock() {
    const [time, setTime] = useState('');
    const [isWorkHours, setIsWorkHours] = useState(false);

    useEffect(() => {
        const update = () => {
            const now  = new Date();
            const ist  = now.toLocaleTimeString('en-US', {
                timeZone: 'Asia/Colombo',
                hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
            });
            const hour = Number(
                now.toLocaleString('en-US', { timeZone: 'Asia/Colombo', hour: 'numeric', hour12: false })
            );
            setTime(ist);
            setIsWorkHours(hour >= 8 && hour < 23);
        };
        update();
        const id = setInterval(update, 1000);
        return () => clearInterval(id);
    }, []);

    if (!time) return null;

    return (
        <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-gray-600 uppercase">
            <span
                className={`w-1.5 h-1.5 rounded-full ${isWorkHours ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`}
                title={isWorkHours ? 'Likely online' : 'Likely offline'}
            />
            <span>IST · UTC+5:30</span>
            <span className="text-gray-500 tabular-nums">{time}</span>
        </div>
    );
}

// ── Email Copy Button ──────────────────────────────────────────
function CopyEmailButton() {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(EMAIL);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            window.location.href = `mailto:${EMAIL}`;
        }
    };

    return (
        <div className="space-y-2">
            <button
                onClick={handleCopy}
                className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium text-sm 3xl:text-xl break-all text-left"
                title="Click to copy email"
            >
                <span>{EMAIL}</span>
                <span className="shrink-0 opacity-0 group-hover:opacity-60 transition-opacity">
                    {copied ? <HiCheck className="text-green-400" /> : <HiDuplicate />}
                </span>
            </button>

            <AnimatePresence>
                {copied && (
                    <motion.span
                        initial={{ opacity: 0, y: -4, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0,  scale: 1   }}
                        exit={{    opacity: 0, y:  4, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/15 border border-green-500/30 text-green-400 text-[9px] font-bold uppercase tracking-widest"
                    >
                        <HiCheck className="text-sm" /> Copied!
                    </motion.span>
                )}
            </AnimatePresence>

            <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-gray-600">
                <span>⚡</span>
                <span>Replies within 24h</span>
            </div>
        </div>
    );
}

// ── Footer ─────────────────────────────────────────────────────
export default function Footer() {
    return (
        <footer className="py-24 5xl:py-48 relative overflow-hidden">

            {/* ── Background: multi-orb glows ── */}
            {/* Blue orb — bottom-right (original) */}
            <div className="absolute -bottom-24 -right-24 w-[28rem] h-[28rem] bg-blue-600/6 rounded-full blur-[130px] pointer-events-none" />
            {/* Violet orb — top-left (new) */}
            <div className="absolute -top-24 -left-24 w-[24rem] h-[24rem] bg-violet-600/6 rounded-full blur-[130px] pointer-events-none" />
            {/* Cyan accent — bottom-left, subtle */}
            <div className="absolute bottom-0 left-1/3 w-[20rem] h-[20rem] bg-cyan-600/4 rounded-full blur-[100px] pointer-events-none" />

            {/* ── Background: CSS dot grid ── */}
            <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(rgba(255,255,255,0.045) 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                    maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
                }}
            />

            {/* ── Animated top border ── */}
            <div className="gradient-divider absolute top-0 left-0 right-0 z-10" />
            <div className="absolute top-0 left-0 right-0 h-[6px] bg-gradient-to-r from-transparent via-blue-500/10 to-transparent blur-md pointer-events-none z-10" />

            <div className="container mx-auto px-6 relative z-10">

                {/* ── Staggered grid columns ── */}
                <motion.div
                    variants={gridVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-80px' }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-12 xl:gap-24 3xl:gap-32 mb-24"
                >
                    {/* Brand & Bio */}
                    <motion.div variants={colVariants} className="col-span-1 md:col-span-2 space-y-8">
                        <div
                            data-text="CHAMIKA.DEV"
                            className="brand-glitch text-white font-black text-2xl md:text-3xl 3xl:text-5xl 5k:text-7xl tracking-tighter uppercase select-none"
                        >
                            CHAMIKA<span className="text-blue-500">.</span>DEV
                        </div>

                        <p className="text-gray-500 max-w-sm 3xl:max-w-xl leading-relaxed text-sm md:text-base 3xl:text-2xl opacity-70">
                            Designing and building immersive digital experiences that merge futuristic aesthetics with high-performance code.
                            Always pushing the boundaries of what&apos;s possible on the web.
                        </p>

                        <ISTClock />

                        <div className="flex items-center gap-6 md:gap-8 pt-2 flex-wrap">
                            <a href="https://github.com/ChamikaShashipriya99" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-all transform hover:scale-125 text-3xl 3xl:text-4xl p-2 -ml-2 md:p-0 md:ml-0 md:text-2xl">
                                <FaGithub />
                            </a>
                            <a href="https://www.linkedin.com/in/chamika-shashipriya-722366321" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-all transform hover:scale-125 text-3xl 3xl:text-4xl p-2 md:p-0 md:text-2xl">
                                <FaLinkedin />
                            </a>
                            <a href="https://wa.me/94750471511" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-all transform hover:scale-125 text-3xl 3xl:text-4xl p-2 md:p-0 md:text-2xl">
                                <FaWhatsapp />
                            </a>
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div variants={colVariants} className="space-y-8">
                        <h4 className="text-white font-black uppercase tracking-[0.3em] text-xs 3xl:text-lg opacity-50">Navigation</h4>
                        <ul className="space-y-4">
                            {['Home', 'About', 'Skills', 'Projects', 'Experience', 'Contact'].map((item) => (
                                <li key={item}>
                                    <a href={`#${item.toLowerCase()}`} className="text-gray-500 hover:text-blue-400 transition-colors text-sm 3xl:text-xl font-medium">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Contact Details */}
                    <motion.div variants={colVariants} className="space-y-8">
                        <h4 className="text-white font-black uppercase tracking-[0.3em] text-xs 3xl:text-lg opacity-50">Contact</h4>
                        <ul className="space-y-6">
                            <li className="text-sm 3xl:text-xl">
                                <span className="text-gray-600 block mb-2 uppercase text-[10px] 3xl:text-xs tracking-[0.4em] font-bold">Email</span>
                                <CopyEmailButton />
                            </li>
                            <li className="text-sm 3xl:text-xl">
                                <span className="text-gray-600 block mb-2 uppercase text-[10px] 3xl:text-xs tracking-[0.4em] font-bold">Phone</span>
                                <a href="tel:0704120358" className="text-gray-400 hover:text-white transition-colors font-medium">0704120358</a>
                            </li>
                            <li className="text-sm 3xl:text-xl">
                                <span className="text-gray-600 block mb-2 uppercase text-[10px] 3xl:text-xs tracking-[0.4em] font-bold">Location</span>
                                <span className="text-gray-400 font-medium">Ambalangoda &amp; Malabe, Sri Lanka</span>
                            </li>
                        </ul>
                    </motion.div>
                </motion.div>

                {/* Animated bottom-bar divider */}
                <div className="mt-12 mb-12">
                    <div className="gradient-divider" />
                    <div className="h-[6px] bg-gradient-to-r from-transparent via-violet-500/10 to-transparent blur-md mt-[-1px]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col md:flex-row items-center justify-between gap-6"
                >
                    <div className="text-gray-600 text-[10px] md:text-xs 3xl:text-lg font-mono tracking-[0.3em] uppercase">
                        &copy; {new Date().getFullYear()} Chamika.portfolio &bull; all rights reserved
                    </div>

                    {/* Built With */}
                    <div className="flex items-center gap-3 flex-wrap justify-center md:justify-end">
                        <span className="text-gray-700 text-[9px] uppercase tracking-[0.35em] font-mono font-bold">
                            Built with
                        </span>
                        <div className="flex items-center gap-3">
                            {builtWith.map(({ icon: Icon, label, color }) => (
                                <span
                                    key={label}
                                    title={label}
                                    className="opacity-30 hover:opacity-100 hover:scale-125 transition-all duration-200 cursor-default block"
                                    style={{ color }}
                                >
                                    <Icon className="text-base 3xl:text-xl" />
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
}
