import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { HiMenuAlt3, HiX, HiTerminal } from 'react-icons/hi';
import { FaGithub, FaLinkedin, FaWhatsapp, FaDownload } from 'react-icons/fa';
import { useLenis } from 'lenis/react';

const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Activity', href: '#skyline' },
    { name: 'Experience', href: '#experience' },
    { name: 'Contact', href: '#contact' },
    { name: 'Arcade', href: '#arcade' },
    { name: 'Card', href: '#business-card' },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Home');
    const lenis = useLenis();
    const navRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (mobileMenuOpen) lenis?.stop();
        else lenis?.start();
    }, [mobileMenuOpen, lenis]);

    const syncActiveTab = useCallback(() => {
        setIsScrolled(window.scrollY > 50);
        const navBottom = navRef.current?.getBoundingClientRect().bottom ?? 80;
        const marker = Math.min(window.innerHeight * 0.5, navBottom + 48);
        const sections = Array.from(document.querySelectorAll<HTMLElement>('main section'));
        const current = sections.find(section => {
            const bounds = section.getBoundingClientRect();
            return bounds.height > 0 && bounds.top <= marker && bounds.bottom > marker;
        });
        const name = current ? navItems.find(item => item.href === '#' + current.id)?.name ?? '' : 'Home';
        setActiveTab(previous => previous === name ? previous : name);
    }, []);

    useLenis(syncActiveTab);

    useEffect(() => {
        let frame = 0;
        const scheduleSync = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(syncActiveTab);
        };
        const observer = new ResizeObserver(scheduleSync);
        document.querySelectorAll('main, main section').forEach(element => observer.observe(element));
        // Lazy-loaded sections can change the section under the navigation.
        const mutations = new MutationObserver(scheduleSync);
        const main = document.querySelector('main');
        if (main) mutations.observe(main, { childList: true, subtree: true });
        window.addEventListener('scroll', scheduleSync, { passive: true });
        window.addEventListener('resize', scheduleSync);
        window.addEventListener('hashchange', scheduleSync);
        scheduleSync();
        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
            mutations.disconnect();
            window.removeEventListener('scroll', scheduleSync);
            window.removeEventListener('resize', scheduleSync);
            window.removeEventListener('hashchange', scheduleSync);
        };
    }, [syncActiveTab]);

    const handleNavClick = (e: React.MouseEvent, href: string, _name: string) => {
        e.preventDefault();
        
        // Close menu immediately for feedback
        setMobileMenuOpen(false);
        
        // Small delay to allow the menu to start closing before scrolling
        setTimeout(() => {
            if (lenis) {
                lenis.scrollTo(href, {
                    offset: -((navRef.current?.getBoundingClientRect().bottom ?? 80) + 16),
                    duration: 1.5,
                });
            } else {
                // Fallback to native scroll if lenis is not available
                const element = document.querySelector(href);
                if (element) {
                    window.scrollTo({ top: window.scrollY + element.getBoundingClientRect().top - (navRef.current?.getBoundingClientRect().bottom ?? 80) - 16, behavior: 'smooth' });
                }
            }
            window.history.replaceState(null, '', href);
            syncActiveTab();
        }, 300);
    };

    return (
        <>
            <nav ref={navRef} aria-label="Main navigation"
                className={cn('fixed inset-x-0 z-50 px-4 sm:px-6 lg:px-10 transition-all duration-300', isScrolled ? 'top-3' : 'top-5 sm:top-7')}>
                <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-3 lg:gap-5">
                    <a href="#home" onClick={e => handleNavClick(e, '#home', 'Home')}
                        className={cn('shrink-0 rounded-full border border-white/10 bg-black/70 backdrop-blur-2xl px-5 text-white font-cursive whitespace-nowrap hover:border-blue-500/40 hover:text-blue-300 transition-all duration-300 shadow-lg shadow-black/15 focus-visible:outline focus-visible:outline-blue-400', isScrolled ? 'py-2.5 text-xl' : 'py-3.5 text-xl xl:text-2xl')}>
                        Chamika<span className="text-blue-500">.</span>Shashipriya
                    </a>
                    <div className={cn('hidden 2xl:flex items-center justify-center gap-1 rounded-full border border-white/10 bg-black/70 backdrop-blur-2xl px-4 shadow-lg shadow-black/15 transition-all duration-300', isScrolled ? 'py-1.5' : 'py-2.5')}>
                        {navItems.map(item => <a key={item.name} href={item.href} aria-current={activeTab === item.name ? 'location' : undefined}
                            onClick={e => handleNavClick(e, item.href, item.name)}
                            className={cn('relative px-3 py-3 text-[11px] font-bold uppercase tracking-[0.12em] transition-colors rounded focus-visible:outline focus-visible:outline-blue-400', activeTab === item.name ? 'text-white' : 'text-gray-400 hover:text-white')}>
                            {item.name}
                            {activeTab === item.name && <motion.span layoutId="nav-underline" className="absolute bottom-1 left-3 right-3 h-[2px] rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.4)]" transition={{ type: 'spring', stiffness: 400, damping: 35 }} />}
                        </a>)}
                    </div>
                    <div className="flex items-center gap-2">
                        <button type="button" onClick={() => window.dispatchEvent(new CustomEvent('toggle-terminal'))} title="Open Developer Console (or press ~)" aria-label="Open developer console"
                            className="hidden 2xl:flex p-3 rounded-full border border-white/10 bg-black/70 backdrop-blur-2xl text-gray-400 hover:text-blue-300 hover:border-blue-500/40 transition-colors focus-visible:outline focus-visible:outline-blue-400"><HiTerminal size={18} /></button>
                        <a href="#contact" onClick={e => handleNavClick(e, '#contact', 'Contact')}
                            className={cn('hidden sm:inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-600 text-white px-5 text-xs font-semibold hover:bg-blue-500 transition-all duration-300 whitespace-nowrap focus-visible:outline focus-visible:outline-blue-300', isScrolled ? 'py-3' : 'py-4')}>Let’s talk <span aria-hidden="true">↗</span></a>
                        <button type="button" aria-label="Open navigation menu" aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen(true)} className="2xl:hidden p-3 rounded-full border border-white/10 bg-black/70 backdrop-blur-2xl text-white text-xl focus-visible:outline focus-visible:outline-blue-400"><HiMenuAlt3 /></button>
                    </div>
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
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] 2xl:hidden"
                        />

                        {/* Sidebar */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            onClick={(e) => e.stopPropagation()}
                            className="fixed top-0 left-0 bottom-0 w-[85%] max-w-[340px] bg-[#050505] z-[101] p-8 flex flex-col border-r border-white/10 2xl:hidden shadow-[20px_0_50px_rgba(0,0,0,0.8)] overflow-y-auto"
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
                                aria-current={activeTab === item.name ? 'location' : undefined}
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
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9 }}
                                className="mt-4"
                            >
                                <button 
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        window.dispatchEvent(new CustomEvent('toggle-terminal'));
                                    }}
                                    className="w-full flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all cursor-pointer"
                                >
                                    <HiTerminal className="text-base text-blue-400" /> Developer Console
                                </button>
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
