'use client';

import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard';
import Image from 'next/image';
import { CodeXml, Heart, Coffee, Lightbulb } from 'lucide-react';

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

                    <div className="grid grid-cols-2 gap-4 3xl:gap-8">
                        {[
                            {
                                icon: <CodeXml className="w-6 h-6 text-white" />,
                                title: "Clean Code",
                                desc: "Quality & maintainability",
                                color: "bg-blue-500"
                            },
                            {
                                icon: <Heart className="w-6 h-6 text-white" />,
                                title: "User Focus",
                                desc: "User-centered design",
                                color: "bg-pink-500"
                            },
                            {
                                icon: <Coffee className="w-6 h-6 text-white" />,
                                title: "Dedication",
                                desc: "Committed to excellence",
                                color: "bg-orange-500"
                            },
                            {
                                icon: <Lightbulb className="w-6 h-6 text-white" />,
                                title: "Innovation",
                                desc: "Always learning",
                                color: "bg-green-500"
                            }
                        ].map((item, i) => (
                            <GlassCard key={i} className="flex flex-col items-center text-center p-6 3xl:p-10" hoverScale={true}>
                                <div className={`${item.color} p-4 rounded-2xl mb-4 shadow-lg shadow-${item.color.split('-')[1]}-500/20`}>
                                    {item.icon}
                                </div>
                                <h4 className="text-white font-bold mb-1 3xl:text-2xl">{item.title}</h4>
                                <p className="text-[10px] 3xl:text-sm text-gray-500 uppercase tracking-wider">{item.desc}</p>
                            </GlassCard>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
