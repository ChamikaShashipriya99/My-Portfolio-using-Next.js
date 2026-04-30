'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { HiArrowLeft } from 'react-icons/hi';
import Background from '@/components/ui/Background';
import Navbar from '@/components/ui/Navbar';

export default function NotFound() {
    return (
        <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <Background />
            <Navbar />
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 mt-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="glassmorphism p-8 sm:p-12 md:p-24 rounded-3xl border border-white/10 shadow-2xl relative w-full max-w-3xl"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-20 -z-10 animate-pulse"></div>
                    
                    <h1 className="text-[6rem] sm:text-8xl md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-purple-600 leading-none tracking-tighter mb-4 shadow-blue-500/50">
                        404
                    </h1>
                    
                    <div className="h-1.5 w-24 bg-blue-600 rounded-full mx-auto mb-8" />
                    
                    <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-white uppercase tracking-widest mb-4 break-words">
                        System <span className="text-blue-500">Not Found</span>
                    </h2>
                    
                    <p className="text-gray-400 text-xs sm:text-sm md:text-lg max-w-md mx-auto mb-10 leading-relaxed px-4">
                        The neural pathway you are trying to access has been severed or does not exist in the current sector.
                    </p>
                    
                    <Link href="/">
                        <button className="group relative px-6 py-3 sm:px-8 sm:py-4 bg-blue-600 text-white rounded-full font-bold uppercase tracking-widest text-xs sm:text-sm flex items-center justify-center gap-3 mx-auto overflow-hidden hover:bg-blue-700 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                            <HiArrowLeft className="group-hover:-translate-x-1 transition-transform text-lg" />
                            Return to Base
                        </button>
                    </Link>
                </motion.div>
            </div>
        </main>
    );
}
