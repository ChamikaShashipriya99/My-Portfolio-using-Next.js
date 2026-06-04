'use client';

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Loader from '@/components/ui/Loader';
import Navbar from '@/components/ui/Navbar';
import Hero from '@/components/ui/Hero';
import About from '@/components/ui/About';
import dynamic from 'next/dynamic';
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
import ContributionSkyline from '@/components/ui/ContributionSkyline';

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
                    <Background />
                    <ScrollToTop />
                    <Navbar />

                    <div className="relative z-10">
                        <Hero />
                        <About />
                        <SkillsMarquee />
                        <Projects />
                        <ContributionSkyline />
                        <Experience />
                        <Contact />
                        <BusinessCard />
                        <Footer />
                        <FloatingWhatsApp />
                        <AIChatbot />
                    </div>
                </motion.div>
            )}
        </main>
    );
}
