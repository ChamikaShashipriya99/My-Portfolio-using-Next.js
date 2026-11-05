'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function Loader({ onComplete }: { onComplete: () => void }) {
    const reducedMotion = useReducedMotion();
    const complete = useRef(onComplete);
    complete.current = onComplete;
    const finished = useRef(false);
    const skip = useRef<HTMLButtonElement>(null);
    const finish = () => {
        if (finished.current) return;
        finished.current = true;
        complete.current();
    };
    useEffect(() => {
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const timer = window.setTimeout(() => {
            if (!finished.current) { finished.current = true; complete.current(); }
        }, reducedMotion ? 150 : 1700);
        const keyboard = (event: KeyboardEvent) => {
            if (event.key === 'Escape') { event.preventDefault(); if (!finished.current) { finished.current = true; complete.current(); } }
            if (event.key === 'Tab') { event.preventDefault(); skip.current?.focus(); }
        };
        document.addEventListener('keydown', keyboard);
        return () => { window.clearTimeout(timer); document.body.style.overflow = previous; document.removeEventListener('keydown', keyboard); };
    }, [reducedMotion]);
    return <motion.div role="dialog" aria-modal="true" aria-label="Portfolio introduction" className="fixed inset-0 z-[100] overflow-hidden" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0.15 : 0.65 }}>
        <motion.div className="absolute inset-0 bg-[#03060d]" exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0.15 : 0.35 }} />
        {!reducedMotion && <>
            <motion.svg aria-hidden="true" viewBox="0 0 1440 900" preserveAspectRatio="none" className="absolute inset-0 h-full w-full pointer-events-none" initial={{ x: '-8%', opacity: 0 }} animate={{ x: '0%', opacity: 1 }} exit={{ x: '110%', opacity: 0 }} transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}>
                <defs><linearGradient id="intro-ribbon" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#0a1b3b" /><stop offset="35%" stopColor="#2563eb" stopOpacity="0.5" /><stop offset="55%" stopColor="#7dd3fc" stopOpacity="0.3" /><stop offset="75%" stopColor="#312e81" stopOpacity="0.7" /><stop offset="100%" stopColor="#06101f" /></linearGradient></defs>
                <path d="M -120 400 C 260 70 460 790 850 430 C 1100 180 1330 170 1560 390 L 1560 570 C 1220 300 1130 460 900 570 C 470 950 220 330 -120 620 Z" fill="url(#intro-ribbon)" opacity="0.65" />
                <path d="M -120 400 C 260 70 460 790 850 430 C 1100 180 1330 170 1560 390" fill="none" stroke="#93c5fd" strokeWidth="1" opacity="0.2" />
            </motion.svg>
            <motion.svg aria-hidden="true" viewBox="0 0 1440 900" preserveAspectRatio="none" className="absolute inset-0 h-full w-full pointer-events-none" initial={{ x: '8%', opacity: 0 }} animate={{ x: '0%', opacity: 0.4 }} exit={{ x: '-110%', opacity: 0 }} transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}>
                <path d="M -120 540 C 280 900 520 150 860 480 C 1150 790 1320 650 1560 440 L 1560 550 C 1200 950 1100 800 810 600 C 520 330 220 1070 -120 650 Z" fill="url(#intro-ribbon)" />
            </motion.svg>
        </>}
        <motion.div className="relative h-full flex flex-col justify-center items-center text-center px-6" exit={{ opacity: 0, y: reducedMotion ? 0 : -12 }} transition={{ duration: 0.2 }}>
            <p className="text-[10px] sm:text-xs text-blue-300 font-mono uppercase tracking-[0.3em] mb-5">Welcome to my portfolio</p>
            <div className="text-white">
                <span className="sr-only">Chamika Shashipriya</span>
                <div aria-hidden="true" className="font-black tracking-tighter text-[clamp(2.8rem,10vw,8rem)] leading-none overflow-hidden">{'CHAMIKA'.split('').map((letter, index) => <motion.span key={index} className="inline-block" initial={reducedMotion ? false : { y: '110%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: reducedMotion ? 0 : 0.45, delay: reducedMotion ? 0 : index * 0.035, ease: [0.22, 1, 0.36, 1] }}>{letter}</motion.span>)}</div>
                <motion.p aria-hidden="true" className="mt-3 text-[clamp(1rem,3.8vw,2.5rem)] font-semibold tracking-[0.12em] text-blue-200" initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: reducedMotion ? 0 : 0.35 }}>SHASHIPRIYA</motion.p>
            </div>
            <p className="mt-6 text-xs sm:text-sm text-gray-400">Full-Stack Web Developer</p>
        </motion.div>
        <button ref={skip} type="button" onClick={finish} className="absolute right-5 top-5 sm:right-8 sm:top-8 z-30 flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-2.5 text-xs text-gray-200 hover:text-white hover:border-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-300 focus-visible:outline-offset-4">Skip intro <ArrowRight size={13} aria-hidden="true" /></button>
    </motion.div>;
}
