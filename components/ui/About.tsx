'use client';

import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard';
import Image from 'next/image';

export default function About() {
    return (
        <section id="about" className="py-24 5xl:py-48 relative overflow-hidden">
            <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 xl:gap-24 3xl:gap-32 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="relative group max-w-md mx-auto md:max-w-none"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                    <div className="relative aspect-square rounded-3xl overflow-hidden glassmorphism p-2">
                        <img
                            src="https://github.com/ChamikaShashipriya99.png"
                            alt="Chamika Shashipriya"
                            className="w-full h-full object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-500"
                        />
                    </div>

                    <div className="absolute -bottom-6 -right-6 glassmorphism p-6 rounded-2xl border border-white/10 hidden md:block">
                        <div className="text-3xl xl:text-4xl font-bold text-white tracking-tighter">5+</div>
                        <div className="text-xs xl:text-sm text-gray-400 uppercase tracking-widest leading-none">Years of <br />Experience</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="space-y-8 3xl:space-y-12"
                >
                    <div className="space-y-4">
                        <h2 className="text-3xl sm:text-5xl lg:text-6xl 3xl:text-7xl font-black text-white tracking-tighter uppercase leading-tight">
                            About <span className="text-blue-500">Me</span>
                        </h2>
                        <div className="h-1.5 w-24 bg-blue-600 rounded-full" />
                    </div>

                    <p className="text-gray-400 text-base md:text-lg 3xl:text-2xl leading-relaxed">
                        Hello! I&apos;m Chamika Shashipriya, a passionate Full-Stack Developer dedicated to building modern, scalable, and user-friendly web applications. With a strong foundation in JavaScript, React.js, Node.js, and the MERN stack, I love turning ideas into reality through code.
                    </p>

                    <p className="text-gray-400 text-sm md:text-base 3xl:text-xl leading-relaxed opacity-80">
                        My journey in web development began with a curiosity for how things work on the internet. Since then, I&apos;ve honed my skills in both frontend and backend technologies, always striving to learn and adapt to new trends. I enjoy collaborating with others, solving complex problems, and delivering high-quality solutions that make a difference.
                    </p>

                    <GlassCard className="!p-8 3xl:!p-12" hoverScale={false}>
                        <div className="grid grid-cols-2 gap-8 3xl:gap-16">
                            <div>
                                <h4 className="text-white font-bold mb-2 3xl:text-2xl">Architecture</h4>
                                <p className="text-sm 3xl:text-lg text-gray-500">Atomic Design & Micro-frontends</p>
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-2 3xl:text-2xl">Performance</h4>
                                <p className="text-sm 3xl:text-lg text-gray-500">Fast 60fps web experiences</p>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>
            </div>
        </section>
    );
}
