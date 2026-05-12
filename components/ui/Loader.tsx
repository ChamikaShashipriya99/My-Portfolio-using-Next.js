'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const bootSequence = [
    "INITIALIZING CORE KERNEL...",
    "MOUNTING SECURE FILE SYSTEM... [OK]",
    "ESTABLISHING ENCRYPTED UPLINK... [OK]",
    "DECRYPTING PORTFOLIO ASSETS... [WARNING: ENCRYPTION DETECTED]",
    "BRUTE-FORCING ENCRYPTION KEY... [SUCCESS]",
    "LOADING 3D NEURAL INTERFACE... [OK]",
    "WARNING: UNAUTHORIZED ACCESS DETECTED.",
    "INITIATING SYSTEM OVERRIDE...",
    "OVERRIDE SUCCESSFUL. WELCOME ADMIN."
];

// Generates rapid background matrix-style hex data
function HexDump() {
    const [hex, setHex] = useState('');
    useEffect(() => {
        const timer = setInterval(() => {
            let str = '';
            for (let i = 0; i < 40; i++) {
                str += Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase() + ' ';
            }
            setHex(str);
        }, 50);
        return () => clearInterval(timer);
    }, []);
    return (
        <div className="font-mono text-[8px] md:text-[10px] text-blue-900/20 break-words opacity-50 select-none overflow-hidden h-full absolute inset-0 z-10">
            {hex.repeat(50)}
        </div>
    );
}

export default function Loader({ onComplete }: { onComplete: () => void }) {
    const [progress, setProgress] = useState(0);
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [glitch, setGlitch] = useState(false);
    
    // Fix for Next.js Hydration Mismatch
    const [sysTime, setSysTime] = useState('0000-00-00T00:00:00.000Z');
    const [latency, setLatency] = useState(14);

    useEffect(() => {
        setSysTime(new Date().toISOString());
        setLatency(Math.floor(Math.random() * 20 + 10));
    }, []);

    // Erratic "hacker" style progress bar
    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(onComplete, 1800); // Wait longer at 100% for drama
                    return 100;
                }
                const bump = Math.random() > 0.85 ? Math.random() * 20 : Math.random() * 3; 
                return Math.min(prev + bump, 100);
            });
        }, 80);

        return () => clearInterval(timer);
    }, [onComplete]);

    // Terminal text logic
    useEffect(() => {
        if (progress < 100) {
            const lineProgress = Math.floor((progress / 100) * bootSequence.length);
            setCurrentLineIndex(Math.min(lineProgress, bootSequence.length - 1));
        } else {
            setCurrentLineIndex(bootSequence.length - 1);
            setGlitch(true);
        }
    }, [progress]);

    // Random visual glitching during load
    useEffect(() => {
        if (progress === 100) return;
        const glitchTimer = setInterval(() => {
            setGlitch(true);
            setTimeout(() => setGlitch(false), 50);
        }, Math.random() * 1500 + 300);
        return () => clearInterval(glitchTimer);
    }, [progress]);

    const columns = 10; // Extreme shutter columns

    return (
        <motion.div 
            exit={{ opacity: 1, transition: { duration: 1.5 } }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 md:p-12 pointer-events-none overflow-hidden"
        >
            {/* The Background Shutters (Alternating sliding out) */}
            <div className="absolute inset-0 z-0 flex pointer-events-none">
                {[...Array(columns)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ scaleY: 1 }}
                        exit={{ scaleY: 0 }}
                        transition={{
                            duration: 0.5,
                            ease: [0.85, 0, 0.15, 1],
                            delay: i * 0.05 + 0.3
                        }}
                        className={`h-full flex-1 bg-black origin-${i % 2 === 0 ? 'top' : 'bottom'}`}
                    />
                ))}
            </div>

            <HexDump />

            {/* Extreme Glitch RGB Overlay */}
            {glitch && (
                <div 
                    className="absolute inset-0 z-30 bg-blue-500/10 mix-blend-overlay pointer-events-none" 
                    style={{ transform: `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)` }} 
                />
            )}

            {/* Main Content Dashboard */}
            <motion.div 
                exit={{ scale: 1.8, opacity: 0, filter: "blur(20px)", transition: { duration: 0.5, ease: "easeIn" } }}
                className={`w-full max-w-5xl space-y-8 relative z-20 font-mono ${glitch ? 'translate-x-1 -translate-y-1' : ''}`}
            >
                <div className="flex flex-col md:flex-row justify-between md:items-end border-b border-blue-500/50 pb-4 gap-4">
                    <div>
                        <h1 className="text-white text-4xl md:text-6xl font-black tracking-tighter uppercase flex items-center gap-4">
                            <span className="w-3 md:w-4 h-8 md:h-10 bg-blue-500 animate-pulse" />
                            CHAMIK.OS <span className="text-blue-500 text-lg md:text-xl">v2.0</span>
                        </h1>
                        <p className="text-blue-400 text-xs md:text-sm mt-2 tracking-widest">AUTHORIZATION LEVEL: OMEGA</p>
                    </div>
                    <div className="hidden md:block text-right font-mono tracking-widest">
                        <div className="text-blue-500/50 text-xs">SYS_TIME: {sysTime}</div>
                        <div className="text-blue-500/50 text-xs">LATENCY: {latency}ms</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Panel: Boot Sequence */}
                    <div className="lg:col-span-2 h-64 border border-blue-500/20 bg-blue-900/10 p-4 md:p-6 flex flex-col justify-end text-xs md:text-sm text-blue-400 space-y-1 relative overflow-hidden backdrop-blur-md">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black via-transparent to-transparent z-0" />
                        <div className="relative z-10 flex flex-col justify-end h-full">
                            {bootSequence.slice(0, currentLineIndex + 1).map((line, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex gap-3 mb-1 ${
                                        index === bootSequence.length - 1 && progress === 100 
                                        ? 'text-red-500 font-bold text-base md:text-lg animate-pulse' 
                                        : ''
                                    }`}
                                >
                                    <span className="text-gray-600 opacity-50">[{index.toString().padStart(2, '0')}]</span>
                                    <span className={`${line.includes('WARNING') ? 'text-yellow-500' : ''}`}>{line}</span>
                                </motion.div>
                            ))}
                            {progress < 100 && (
                                <motion.div
                                    animate={{ opacity: [1, 0] }}
                                    transition={{ repeat: Infinity, duration: 0.3 }}
                                    className="w-3 h-4 md:h-5 bg-blue-500 ml-8 mt-2"
                                />
                            )}
                        </div>
                    </div>

                    {/* Right Panel: Data Metrics */}
                    <div className="hidden lg:flex flex-col gap-4">
                        {[
                            { label: "CPU_LOAD", val: Math.min(progress * 1.5, 100) },
                            { label: "MEM_ALLOC", val: progress },
                            { label: "NET_UPLINK", val: progress > 50 ? 100 : progress * 2 }
                        ].map((stat, i) => (
                            <div key={i} className="border border-blue-500/20 p-4 bg-blue-900/10 backdrop-blur-md">
                                <div className="flex justify-between text-xs text-blue-300 mb-2 tracking-widest">
                                    <span>{stat.label}</span>
                                    <span>{Math.floor(stat.val)}%</span>
                                </div>
                                <div className="h-1 w-full bg-black">
                                    <div className={`h-full ${progress === 100 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${stat.val}%` }} />
                                </div>
                            </div>
                        ))}
                        
                        <div className="flex-1 border border-blue-500/20 p-4 bg-blue-900/10 backdrop-blur-md flex items-center justify-center relative overflow-hidden">
                            {progress === 100 ? (
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="text-red-500 font-black text-xl tracking-widest text-center animate-pulse"
                                >
                                    SYSTEM<br/>OVERRIDE
                                </motion.div>
                            ) : (
                                <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Master Progress */}
                <div className="pt-4">
                    <div className="relative h-1 md:h-2 w-full bg-blue-900/30 overflow-hidden">
                        <motion.div
                            className={`absolute top-0 left-0 h-full ${progress === 100 ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,1)]' : 'bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.8)]'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
