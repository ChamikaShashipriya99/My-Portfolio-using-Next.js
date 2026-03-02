'use client';

import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard';

const experiences = [
    {
        company: 'TechFlow Systems',
        role: 'Senior Frontend Architect',
        period: '2022 - Present',
        description: 'Leading the development of high-performance cloud management dashboards using Next.js and Micro-frontends.'
    },
    {
        company: 'Stellar Labs',
        role: 'Full Stack Developer',
        period: '2020 - 2022',
        description: 'Developed immersive 3D data visualizations for biotech research tools using R3F and Python.'
    },
    {
        company: 'Nova Digital',
        role: 'Junior Web Developer',
        period: '2018 - 2020',
        description: 'Built responsive marketing sites and interactive UI components for luxury brands.'
    }
];

export default function Experience() {
    return (
        <section id="experience" className="py-24 5xl:py-48 relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="space-y-4 mb-24 text-center">
                    <h2 className="text-3xl sm:text-5xl lg:text-6xl 3xl:text-7xl font-black text-white tracking-tighter uppercase leading-tight">
                        Professional <span className="text-blue-500">Journey</span>
                    </h2>
                    <div className="h-1.5 w-24 bg-blue-600 rounded-full mx-auto" />
                    <p className="text-gray-500 font-mono text-xs md:text-sm 3xl:text-base uppercase tracking-[0.4em]">Career Milestones & Trajectory</p>
                </div>

                <div className="max-w-4xl 3xl:max-w-6xl mx-auto space-y-12 3xl:space-y-20">
                    {experiences.map((exp, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="relative pl-8 md:pl-12 border-l-2 border-white/5 hover:border-blue-500/50 transition-colors py-4 group"
                        >
                            <div className="absolute top-6 -left-[11px] md:-left-[13px] w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)] border-4 border-black group-hover:scale-125 transition-transform" />

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                                <h3 className="text-2xl md:text-3xl 3xl:text-4xl font-black text-white tracking-tight">{exp.role}</h3>
                                <span className="text-blue-500 font-mono text-xs md:text-sm 3xl:text-lg uppercase tracking-widest bg-blue-500/5 px-3 py-1 rounded-full border border-blue-500/10 self-start md:self-center">{exp.period}</span>
                            </div>

                            <h4 className="text-gray-300 font-bold mb-6 text-sm md:text-base 3xl:text-xl uppercase tracking-widest opacity-60 flex items-center gap-2">
                                <span className="w-8 h-[1px] bg-blue-500/50" /> {exp.company}
                            </h4>
                            <p className="text-gray-400 text-base md:text-lg 3xl:text-2xl leading-relaxed max-w-3xl opacity-80">{exp.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
