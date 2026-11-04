'use client';

import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// Ribbon outlines share four cubic curves for continuous section morphing.
const outlines = [
    'M 20 170 C 140 20 220 340 330 170 C 410 60 460 85 490 150 C 380 80 350 420 220 300 C 110 180 60 340 20 170 Z',
    'M 10 230 C 140 50 210 120 320 250 C 410 360 450 80 495 120 C 460 240 430 440 300 340 C 180 220 90 150 10 230 Z',
    'M 20 100 C 160 230 175 410 310 230 C 395 110 450 100 490 220 C 400 160 390 400 250 330 C 120 270 90 90 20 100 Z',
    'M 5 280 C 120 400 230 40 340 150 C 435 250 465 325 495 230 C 480 420 365 340 290 230 C 190 110 90 450 5 280 Z',
    'M 15 150 C 130 10 230 400 330 240 C 400 130 440 65 490 170 C 380 100 380 440 240 330 C 120 230 85 160 15 150 Z',
    'M 10 300 C 120 160 210 20 330 190 C 425 340 465 250 495 180 C 470 430 360 350 280 250 C 170 120 100 360 10 300 Z',
];
const sections = [
    { id: 'home', x: '50%', y: '40%', rotate: 0, shape: 0 },
    { id: 'about', x: '50%', y: '52%', rotate: 0, shape: 1 },
    { id: 'skills', x: '50%', y: '50%', rotate: 0, shape: 2 },
    { id: 'projects', x: '50%', y: '38%', rotate: 0, shape: 3 },
    { id: 'skyline', x: '50%', y: '55%', rotate: 0, shape: 4 },
    { id: 'experience', x: '50%', y: '60%', rotate: 0, shape: 5 },
    { id: 'contact', x: '50%', y: '45%', rotate: 0, shape: 1 },
    { id: 'arcade', x: '50%', y: '40%', rotate: 0, shape: 3 },
    { id: 'business-card', x: '50%', y: '50%', rotate: 0, shape: 2 },
];

export default function Background() {
    const [active, setActive] = useState(0);
    const reducedMotion = useReducedMotion();
    useEffect(() => {
        if (reducedMotion) return;
        let frame = 0;
        const update = () => {
            const marker = window.innerHeight * 0.45;
            let next = 0;
            sections.forEach((section, index) => {
                const element = document.getElementById(section.id);
                if (element && element.getBoundingClientRect().top <= marker) next = index;
            });
            setActive(previous => previous === next ? previous : next);
        };
        const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
        const main = document.querySelector('main');
        const observer = new ResizeObserver(schedule);
        const mutations = new MutationObserver(schedule);
        if (main) { observer.observe(main); mutations.observe(main, { childList: true, subtree: true }); }
        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', schedule);
        schedule();
        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect(); mutations.disconnect();
            window.removeEventListener('scroll', schedule);
            window.removeEventListener('resize', schedule);
        };
    }, [reducedMotion]);
    const current = sections[reducedMotion ? 0 : active];
    const transition = { duration: reducedMotion ? 0 : 1.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };

    return <div aria-hidden="true" className="fixed inset-0 z-0 overflow-hidden bg-black pointer-events-none select-none">
        {[0, 1].map(ribbonIndex => (
        <motion.div key={ribbonIndex} initial={false} animate={{ left: current.x, top: current.y, rotate: ribbonIndex === 0 ? current.rotate : -18 }} transition={transition}
            className="absolute w-[125vw] h-[clamp(300px,65vh,760px)] -translate-x-1/2 -translate-y-1/2">
            <motion.div
                animate={reducedMotion ? { y: 0, rotate: 0, scaleY: 1 } : { y: ribbonIndex === 0 ? [0, -12, 0, 12, 0] : [0, 12, 0, -12, 0], rotate: [0, 1.2, 0, -1.2, 0], scaleY: [1, 1.06, 1, 0.95, 1] }}
                transition={reducedMotion ? { duration: 0 } : { duration: ribbonIndex === 0 ? 10 : 12, repeat: Infinity, ease: 'easeInOut' }}
                className="w-full h-full origin-center"
            >
            <svg viewBox="0 0 500 500" className="w-full h-full overflow-visible" preserveAspectRatio="none" focusable="false">
                <defs>
                    <linearGradient id={`section-liquid-fill-${ribbonIndex}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#071735" /><stop offset="18%" stopColor="#174da0" />
                        <stop offset="32%" stopColor="#75baf7" /><stop offset="39%" stopColor="#1749a0" />
                        <stop offset="51%" stopColor="#070c25" /><stop offset="64%" stopColor="#343c98" />
                        <stop offset="76%" stopColor="#438fca" /><stop offset="83%" stopColor="#123852" /><stop offset="100%" stopColor="#030a19" />
                    </linearGradient>
                    <linearGradient id={`ribbon-edge-${ribbonIndex}`} x1="0%" y1="0%" x2="100%" y2="70%">
                        <stop offset="0%" stopColor="#60a5fa" stopOpacity="0" /><stop offset="28%" stopColor="#b4e3ff" stopOpacity="0.85" />
                        <stop offset="52%" stopColor="#3b82f6" stopOpacity="0.1" /><stop offset="78%" stopColor="#67e8f9" stopOpacity="0.6" /><stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
                    </linearGradient>
                    <radialGradient id={`ribbon-sheen-${ribbonIndex}`} cx="38%" cy="35%" r="55%">
                        <stop offset="0%" stopColor="#d0ecff" stopOpacity="0.5" /><stop offset="28%" stopColor="#60a5fa" stopOpacity="0.13" /><stop offset="100%" stopColor="#000" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id={`ribbon-fold-${ribbonIndex}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#01040d" stopOpacity="0.8" /><stop offset="43%" stopColor="#050816" stopOpacity="0" />
                        <stop offset="68%" stopColor="#c7e4ff" stopOpacity="0.2" /><stop offset="77%" stopColor="#00030d" stopOpacity="0.7" /><stop offset="100%" stopColor="#000" stopOpacity="0" />
                    </linearGradient>
                    <filter id={`section-liquid-glow-${ribbonIndex}`} x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="18" /></filter>
                    <filter id={`ribbon-shadow-${ribbonIndex}`} x="-30%" y="-40%" width="160%" height="180%"><feDropShadow dx="0" dy="12" stdDeviation="9" floodColor="#00030e" floodOpacity="0.65" /></filter>
                    <clipPath id={`ribbon-surface-${ribbonIndex}`}><motion.path initial={false} animate={{ d: outlines[(current.shape + ribbonIndex * 2) % outlines.length] }} transition={transition} /></clipPath>
                </defs>
                <motion.path initial={false} animate={{ d: outlines[(current.shape + ribbonIndex * 2) % outlines.length] }} transition={transition} fill="#2563eb" filter={`url(#section-liquid-glow-${ribbonIndex})`} opacity="0.16" />
                <g opacity={ribbonIndex === 0 ? 0.46 : 0.32} filter={`url(#ribbon-shadow-${ribbonIndex})`}>
                    <motion.path initial={false} animate={{ d: outlines[(current.shape + ribbonIndex * 2) % outlines.length] }} transition={transition} fill={`url(#section-liquid-fill-${ribbonIndex})`} />
                    <g clipPath={`url(#ribbon-surface-${ribbonIndex})`}>
                        <rect width="500" height="500" fill={`url(#ribbon-sheen-${ribbonIndex})`} />
                        <rect width="500" height="500" fill={`url(#ribbon-fold-${ribbonIndex})`} />
                        <path d="M -20 235 C 100 75 200 415 325 240 C 405 135 455 125 520 200" fill="none" stroke={`url(#ribbon-edge-${ribbonIndex})`} strokeWidth="1.2" opacity="0.3" />
                        <path d="M -20 240 C 100 85 200 425 325 250 C 405 145 455 135 520 210" fill="none" stroke="#020615" strokeWidth="6" opacity="0.15" />
                    </g>
                    <motion.path initial={false} animate={{ d: outlines[(current.shape + ribbonIndex * 2) % outlines.length] }} transition={transition} fill="none" stroke={`url(#ribbon-edge-${ribbonIndex})`} strokeWidth="0.8" />
                </g>
            </svg>
            </motion.div>
        </motion.div>
        ))}
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.08]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_40%,#000_70%,transparent_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.65)_100%)]" />
    </div>;
}
