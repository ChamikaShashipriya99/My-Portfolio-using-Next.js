'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Play, Terminal } from 'lucide-react';
import dynamic from 'next/dynamic';

const SnakeGame = dynamic(() => import('./SnakeGame'), { ssr: false, loading: () => <p role="status" className="py-16 text-sm text-gray-400">Loading game…</p> });

export default function MainframeArcade() {
    const [active, setActive] = useState(false);
    const playButton = useRef<HTMLButtonElement>(null);
    const wasActive = useRef(false);
    const reducedMotion = useReducedMotion();
    const exit = useCallback(() => setActive(false), []);
    useEffect(() => {
        if (!active && wasActive.current) playButton.current?.focus({ preventScroll: true });
        wasActive.current = active;
    }, [active]);
    return <section id="arcade" aria-labelledby="arcade-title" className="py-20 sm:py-24 relative overflow-hidden bg-black/35">
        <span aria-hidden="true" className="absolute bottom-8 right-6 text-[10rem] lg:text-[18rem] text-white/[0.03] font-black leading-none pointer-events-none">08</span>
        <div className="container mx-auto px-6 max-w-5xl relative">
            <div className="mb-10 sm:mb-12">
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-blue-400 mb-3">A small break from the serious stuff</p>
                <h2 id="arcade-title" className="text-3xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter">Mainframe <span className="text-blue-500">Arcade</span></h2>
                <div className="w-24 h-1 rounded-full bg-blue-600 mt-4" />
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed mt-5 max-w-xl">A debugger-themed game of Snake. Collect the pink bugs to grow and earn 10 points each. Avoid the walls and your own tail.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-neutral-950/80 p-4 sm:p-7">
                {active ? <SnakeGame onExit={exit} /> : <motion.div initial={reducedMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : 0.4 }} className="min-h-[280px] sm:min-h-[340px] flex flex-col items-center justify-center text-center gap-5 py-8">
                    <Terminal size={32} aria-hidden="true" className="text-emerald-400" />
                    <h3 className="text-xl sm:text-2xl font-semibold text-white">Ready for a quick game?</h3>
                    <p id="arcade-start-help" className="text-sm text-gray-400 max-w-md leading-relaxed">Use arrow keys or WASD while the board has focus, or use the on-screen direction buttons. Space or P pauses. Escape exits. Sound starts muted.</p>
                    <button ref={playButton} type="button" onClick={() => setActive(true)} aria-describedby="arcade-start-help" className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-6 py-3 text-sm text-white font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-300 focus-visible:outline-offset-4"><Play size={16} aria-hidden="true" />Play game</button>
                </motion.div>}
            </div>
            <p className="text-xs text-gray-500 leading-relaxed mt-5 max-w-2xl">The game pauses when you leave its controls or switch browser tabs. Resume when you’re ready. Your best score is saved on this device when browser storage is available.</p>
        </div>
    </section>;
}
