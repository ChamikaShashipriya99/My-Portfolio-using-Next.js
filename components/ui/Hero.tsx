'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HiDownload, HiArrowRight } from 'react-icons/hi';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

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
        <div className="flex justify-center items-center h-10">
            <span className="text-blue-500 font-mono text-base md:text-2xl 3xl:text-3xl uppercase tracking-[0.3rem] md:tracking-[0.5rem] font-bold border-r-2 border-blue-500 animate-pulse pr-2">
                {displayText}
            </span>
        </div>
    );
};

export default function Hero() {
    return (
        <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
            <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl 3xl:text-9xl 5xl:text-[10rem] font-black text-white tracking-tighter mb-4 leading-none"
                >
                    CHAMIKA <br />
                    <span className="text-gradient">SHASHIPRIYA</span>
                </motion.h1>

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
                    className="flex flex-col sm:flex-row items-center gap-4"
                >
                    <a href="#projects" className="group relative px-8 py-4 bg-blue-600 text-white rounded-full font-bold overflow-hidden transition-all hover:bg-blue-700 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] block text-center">
                        <span className="relative z-10 flex items-center gap-2">
                            View Projects <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </span>
                    </a>

                    <button className="group px-8 py-4 glassmorphism text-white rounded-full font-bold transition-all hover:bg-white/10 flex items-center gap-2">
                        Download CV <HiDownload />
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="mt-16 flex items-center gap-6"
                >
                    <a href="https://github.com/ChamikaShashipriya99" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors text-2xl hover:scale-110">
                        <FaGithub />
                    </a>
                    <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors text-2xl hover:scale-110">
                        <FaLinkedin />
                    </a>
                    <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors text-2xl hover:scale-110">
                        <FaTwitter />
                    </a>
                </motion.div>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
                <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center p-1">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
            </div>
        </section>
    );
}
