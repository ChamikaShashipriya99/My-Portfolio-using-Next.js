'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiRefresh } from 'react-icons/hi';
import Background from '@/components/ui/Background';
import Navbar from '@/components/ui/Navbar';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <Background />
            <Navbar />
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 mt-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glassmorphism p-8 sm:p-10 md:p-16 rounded-3xl border border-red-500/20 shadow-2xl relative max-w-2xl w-full"
                >
                    <div className="absolute -inset-1 bg-red-600 rounded-3xl blur opacity-10 -z-10 animate-pulse"></div>
                    
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                        <span className="text-red-500 text-3xl md:text-4xl font-black">!</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 break-words">
                        Critical <span className="text-red-500">Failure</span>
                    </h2>
                    
                    <div className="h-1.5 w-16 md:w-24 bg-red-600 rounded-full mx-auto mb-6" />
                    
                    <p className="text-gray-400 text-xs sm:text-sm md:text-base mb-10 px-2 leading-relaxed">
                        A critical system anomaly has occurred. The mainframe encountered an unexpected error while executing the request.
                    </p>
                    
                    <button
                        onClick={() => reset()}
                        className="group relative px-6 py-3 sm:px-8 sm:py-4 bg-red-600 text-white rounded-full font-bold uppercase tracking-widest text-xs sm:text-sm flex items-center justify-center gap-3 mx-auto overflow-hidden hover:bg-red-700 transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                    >
                        <HiRefresh className="group-hover:rotate-180 transition-transform duration-500 text-lg" />
                        Reboot System
                    </button>
                </motion.div>
            </div>
        </main>
    );
}
