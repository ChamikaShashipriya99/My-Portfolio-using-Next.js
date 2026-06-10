'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HiDownload, HiArrowRight } from 'react-icons/hi';
import { FaGithub, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import { useTextScramble } from '@/hooks/useTextScramble';
import Hero3D from './Hero3D';
import StarField from './StarField';

const Typewriter = ({ text, delay = 0 }: { text: string; delay?: number }) => {
    const [displayText, setDisplayText] = React.useState('');
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [loopNum, setLoopNum] = React.useState(0);
    const [typingSpeed, setTypingSpeed] = React.useState(150);

    React.useEffect(() => {
        let timer = setTimeout(() => {
            handleType();
        }, typingSpeed);

        return () => clearTimeout(timer);
    }, [displayText, isDeleting, typingSpeed]);

    const handleType = () => {
        const fullText = text;
        const updatedText = isDeleting
            ? fullText.substring(0, displayText.length - 1)
            : fullText.substring(0, displayText.length + 1);

        setDisplayText(updatedText);

        if (!isDeleting && updatedText === fullText) {
            setTypingSpeed(2000); // Pause at end
            setIsDeleting(true);
        } else if (isDeleting && updatedText === '') {
            setIsDeleting(false);
            setLoopNum(loopNum + 1);
            setTypingSpeed(500);
        } else {
            setTypingSpeed(isDeleting ? 100 : 150);
        }
    };

    return (
        <div className="flex justify-center items-center h-10 w-full overflow-hidden px-2">
            <span className="text-blue-500 font-mono text-[10px] sm:text-base md:text-2xl 3xl:text-3xl uppercase tracking-widest md:tracking-[0.5rem] font-bold border-r-2 border-blue-500 animate-pulse pr-1 sm:pr-2 whitespace-nowrap">
                {displayText}
            </span>
        </div>
    );
};

export default function Hero() {
    const { displayText: displayName, scramble: scrambleName } = useTextScramble('CHAMIKA');
    const { displayText: displaySurname, scramble: scrambleSurname } = useTextScramble('SHASHIPRIYA');

    return (
        <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
            <span aria-hidden="true" className="pointer-events-none select-none absolute top-8 right-6 font-black text-white opacity-[0.03] text-[8rem] sm:text-[10rem] md:text-[14rem] lg:text-[18rem] leading-none tracking-tighter">01</span>
            <Hero3D />
            <StarField count={120} />

            {/* Film grain texture — premium editorial feel */}
            <div
                aria-hidden="true"
                className="hero-grain absolute inset-0 pointer-events-none opacity-[0.035]"
                style={{ zIndex: 3 }}
            />

            {/* Radar scan line — sweeps once on page load */}
            <motion.div
                aria-hidden="true"
                className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
                style={{
                    zIndex: 4,
                    background: 'linear-gradient(to right, transparent 0%, transparent 15%, rgba(59,130,246,0.9) 45%, rgba(103,232,249,0.6) 55%, transparent 85%, transparent 100%)',
                    boxShadow: '0 0 8px rgba(59,130,246,0.6), 0 0 24px rgba(59,130,246,0.25)',
                }}
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: '100vh', opacity: [0, 1, 1, 1, 0] }}
                transition={{
                    duration: 2.5,
                    delay: 0.8,
                    ease: 'linear',
                    opacity: { times: [0, 0.03, 0.5, 0.88, 1], ease: 'linear' },
                }}
            />
            <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">

                <div className="flex flex-col items-center">
                    {/* CHAMIKA — letter-by-letter stagger slide-up */}
                    <h1
                        onMouseEnter={scrambleName}
                        aria-label="CHAMIKA"
                        className="text-[2.5rem] sm:text-6xl md:text-7xl lg:text-8xl xl:text-8xl 2xl:text-9xl 5xl:text-[10rem] 2k:text-[12rem] 5k:text-[15rem] font-black text-white tracking-tighter mb-4 leading-[1.1] w-full cursor-default"
                    >
                        {'CHAMIKA'.split('').map((letter, i) => (
                            <span
                                key={i}
                                className="inline-block overflow-hidden"
                                style={{ verticalAlign: 'bottom', lineHeight: 'inherit' }}
                            >
                                <motion.span
                                    className="inline-block"
                                    initial={{ y: '110%', opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{
                                        delay: 0.15 + i * 0.07,
                                        duration: 0.75,
                                        ease: [0.16, 1, 0.3, 1],
                                    }}
                                >
                                    {displayName[i] ?? letter}
                                </motion.span>
                            </span>
                        ))}
                    </h1>

                    {/* SHASHIPRIYA — left-to-right clip wipe (preserves animated gradient) */}
                    <motion.h1
                        onMouseEnter={scrambleSurname}
                        initial={{ clipPath: 'inset(0 100% 0 0)' }}
                        animate={{ clipPath: 'inset(0 0% 0 0)' }}
                        transition={{ delay: 0.75, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        className="text-[2.5rem] sm:text-6xl md:text-7xl lg:text-8xl xl:text-8xl 2xl:text-9xl 5xl:text-[10rem] 2k:text-[12rem] 5k:text-[15rem] font-black tracking-tighter mb-4 leading-[1.1] w-full break-words cursor-default text-gradient-animated"
                    >
                        {displaySurname}
                    </motion.h1>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="mb-10 md:mb-12"
                >
                    <Typewriter text="Full-Stack Web Developer" delay={0.5} />
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="max-w-xl md:max-w-2xl 3xl:max-w-3xl text-gray-400 text-base md:text-xl 3xl:text-2xl mb-12 leading-relaxed px-4"
                >
                    Hello! I&apos;m Chamika Shashipriya, a passionate Full-Stack Developer
                    dedicated to building modern, scalable, and user-friendly web applications.
                    With a strong foundation in JavaScript, React.js, Node.js, and the MERN stack,
                    I love turning ideas into reality through code.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-[280px] sm:max-w-none mx-auto"
                >
                    <a href="#projects" className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-full font-bold overflow-hidden transition-all hover:bg-blue-700 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] flex justify-center items-center text-sm sm:text-base">
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            View Projects <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </span>
                    </a>

                    <a
                        href="/resume.pdf"
                        download="Chamika_Shashipriya_CV.pdf"
                        className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 glassmorphism text-white rounded-full font-bold transition-all hover:bg-white/10 flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                        Download CV <HiDownload />
                    </a>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="mt-16 flex items-center gap-6"
                >
                    {/* GitHub — white glow */}
                    <a
                        href="https://github.com/ChamikaShashipriya99"
                        target="_blank" rel="noopener noreferrer"
                        aria-label="GitHub"
                        className="text-gray-500 text-2xl transition-all duration-300 hover:scale-125 hover:text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.55)]"
                    >
                        <FaGithub />
                    </a>
                    {/* LinkedIn — brand blue glow */}
                    <a
                        href="https://www.linkedin.com/in/chamika-shashipriya-722366321"
                        target="_blank" rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        className="text-gray-500 text-2xl transition-all duration-300 hover:scale-125 hover:text-[#0a66c2] hover:drop-shadow-[0_0_10px_rgba(10,102,194,0.8)]"
                    >
                        <FaLinkedin />
                    </a>
                    {/* WhatsApp — brand green glow */}
                    <a
                        href="https://wa.me/94750471511"
                        target="_blank" rel="noopener noreferrer"
                        aria-label="WhatsApp"
                        className="text-gray-500 text-2xl transition-all duration-300 hover:scale-125 hover:text-[#25d366] hover:drop-shadow-[0_0_10px_rgba(37,211,102,0.8)]"
                    >
                        <FaWhatsapp />
                    </a>
                </motion.div>
            </div>

            {/* Scroll indicator — animated dot + label */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6, duration: 0.8 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-50 hover:opacity-90 transition-opacity cursor-pointer group"
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            >
                <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center pt-1.5 group-hover:border-blue-400/80 transition-colors">
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-1 h-2.5 bg-white rounded-full group-hover:bg-blue-400 transition-colors"
                    />
                </div>
                <span className="text-white/50 text-[8px] font-mono uppercase tracking-[0.5em] group-hover:text-blue-400/80 transition-colors">
                    Scroll
                </span>
            </motion.div>
        </section>
    );
}
