'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Background from '@/components/ui/Background';
import Navbar from '@/components/ui/Navbar';

export default function Loading() {
    return (
        <main className="relative min-h-screen bg-black flex flex-col items-center justify-center p-6 overflow-hidden">
            <Background />
            <Navbar />
            <div className="relative z-10 w-full max-w-md space-y-8 text-center glassmorphism p-8 sm:p-12 rounded-3xl border border-white/10 shadow-2xl mt-12">
                <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-white/10 border-t-blue-500 rounded-full animate-spin mx-auto mb-4 sm:mb-6 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                
                <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="space-y-2"
                >
                    <h2 className="text-white text-xl sm:text-2xl md:text-3xl font-bold tracking-tighter">
                        SYNCING <span className="text-blue-500">CORE</span>
                    </h2>
                    <p className="text-gray-500 text-[10px] sm:text-xs md:text-sm font-mono uppercase tracking-widest px-2 break-words">
                        Establishing Neural Connection
                    </p>
                </motion.div>
            </div>
        </main>
    );
}
