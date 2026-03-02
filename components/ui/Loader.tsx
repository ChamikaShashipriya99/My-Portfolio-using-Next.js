'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Loader({ onComplete }: { onComplete: () => void }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(onComplete, 500);
                    return 100;
                }
                return prev + Math.random() * 10;
            });
        }, 150);

        return () => clearInterval(timer);
    }, [onComplete]);

    return (
        <motion.div
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6"
        >
            <div className="w-full max-w-md space-y-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                >
                    <h2 className="text-white text-3xl font-bold tracking-tighter">
                        INITIALIZING <span className="text-blue-500">SYSTEM</span>
                    </h2>
                    <p className="text-gray-500 text-sm font-mono uppercase tracking-widest">
                        Loading Chamika Shashipriya Portfolio
                    </p>
                </motion.div>

                <div className="relative h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        className="absolute top-0 left-0 h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                    />
                </div>

                <div className="flex justify-between text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                    <span>{Math.round(progress)}% Complete</span>
                    <span>Buffer: 0x4f2a9</span>
                </div>
            </div>
        </motion.div>
    );
}
