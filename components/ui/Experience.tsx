'use client';

import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard';
import Image from 'next/image';

const experiences = [
    {
        company: "DoMedia",
        role: "3-Month Industrial Program - Full Stack Web Developer Training",
        period: "Nov 2025 - Jan 2026",
        description: "Attended a comprehensive 3-month full-time Industrial Training Program focused on Full Stack Web Development. This intensive program covers both frontend and backend technologies.",
        logo: "/images/domediaLogo.jpg",
        category: "professional"
    },
    {
        company: "United Motors Pvt Ltd",
        role: "Automobile Motor Mechanic Technician",
        period: "Jan 2020 - Jan 2022",
        description: "Worked as an Automobile Motor Mechanic Technician, gaining hands-on experience in automotive repair and maintenance.",
        logo: "/images/united-motors-logo.png",
        category: "professional"
    },
    {
        company: "SLIIT",
        role: "BSc (Hons) in Information Technology",
        period: "July 2023 - Present",
        description: "Currently pursuing a Bachelor of Science (Honours) degree in Information Technology, focusing on modern computing technologies and software development.",
        logo: "/images/sliit-logo.png",
        category: "education"
    },
    {
        company: "AETI - Orugodawatta",
        role: "Automobile Motor Mechanic Course",
        period: "2019 - 2022",
        description: "Completed comprehensive training in automobile motor mechanics, covering engine repair, diagnostics, and automotive systems.",
        logo: "/images/aeti-logo.png",
        category: "education"
    },
    {
        company: "Open University - Sri Lanka",
        role: "Information & Communication Technology",
        period: "2016",
        description: "Completed course in Information & Communication Technology focusing on Microsoft Office applications and basic computer skills.",
        logo: "/images/open-university-logo.png",
        category: "education"
    },
    {
        company: "Open University - Sri Lanka",
        role: "Short Course in Listening and Speaking",
        period: "2022",
        description: "Completed a short course focused on improving listening and speaking skills for better communication.",
        logo: "/images/open-university-logo.png",
        category: "education"
    }
];

export default function Experience() {
    const professionalExp = experiences.filter(exp => exp.category === "professional");
    const educationExp = experiences.filter(exp => exp.category === "education");

    return (
        <section id="experience" className="py-24 5xl:py-48 relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="space-y-4 mb-24 text-center">
                    <h2 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl 5xl:text-8xl 2k:text-9xl 5k:text-[12rem] font-black text-white tracking-tighter uppercase leading-tight">
                        Professional <span className="text-blue-500">Journey</span>
                    </h2>
                    <div className="h-1.5 w-24 bg-blue-600 rounded-full mx-auto" />
                    <p className="text-gray-500 font-mono text-xs md:text-sm 3xl:text-base uppercase tracking-[0.4em]">Career Milestones & Educational Trajectory</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 max-w-7xl mx-auto">
                    {/* Professional Experience Section */}
                    <div className="space-y-12">
                        <div className="flex items-center gap-4 mb-8">
                            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase">Professional Experience</h3>
                            <div className="h-[2px] flex-grow bg-blue-500/20" />
                        </div>

                        <div className="space-y-12 relative border-l-2 border-white/5 pl-8 md:pl-12 ml-4">
                            {professionalExp.map((exp, i) => (
                                <motion.div
                                    key={`prof-${i}`}
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    className="relative py-4 group"
                                >
                                    <div className="absolute top-6 -left-[41px] md:-left-[53px] w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)] border-4 border-black group-hover:scale-125 transition-transform z-10" />

                                    <div className="flex flex-col gap-2 mb-4">
                                        <div className="flex items-start gap-4">
                                            {exp.logo && (
                                                <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-white/5">
                                                    <Image
                                                        src={exp.logo}
                                                        alt={exp.company}
                                                        fill
                                                        className="object-cover p-1"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex flex-col gap-1">
                                                <h4 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-tight">{exp.role}</h4>
                                                <span className="text-blue-500 font-mono text-[10px] md:text-xs uppercase tracking-widest bg-blue-500/5 px-2 py-1 rounded-full border border-blue-500/10 self-start">{exp.period}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-gray-400 font-semibold mb-4 text-sm uppercase tracking-wider opacity-70 flex items-center gap-2">
                                        <span className="w-6 h-[1px] bg-blue-500/30" /> {exp.company}
                                    </div>
                                    <p className="text-gray-400 text-sm md:text-base leading-relaxed opacity-80">{exp.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Education Section */}
                    <div className="space-y-12">
                        <div className="flex items-center gap-4 mb-8">
                            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase">Education</h3>
                            <div className="h-[2px] flex-grow bg-blue-500/20" />
                        </div>

                        <div className="space-y-12 relative border-l-2 border-white/5 pl-8 md:pl-12 ml-4">
                            {educationExp.map((exp, i) => (
                                <motion.div
                                    key={`edu-${i}`}
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    className="relative py-4 group"
                                >
                                    <div className="absolute top-6 -left-[41px] md:-left-[53px] w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)] border-4 border-black group-hover:scale-125 transition-transform z-10" />

                                    <div className="flex flex-col gap-2 mb-4">
                                        <div className="flex items-start gap-4">
                                            {exp.logo && (
                                                <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-white/5">
                                                    <Image
                                                        src={exp.logo}
                                                        alt={exp.company}
                                                        fill
                                                        className="object-cover p-1"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex flex-col gap-1">
                                                <h4 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-tight">{exp.role}</h4>
                                                <span className="text-blue-500 font-mono text-[10px] md:text-xs uppercase tracking-widest bg-blue-500/5 px-2 py-1 rounded-full border border-blue-500/10 self-start">{exp.period}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-gray-400 font-semibold mb-4 text-sm uppercase tracking-wider opacity-70 flex items-center gap-2">
                                        <span className="w-6 h-[1px] bg-blue-500/30" /> {exp.company}
                                    </div>
                                    <p className="text-gray-400 text-sm md:text-base leading-relaxed opacity-80">{exp.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
