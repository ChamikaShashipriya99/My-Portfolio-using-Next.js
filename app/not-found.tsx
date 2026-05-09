'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HiArrowLeft } from 'react-icons/hi';
import Link from 'next/link';

export default function NotFound() {
    return (
        <main className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black z-0" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="z-10 text-center space-y-8 p-6"
            >
                <motion.h1 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="text-8xl md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 uppercase tracking-tighter drop-shadow-2xl"
                >
                    404
                </motion.h1>
                
                <div className="space-y-4">
                    <h2 className="text-2xl md:text-4xl font-bold text-white uppercase tracking-widest">
                        Signal Lost
                    </h2>
                    <p className="text-gray-400 font-mono text-sm md:text-base max-w-md mx-auto">
                        The transmission you are looking for has drifted into deep space or never existed.
                    </p>
                </div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block mt-8">
                    <Link 
                        href="/"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
                    >
                        <HiArrowLeft /> Return to Mainframe
                    </Link>
                </motion.div>
            </motion.div>

            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />
        </main>
    );
}
