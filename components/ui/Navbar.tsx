import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { FaGithub, FaLinkedin, FaWhatsapp, FaDownload } from 'react-icons/fa';
import { useLenis } from 'lenis/react';

const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Home');
    const lenis = useLenis();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (mobileMenuOpen) {
            lenis?.stop();
        } else {
            lenis?.start();
        }
    }, [mobileMenuOpen, lenis]);

    // Scroll Spy Logic
    const syncActiveTab = () => {
        const sections = navItems.map(item => {
            const el = document.querySelector(item.href);
            return {
                name: item.name,
                offset: el ? el.getBoundingClientRect().top : Infinity,
            };
        });

        // Find the section that is currently most visible in the viewport
        // We look for the last section whose top is less than or equal to a threshold
        const threshold = 160;
        const currentSection = sections.reduce((acc, section) => {
            if (section.offset <= threshold) return section.name;
            return acc;
        }, 'Home');

        if (currentSection !== activeTab) {
            setActiveTab(currentSection);
        }
    };

    useLenis(({ scroll }) => {
        syncActiveTab();
    });

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        // Initial sync on mount
        syncActiveTab();

        // Periodically sync for a short bit to handle async rendered components like Projects
        const interval = setInterval(syncActiveTab, 500);
        const timeout = setTimeout(() => clearInterval(interval), 3000);

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, []);

    const handleNavClick = (e: React.MouseEvent, href: string, name: string) => {
        e.preventDefault();
        
        // Close menu immediately for feedback
        setMobileMenuOpen(false);
        
        // Small delay to allow the menu to start closing before scrolling
        setTimeout(() => {
            if (lenis) {
                lenis.scrollTo(href, {
                    offset: -100,
                    duration: 1.5,
                });
            } else {
                // Fallback to native scroll if lenis is not available
                const element = document.querySelector(href);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
            setActiveTab(name);
        }, 300);
    };

    return (
        <>
            <nav
                className={cn(
                    'fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-[90%] md:w-auto',
                    isScrolled ? 'top-2 sm:top-4' : 'top-4 sm:top-8'
                )}
            >
                <div className={cn(
                    "rounded-full px-4 sm:px-6 py-2 sm:py-3 3xl:px-10 3xl:py-5 flex items-center justify-between gap-4 sm:gap-8 md:gap-12 3xl:gap-20 border transition-all duration-500 w-full",
                    isScrolled 
                        ? "bg-black/40 backdrop-blur-xl border-white/10 shadow-2xl" 
                        : "bg-black/10 backdrop-blur-md border-white/5"
                )}>
                    <a
                        href="#home"
                        onClick={(e) => handleNavClick(e, '#home', 'Home')}
                        className="text-white text-xl md:text-2xl 3xl:text-4xl font-cursive hover:text-blue-400 transition-colors cursor-pointer whitespace-nowrap"
                    >
                        Chamika<span className="text-blue-500">.</span>Shashipriya
                    </a>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6 lg:gap-8 3xl:gap-12">
                        {navItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                onClick={(e) => handleNavClick(e, item.href, item.name)}
                                className={cn(
                                    'text-sm 3xl:text-xl font-bold uppercase tracking-widest transition-colors relative px-2 py-1',
                                    activeTab === item.name ? 'text-white' : 'text-gray-500 hover:text-white font-medium'
                                )}
                            >
                                {item.name}
                                {activeTab === item.name && (
                                    <motion.div
                                        layoutId="active-tab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </a>
                        ))}
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden text-white text-2xl"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <HiMenuAlt3 />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Backdrop & Sidebar */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] md:hidden"
                        />

                        {/* Sidebar */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            onClick={(e) => e.stopPropagation()}
                            className="fixed top-0 left-0 bottom-0 w-[85%] max-w-[340px] bg-[#050505] z-[101] p-8 flex flex-col border-r border-white/10 md:hidden shadow-[20px_0_50px_rgba(0,0,0,0.8)] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-10">
                                <motion.span 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-white text-2xl font-cursive"
                                >
                                    Chamika<span className="text-blue-500">.</span>S
                                </motion.span>
                                <button 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-white text-2xl hover:text-blue-500 transition-colors p-2"
                                >
                                    <HiX />
                                </button>
                            </div>

                            <div className="flex flex-col gap-2">
                                {navItems.map((item, index) => (
                                    <motion.div
                                        key={item.name}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 + index * 0.1 }}
                                    >
                                        <a
                                            href={item.href}
                                            onClick={(e) => handleNavClick(e, item.href, item.name)}
                                            className={cn(
                                                'text-lg font-bold uppercase tracking-[0.2em] transition-all relative px-4 py-4 rounded-xl flex items-center group',
                                                activeTab === item.name ? 'text-white bg-blue-500/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            )}
                                        >
                                            <span className="relative z-10">{item.name}</span>
                                            {activeTab === item.name && (
                                                <motion.div
                                                    layoutId="active-tab-mobile"
                                                    className="absolute left-0 w-1 h-8 bg-blue-500 rounded-full"
                                                />
                                            )}
                                        </a>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="mt-10"
                            >
                                <a 
                                    href="/resume.pdf" 
                                    download="Chamika_Shashipriya_CV.pdf"
                                    target="_blank"
                                    className="w-full flex items-center justify-center gap-3 py-4 bg-blue-600 text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                                >
                                    <FaDownload /> Download CV
                                </a>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                                className="mt-auto pt-10"
                            >
                                <div className="space-y-6">
                                    <div className="flex flex-col gap-2">
                                        <p className="text-gray-600 text-[10px] uppercase tracking-[0.4em] font-mono font-bold">Get in Touch</p>
                                        <a href="mailto:chamikashashipriya3@gmail.com" className="text-gray-400 hover:text-white transition-colors text-sm font-medium truncate">
                                            chamikashashipriya3@gmail.com
                                        </a>
                                    </div>

                                    <div className="flex items-center gap-6 pt-2">
                                        <a href="https://github.com/ChamikaShashipriya99" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-all transform hover:scale-125 text-2xl">
                                            <FaGithub />
                                        </a>
                                        <a href="https://www.linkedin.com/in/chamika-shashipriya-722366321" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-all transform hover:scale-125 text-2xl">
                                            <FaLinkedin />
                                        </a>
                                        <a href="https://wa.me/94750471511" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-all transform hover:scale-125 text-2xl">
                                            <FaWhatsapp />
                                        </a>
                                    </div>

                                    <div className="pt-6 border-t border-white/5">
                                        <p className="text-gray-700 text-[9px] uppercase tracking-[0.3em] font-mono leading-relaxed">
                                            © {new Date().getFullYear()} C. Shashipriya <br/> 
                                            <span className="text-blue-500/30">Based in Sri Lanka</span>
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
