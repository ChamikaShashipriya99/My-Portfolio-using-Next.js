'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { HiMenuAlt3, HiX } from 'react-icons/hi';

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

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                'fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-[90%] md:w-auto',
                isScrolled ? 'top-4' : 'top-8'
            )}
        >
            <div className="glassmorphism rounded-full px-6 py-3 3xl:px-10 3xl:py-5 flex items-center justify-between gap-8 md:gap-12 3xl:gap-20 border border-white/10 shadow-2xl">
                <a href="#home" className="text-white text-xl md:text-2xl 3xl:text-4xl font-cursive hover:text-blue-400 transition-colors cursor-pointer whitespace-nowrap">
                    Chamika<span className="text-blue-500">.</span>Shashipriya
                </a>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-6 lg:gap-8 3xl:gap-12">
                    {navItems.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            onClick={() => setActiveTab(item.name)}
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
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <HiX /> : <HiMenuAlt3 />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="absolute top-20 left-0 right-0 glassmorphism rounded-3xl p-6 flex flex-col gap-4 border border-white/10 md:hidden"
                    >
                        {navItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                onClick={() => {
                                    setActiveTab(item.name);
                                    setMobileMenuOpen(false);
                                }}
                                className={cn(
                                    'text-lg font-medium py-2 border-b border-white/5',
                                    activeTab === item.name ? 'text-blue-400' : 'text-gray-300'
                                )}
                            >
                                {item.name}
                            </a>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
