'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiExclamationCircle, HiRefresh } from 'react-icons/hi';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application Error:', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />
        
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="z-10 text-center space-y-8 p-8 max-w-lg bg-white/5 border border-red-500/20 rounded-3xl backdrop-blur-md shadow-2xl relative"
        >
            <div className="w-20 h-20 mx-auto bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                <HiExclamationCircle className="text-5xl text-red-500" />
            </div>
            
            <div className="space-y-4">
                <h2 className="text-2xl font-black text-white uppercase tracking-widest">
                    System Failure
                </h2>
                <p className="text-gray-400 font-mono text-xs leading-relaxed">
                    A critical error occurred in the mainframe. Our automated systems have logged the incident.
                </p>
                <div className="p-4 bg-black/50 rounded-xl border border-red-500/10 font-mono text-xs text-red-400 break-all text-left overflow-hidden">
                    {error.message || "Unknown internal error"}
                </div>
            </div>

            <button 
                onClick={() => reset()}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-red-600/20 text-red-400 border border-red-500/30 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-red-600 hover:text-white transition-all shadow-lg"
            >
                <HiRefresh /> Reboot System
            </button>
        </motion.div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />
    </main>
  );
}
