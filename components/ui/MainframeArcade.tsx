'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlay, HiTerminal } from 'react-icons/hi';
import SnakeGame from './SnakeGame';
import GlassCard from './GlassCard';

export default function MainframeArcade() {
    const [isActive, setIsActive] = useState(false);

    return (
        <section id="arcade" className="py-24 5xl:py-48 relative overflow-hidden bg-black/35">
            {/* Background absolute label */}
            <span aria-hidden="true" className="pointer-events-none select-none absolute bottom-8 right-6 font-black text-white opacity-[0.03] text-[8rem] sm:text-[10rem] md:text-[14rem] lg:text-[18rem] leading-none tracking-tighter">08</span>
            
            <div className="container mx-auto px-6 max-w-5xl relative z-10 flex flex-col items-center">
                
                {/* Section Header */}
                <div className="space-y-4 text-center mb-16">
                    <h2 className="text-3xl sm:text-5xl lg:text-6xl 3xl:text-7xl font-black text-white tracking-tighter uppercase leading-tight">
                        Mainframe <span className="text-blue-500">Arcade</span>
                    </h2>
                    <div className="h-1.5 w-24 bg-blue-600 rounded-full mx-auto" />
                    <p className="text-gray-500 font-mono text-xs md:text-sm 3xl:text-base uppercase tracking-[0.4em]">
                        Interactive Debugger Terminal
                    </p>
                </div>

                {/* CRT Screen Outer Box Wrapper */}
                <div className="w-full max-w-4xl border border-white/10 rounded-3xl bg-[#080808]/80 backdrop-blur-xl p-4 sm:p-8 flex flex-col items-center shadow-2xl relative">
                    
                    {/* Retro Monitor Tube Shell */}
                    <div className={`w-full border border-emerald-500/20 bg-[#050505] rounded-2xl relative shadow-[0_0_40px_rgba(16,185,129,0.03)] overflow-hidden flex flex-col justify-center items-center p-4 sm:p-6 transition-all duration-300 ${!isActive ? 'aspect-[16/10] sm:aspect-[16/9]' : 'min-h-[480px] h-auto'}`}>
                        
                        {/* CRT Screen Scanlines filter */}
                        <div className="absolute inset-0 pointer-events-none z-40 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-[0.08]" />

                        <AnimatePresence mode="wait">
                            {!isActive ? (
                                <motion.div
                                    key="inactive-overlay"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="flex flex-col items-center text-center gap-6 z-10 px-4"
                                >
                                    {/* Startup Diagnostis Prompt */}
                                    <div className="flex flex-col items-center gap-2 font-mono text-[10px] md:text-xs text-emerald-500/50 uppercase tracking-[0.2em] mb-2">
                                        <HiTerminal className="text-lg text-emerald-500 animate-pulse" />
                                        <span>CHAMIKA_SHASHIPRIYA_MAINFRAME</span>
                                        <span className="text-[9px] text-emerald-500/30">diagnostic check: ready</span>
                                    </div>

                                    <h4 className="text-white font-mono text-sm md:text-base tracking-widest uppercase mb-4">
                                        Eradicate core system bugs below
                                    </h4>

                                    {/* Boot Button */}
                                    <button
                                        onClick={() => setIsActive(true)}
                                        className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-widest text-xs md:text-sm rounded-xl transition-all shadow-lg shadow-emerald-600/30 hover:scale-105 active:scale-95 flex items-center gap-3 active:translate-y-[1px] cursor-pointer"
                                    >
                                        <HiPlay className="text-base" /> Boot Debugger Shell
                                    </button>

                                    <p className="text-gray-500 font-mono text-[9px] uppercase tracking-wider max-w-sm mt-4 leading-relaxed">
                                        Pressing boot connects keyboard focus (Arrow keys / WASD & Space to play, ESC to exit).
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="active-game"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="w-full h-full flex items-center justify-center p-2 relative"
                                >
                                    <SnakeGame onExit={() => setIsActive(false)} />

                                    {/* Extra link overlay to escape */}
                                    <button
                                        onClick={() => setIsActive(false)}
                                        className="absolute bottom-1 right-2 text-[8px] font-mono text-emerald-500/40 hover:text-red-500 transition-colors uppercase tracking-widest cursor-pointer z-50 p-1 rounded hover:bg-white/5"
                                    >
                                        [Disengage Core]
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Info Note Callout */}
                <div className="w-full max-w-3xl mt-10">
                    <GlassCard className="!p-6 bg-blue-600/5 group hover:bg-blue-600/10 border-blue-500/10" hoverScale={false}>
                        <p className="text-gray-400 text-xs md:text-sm leading-relaxed text-center opacity-85 font-mono uppercase tracking-wider">
                            Interactive debugger running on native Web Audio API synthesizer oscillators. No external audio files loaded.
                        </p>
                    </GlassCard>
                </div>

            </div>
            
            {/* Background Glows */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[30rem] h-[30rem] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[30rem] h-[30rem] bg-emerald-600/5 rounded-full blur-[150px] pointer-events-none" />
        </section>
    );
}
