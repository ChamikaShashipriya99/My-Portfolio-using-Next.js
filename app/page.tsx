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
import SkillsMarquee from '@/components/ui/SkillsMarquee';
import { Canvas } from '@react-three/fiber';

// Dynamic imports for 3D components to avoid SSR issues
const SceneCanvas = dynamic(() => import('@/components/3d/Canvas'), { ssr: false });

export default function Home() {
    const [loading, setLoading] = useState(true);

    return (
        <main className="relative bg-black min-h-screen">
            <AnimatePresence>
                {loading && <Loader onComplete={() => setLoading(false)} />}
            </AnimatePresence>

            {!loading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <Navbar />

                    {/* 3D Background */}
                    <Suspense fallback={null}>
                        <SceneCanvas />
                    </Suspense>

                    <div className="relative z-10">
                        <Hero />
                        <About />
                        <SkillsMarquee />
                        <Projects />
                        <Experience />
                        <Contact />
                        <Footer />
                    </div>
                </motion.div>
            )}
        </main>
    );
}
