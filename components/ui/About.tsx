'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, FileCode, FolderGit, Cpu, Wifi, Settings } from 'lucide-react';

export default function About() {
    const [activeTab, setActiveTab] = useState<'bio' | 'logs'>('bio');

    return (
        <section id="about" className="py-24 5xl:py-48 relative overflow-hidden bg-black/45">
            {/* Background elements */}
            <div className="absolute inset-0 hero-grain pointer-events-none opacity-[0.02]" />
            <span aria-hidden="true" className="pointer-events-none select-none absolute bottom-8 right-6 font-black text-white opacity-[0.02] text-[8rem] sm:text-[10rem] md:text-[14rem] lg:text-[18rem] leading-none tracking-tighter font-mono">02</span>
            
            <div className="container mx-auto px-6">
                <div className="mb-16">
                    <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase leading-tight font-mono">
                        // About <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500">Me</span>
                    </h2>
                    <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full mt-2" />
                </div>

                <div className="grid lg:grid-cols-12 gap-12 items-stretch">
                    {/* DOSSIER CAMERA FEED (Left Column) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="lg:col-span-5 flex flex-col justify-between"
                    >
                        <div className="relative group w-full max-w-[280px] sm:max-w-md mx-auto aspect-square rounded-2xl overflow-hidden bg-black/60 p-4 border border-white/5">
                            {/* HUD brackets */}
                            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-500" />
                            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-500" />
                            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-500" />
                            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-500" />

                            {/* Scanline overlay */}
                            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 z-10" />

                            {/* Blinking ONLINE badge */}
                            <div className="absolute top-6 left-6 flex items-center gap-2 bg-black/80 px-3 py-1 rounded-full border border-cyan-500/30 z-20">
                                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
                                <span className="w-2 h-2 rounded-full bg-cyan-500 absolute left-3" />
                                <span className="font-mono text-[10px] tracking-wider text-cyan-400 uppercase font-bold">ONLINE // DOSSIER</span>
                            </div>

                            {/* Frame overlay grid target */}
                            <div className="absolute inset-4 border border-dashed border-white/5 rounded-xl flex items-center justify-center pointer-events-none">
                                <div className="w-8 h-8 border border-white/10 rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white/20 rounded-full" />
                                </div>
                            </div>

                            {/* Image with neon glow and glitch layers */}
                            <div className="w-full h-full rounded-xl overflow-hidden relative">
                                {/* Base Image */}
                                <img
                                    src="https://github.com/ChamikaShashipriya99.png"
                                    alt="Chamika Shashipriya"
                                    className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                                />
                                {/* Glitch Overlay 1 - Stopped on hover */}
                                <img
                                    src="https://github.com/ChamikaShashipriya99.png"
                                    alt="Glitch 1"
                                    className="absolute inset-0 w-full h-full object-cover grayscale opacity-50 mix-blend-screen pointer-events-none glitch-layer-1 group-hover:opacity-0 transition-opacity duration-300"
                                />
                                {/* Glitch Overlay 2 - Stopped on hover */}
                                <img
                                    src="https://github.com/ChamikaShashipriya99.png"
                                    alt="Glitch 2"
                                    className="absolute inset-0 w-full h-full object-cover grayscale opacity-50 mix-blend-screen pointer-events-none glitch-layer-2 group-hover:opacity-0 transition-opacity duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-cyan-955/30 via-transparent to-transparent pointer-events-none" />
                            </div>
                        </div>

                        {/* Dossier System Diagnostics Panel */}
                        <div className="mt-8 font-mono text-[11px] text-gray-500 space-y-2 bg-black/40 border border-white/5 rounded-xl p-5 max-w-[280px] sm:max-w-md mx-auto w-full">
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span className="text-gray-600 font-bold uppercase">SYSTEM INFO</span>
                                <span className="text-cyan-500/70 animate-pulse">ACTIVE FEED</span>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-1">
                                <div className="flex gap-1.5 items-center">
                                    <Cpu className="w-3.5 h-3.5 text-cyan-500/70" />
                                    <span>TARGET:</span>
                                </div>
                                <span className="text-white text-right">CHAMIKA.Z</span>

                                <div className="flex gap-1.5 items-center">
                                    <FolderGit className="w-3.5 h-3.5 text-cyan-500/70" />
                                    <span>ROLE:</span>
                                </div>
                                <span className="text-white text-right">FULL_STACK_DEV</span>

                                <div className="flex gap-1.5 items-center">
                                    <Settings className="w-3.5 h-3.5 text-cyan-500/70" />
                                    <span>LOC:</span>
                                </div>
                                <span className="text-white text-right">COLOMBO, LK</span>

                                <div className="flex gap-1.5 items-center">
                                    <Wifi className="w-3.5 h-3.5 text-cyan-500/70" />
                                    <span>NET STATUS:</span>
                                </div>
                                <span className="text-emerald-400 text-right">ONLINE [24ms]</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* MOCK IDE CODE EDITOR (Right Column) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="lg:col-span-7 flex flex-col"
                    >
                        <div className="flex flex-col h-full bg-[#0d0e12]/80 border border-white/10 rounded-2xl overflow-hidden glassmorphism shadow-2xl shadow-cyan-950/20">
                            {/* Editor Window Controls Bar */}
                            <div className="flex justify-between items-center px-4 py-3 bg-[#08090c]/90 border-b border-white/5 select-none">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition duration-150 cursor-pointer" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition duration-150 cursor-pointer" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition duration-150 cursor-pointer" />
                                </div>
                                <div className="font-mono text-xs text-gray-500 tracking-wider">
                                    {"~/chamikaz/bio.json"}
                                </div>
                                <div className="w-12" /> {/* spacer */}
                            </div>

                            {/* IDE Tabs */}
                            <div className="flex bg-[#06070a] border-b border-white/5 select-none">
                                <button
                                    onClick={() => setActiveTab('bio')}
                                    className={`flex items-center gap-2 px-4 py-2 font-mono text-xs border-r border-white/5 transition duration-150 ${
                                        activeTab === 'bio'
                                            ? 'bg-[#0d0e12] text-cyan-400 border-t-2 border-t-cyan-500 font-bold'
                                            : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                                    }`}
                                >
                                    <FileCode className="w-3.5 h-3.5 text-cyan-500" />
                                    bio.json
                                </button>
                                <button
                                    onClick={() => setActiveTab('logs')}
                                    className={`flex items-center gap-2 px-4 py-2 font-mono text-xs border-r border-white/5 transition duration-150 ${
                                        activeTab === 'logs'
                                            ? 'bg-[#0d0e12] text-cyan-400 border-t-2 border-t-cyan-500 font-bold'
                                            : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                                    }`}
                                >
                                    <Terminal className="w-3.5 h-3.5 text-purple-400" />
                                    diagnostics.sh
                                </button>
                            </div>

                            {/* Code Area */}
                            <div className="flex-1 p-6 font-mono text-xs sm:text-sm leading-relaxed overflow-y-auto max-h-[420px] min-h-[380px] bg-[#0c0d10]/95 scrollbar-thin text-gray-300 select-text">
                                {activeTab === 'bio' ? (
                                    <div className="space-y-1">
                                        <div className="text-gray-600">// Chamika Shashipriya Biography Data</div>
                                        <div>
                                            <span className="text-pink-500">{`{`}</span>
                                        </div>
                                        <div className="pl-6">
                                            <span className="text-purple-400">&quot;name&quot;</span>: <span className="text-emerald-400">&quot;Chamika Shashipriya&quot;</span>,
                                        </div>
                                        <div className="pl-6">
                                            <span className="text-purple-400">&quot;role&quot;</span>: <span className="text-emerald-400">&quot;Full-Stack Software Engineer&quot;</span>,
                                        </div>
                                        <div className="pl-6">
                                            <span className="text-purple-400">&quot;core_stack&quot;</span>: <span className="text-pink-500">[</span>
                                            <span className="text-emerald-400">&quot;MERN&quot;</span>, <span className="text-emerald-400">&quot;React.js&quot;</span>, <span className="text-emerald-400">&quot;Next.js&quot;</span>, <span className="text-emerald-400">&quot;Node.js&quot;</span>
                                            <span className="text-pink-500">]</span>,
                                        </div>
                                        <div className="pl-6">
                                            <span className="text-purple-400">&quot;about&quot;</span>: <span className="text-gray-400">&quot;A passionate software developer dedicated to building modern, highly scalable, and user-centric web applications. I turn complex logic into clean, high-performance visual experiences.&quot;</span>,
                                        </div>
                                        <div className="pl-6">
                                            <span className="text-purple-400">&quot;philosophy&quot;</span>: <span className="text-gray-400">&quot;Driven by a strong curiosity for beautiful web layouts and efficient system architectures. I love crafting immersive micro-animations, writing clean code, and optimizing web performance.&quot;</span>,
                                        </div>
                                        <div className="pl-6">
                                            <span className="text-purple-400">&quot;interests&quot;</span>: <span className="text-pink-500">[</span>
                                            <span className="text-emerald-400">&quot;Cybernetics&quot;</span>, <span className="text-emerald-400">&quot;3D Webs&quot;</span>, <span className="text-emerald-400">&quot;API Design&quot;</span>
                                            <span className="text-pink-500">]</span>
                                        </div>
                                        <div>
                                            <span className="text-pink-500">{`}`}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2 text-cyan-400/90 font-mono text-[11px] sm:text-xs">
                                        <div className="text-gray-600"># Run diagnostics check...</div>
                                        <div>guest@chamikaz:~$ <span className="text-white">./diagnostics.sh</span></div>
                                        <div className="text-gray-500">&gt; Initializing diagnostics engine...</div>
                                        <div className="flex gap-2"><span className="text-emerald-400">[ OK ]</span> CPU Core: Stable</div>
                                        <div className="flex gap-2"><span className="text-emerald-400">[ OK ]</span> Database Connections: Secure</div>
                                        <div className="flex gap-2"><span className="text-emerald-400">[ OK ]</span> Frontend Renderer: Responsive [Next.js]</div>
                                        <div className="flex gap-2"><span className="text-emerald-400">[ OK ]</span> Tailwind CSS Config: Loaded</div>
                                        <div className="flex gap-2"><span className="text-emerald-400">[ OK ]</span> Framer Motion Core: Synchronized</div>
                                        <div className="pt-2 text-purple-400 font-bold">ALL SYSTEMS FULLY OPERATIONAL</div>
                                        <div className="text-gray-500">guest@chamikaz:~$ <span className="animate-pulse">_</span></div>
                                    </div>
                                )}
                            </div>

                            {/* Terminal Status Bar */}
                            <div className="flex justify-between items-center px-4 py-2 bg-[#08090c]/90 border-t border-white/5 text-[10px] font-mono text-gray-500 select-none">
                                <div className="flex gap-4">
                                    <span className="text-cyan-400 font-semibold">LN 1, COL 1</span>
                                    <span>UTF-8</span>
                                    <span>JSON</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    <span>Prettier Active</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Custom Styles for Image Glitch Animation */}
            <style dangerouslySetInnerHTML={{__html: `
                .glitch-layer-1 {
                    clip-path: inset(40% 0 61% 0);
                    filter: hue-rotate(90deg) saturate(3);
                    animation: cyber-glitch-anim-1 2s infinite linear alternate-reverse;
                }
                .glitch-layer-2 {
                    clip-path: inset(10% 0 80% 0);
                    filter: hue-rotate(240deg) saturate(3);
                    animation: cyber-glitch-anim-2 2s infinite linear alternate-reverse;
                }
                @keyframes cyber-glitch-anim-1 {
                    0% {
                        clip-path: inset(20% 0 60% 0);
                        transform: translate(-2px, 1px) skew(1deg);
                    }
                    20% {
                        clip-path: inset(60% 0 20% 0);
                        transform: translate(2px, -1px) skew(-1deg);
                    }
                    40% {
                        clip-path: inset(40% 0 40% 0);
                        transform: translate(-1px, 2px) skew(2deg);
                    }
                    60% {
                        clip-path: inset(80% 0 5% 0);
                        transform: translate(1px, -2px) skew(-1deg);
                    }
                    80% {
                        clip-path: inset(10% 0 70% 0);
                        transform: translate(-2px, 1px) skew(1deg);
                    }
                    100% {
                        clip-path: inset(30% 0 50% 0);
                        transform: translate(0px, 0px) skew(0deg);
                    }
                }
                @keyframes cyber-glitch-anim-2 {
                    0% {
                        clip-path: inset(10% 0 70% 0);
                        transform: translate(2px, -1px) skew(-2deg);
                    }
                    20% {
                        clip-path: inset(50% 0 30% 0);
                        transform: translate(-2px, 1px) skew(2deg);
                    }
                    40% {
                        clip-path: inset(30% 0 50% 0);
                        transform: translate(1px, -1px) skew(-1deg);
                    }
                    60% {
                        clip-path: inset(70% 0 10% 0);
                        transform: translate(-1px, 1px) skew(1deg);
                    }
                    80% {
                        clip-path: inset(5% 0 80% 0);
                        transform: translate(2px, -1px) skew(-2deg);
                    }
                    100% {
                        clip-path: inset(40% 0 40% 0);
                        transform: translate(0px, 0px) skew(0deg);
                    }
                }
            `}} />
        </section>
    );
}
