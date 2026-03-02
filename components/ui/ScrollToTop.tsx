'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import { useLenis } from 'lenis/react';

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);
    const lenis = useLenis();

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 400) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        lenis?.scrollTo('#home', {
            duration: 1.5,
            offset: 0,
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-50 p-4 rounded-full glassmorphism text-white border border-white/10 shadow-2xl hover:bg-white/10 hover:scale-110 transition-all active:scale-95 group"
                    aria-label="Scroll to top"
                >
                    <ChevronUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />

                    {/* Pulsing Ring Effect */}
                    <div className="absolute inset-0 rounded-full border border-blue-500/50 animate-ping opacity-20 pointer-events-none" />
                </motion.button>
            )}
        </AnimatePresence>
    );
}
