'use client';

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Loader from '@/components/ui/Loader';
import Navbar from '@/components/ui/Navbar';
import Hero from '@/components/ui/Hero';
import About from '@/components/ui/About';
import dynamic from 'next/dynamic';
import DevConsole from '@/components/ui/DevConsole';
import MainframeArcade from '@/components/ui/MainframeArcade';
import Projects from '@/components/ui/Projects';
import Experience from '@/components/ui/Experience';
import Contact from '@/components/ui/Contact';
import Footer from '@/components/ui/Footer';
import BusinessCard from '@/components/ui/BusinessCard';
import SkillsMarquee from '@/components/ui/SkillsMarquee';
import Background from '@/components/ui/Background';
import ScrollToTop from '@/components/ui/ScrollToTop';
import FloatingWhatsApp from '@/components/ui/FloatingWhatsApp';
import AIChatbot from '@/components/ui/AIChatbot';

const ContributionSkyline = dynamic(() => import('@/components/ui/ContributionSkyline'), {
    ssr: false,
    loading: () => (
        <div className="py-24 flex items-center justify-center flex-col gap-4 font-mono text-xs text-blue-500/50 uppercase tracking-[0.2em] animate-pulse">
            Loading Contribution Orbit...
        </div>
    )
});

export default function Home() {
    const [loading, setLoading] = useState(true);

    return (
        <main className="relative min-h-screen">
            <AnimatePresence>
                {loading && <Loader onComplete={() => setLoading(false)} />}
            </AnimatePresence>

            {!loading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <a href="#main-content" className="fixed left-4 top-4 z-[200] -translate-y-24 focus:translate-y-0 rounded-lg bg-blue-600 px-4 py-3 text-white focus:outline focus:outline-white" onClick={event => { event.preventDefault(); const target = document.getElementById('main-content'); target?.focus({ preventScroll: true }); target?.scrollIntoView({ behavior: 'instant', block: 'start' }); }}>Skip to content</a>
                    <Background />
                    <ScrollToTop />
                    <Navbar />

                    <div id="main-content" tabIndex={-1} className="relative z-10 outline-none">
                        <Hero />
                        <About />
                        <SkillsMarquee />
                        <Projects />
                        <ContributionSkyline />
                        <Experience />
                        <Contact />
                        <MainframeArcade />
                        <BusinessCard />
                        <Footer />
                        <FloatingWhatsApp />
                        <AIChatbot />
                        <DevConsole />
                    </div>
                </motion.div>
            )}
        </main>
    );
}
