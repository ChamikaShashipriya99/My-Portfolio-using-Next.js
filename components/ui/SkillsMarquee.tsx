'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    SiJavascript, SiPython, SiC, SiCplusplus, SiSharp, SiPhp,
    SiKotlin, SiHtml5, SiCss3, SiMongodb, SiMysql,
    SiXampp, SiGit, SiGithub, SiNpm, SiFigma, SiCanva,
    SiCisco, SiTrello, SiNodemon, SiApachetomcat, SiReact, SiNodedotjs,
    SiExpress, SiBootstrap, SiTailwindcss, SiDotnet, SiSpringboot,
    SiJsonwebtokens, SiCodeigniter, SiWordpress
} from 'react-icons/si';
import { FaJava, FaServer, FaDatabase } from 'react-icons/fa';

const skillCategories = [
    {
        title: "Programming Languages",
        skills: [
            { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
            { name: "Java", icon: FaJava, color: "#007396" },
            { name: "Python", icon: SiPython, color: "#3776AB" },
            { name: "C", icon: SiC, color: "#A8B9CC" },
            { name: "C++", icon: SiCplusplus, color: "#00599C" },
            { name: "C#", icon: SiSharp, color: "#239120" },
            { name: "PHP", icon: SiPhp, color: "#777BB4" },
            { name: "Kotlin", icon: SiKotlin, color: "#7F52FF" },
            { name: "HTML5", icon: SiHtml5, color: "#E34F26" },
            { name: "CSS3", icon: SiCss3, color: "#1572B6" },
        ]
    },
    {
        title: "Databases & Servers",
        skills: [
            { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
            { name: "MySQL", icon: SiMysql, color: "#4479A1" },
            { name: "MS SQL Server", icon: FaDatabase, color: "#CC2927" },
            { name: "XAMPP", icon: SiXampp, color: "#FB7A24" },
            { name: "WAMP", icon: FaServer, color: "#FFFFFF" },
        ]
    },
    {
        title: "Frameworks & Platforms",
        skills: [
            { name: "React", icon: SiReact, color: "#61DAFB" },
            { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
            { name: "Express.js", icon: SiExpress, color: "#FFFFFF" },
            { name: "Bootstrap", icon: SiBootstrap, color: "#7952B3" },
            { name: "Tailwind", icon: SiTailwindcss, color: "#06B6D4" },
            { name: ".NET", icon: SiDotnet, color: "#512BD4" },
            { name: "Spring", icon: SiSpringboot, color: "#6DB33F" },
            { name: "JWT", icon: SiJsonwebtokens, color: "#FFFFFF" },
            { name: "CodeIgniter", icon: SiCodeigniter, color: "#EE4323" },
            { name: "WordPress", icon: SiWordpress, color: "#21759B" },
        ]
    },
    {
        title: "Tools & IDE's",
        skills: [
            { name: "Git", icon: SiGit, color: "#F05032" },
            { name: "GitHub", icon: SiGithub, color: "#FFFFFF" },
            { name: "NPM", icon: SiNpm, color: "#CB3837" },
            { name: "Figma", icon: SiFigma, color: "#F24E1E" },
            { name: "Canva", icon: SiCanva, color: "#00C4CC" },
            { name: "Cisco", icon: SiCisco, color: "#1BA0D7" },
            { name: "Trello", icon: SiTrello, color: "#0052CC" },
            { name: "Nodemon", icon: SiNodemon, color: "#76D04B" },
            { name: "Apache Tomcat", icon: SiApachetomcat, color: "#F8DC75" },
        ]
    }
];

const MarqueeRow = ({ skills, direction = 1 }: { skills: any[], direction?: number }) => {
    return (
        <div className="flex overflow-hidden py-4 md:py-8 select-none group">
            <motion.div
                animate={{
                    x: direction > 0 ? [0, "-50%"] : ["-50%", 0],
                }}
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 50,
                        ease: "linear",
                    },
                }}
                className="flex flex-none gap-6 md:gap-12 pr-6 md:pr-12"
            >
                {[...skills, ...skills, ...skills, ...skills].map((skill, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-3 md:gap-5 glassmorphism px-5 py-3 md:px-8 md:py-4 rounded-2xl border border-white/10 hover:border-blue-500/50 hover:bg-white/5 transition-all duration-300"
                    >
                        <skill.icon className="text-xl md:text-3xl 3xl:text-4xl" style={{ color: skill.color }} />
                        <span className="text-white font-mono text-xs md:text-sm 3xl:text-lg uppercase tracking-widest whitespace-nowrap">
                            {skill.name}
                        </span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default function SkillsMarquee() {
    return (
        <section id="skills" className="py-24 5xl:py-48 relative overflow-hidden bg-black/50">
            <div className="container mx-auto px-6 mb-16 relative z-10">
                <div className="space-y-4 text-center">
                    <h2 className="text-3xl sm:text-5xl lg:text-6xl 3xl:text-7xl font-black text-white tracking-tighter uppercase">
                        Technical <span className="text-blue-500">Arsenal</span>
                    </h2>
                    <div className="h-1.5 w-24 bg-blue-600 rounded-full mx-auto" />
                    <p className="text-gray-500 font-mono text-xs md:text-sm 3xl:text-base uppercase tracking-[0.4em]">Advanced Skillset Matrix</p>
                </div>
            </div>

            <div className="flex flex-col gap-2 md:gap-6">
                {skillCategories.map((category, idx) => (
                    <div key={idx} className="relative">
                        <div className="container mx-auto px-6 mb-2">
                            <span className="text-[10px] md:text-xs text-gray-600 uppercase tracking-[0.5em] font-bold opacity-50">
                                {category.title}
                            </span>
                        </div>

                        <MarqueeRow
                            skills={category.skills}
                            direction={idx % 2 === 0 ? 1 : -1}
                        />
                    </div>
                ))}
            </div>

            {/* Background Glows */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[30rem] h-[30rem] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[30rem] h-[30rem] bg-purple-600/5 rounded-full blur-[150px] pointer-events-none" />
        </section>
    );
}
