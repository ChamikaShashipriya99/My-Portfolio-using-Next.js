'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Loader from './Loader';
import Navbar from './Navbar';
const Enhancements = dynamic(() => import('./SiteEnhancements'), { ssr: false });
export default function HomeShell({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);
    const [intro, setIntro] = useState(true);
    useEffect(() => setMounted(true), []);
    const finish = useCallback(() => {
        setIntro(false);
        requestAnimationFrame(() => {
            const target = document.getElementById(window.location.hash.slice(1)) || document.getElementById('home');
            target?.setAttribute('tabindex', '-1'); target?.focus({ preventScroll: true });
        });
    }, []);
    return <>
        <AnimatePresence>{mounted && intro && <Loader onComplete={finish} />}</AnimatePresence>
        <div inert={mounted && intro}>
            <a href="#main-content" className="fixed left-4 top-4 z-[200] -translate-y-24 focus:translate-y-0 rounded-lg bg-blue-600 px-4 py-3 text-white focus:outline focus:outline-white" onClick={event => { event.preventDefault(); const target = document.getElementById('main-content'); target?.focus({ preventScroll: true }); target?.scrollIntoView({ behavior: 'instant', block: 'start' }); }}>Skip to content</a>
            <Navbar />
            <div id="main-content" tabIndex={-1} className="relative z-10 outline-none">{children}</div>
        </div>
        {mounted && !intro && <Enhancements />}
    </>;
}
