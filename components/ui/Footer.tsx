import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="py-24 5xl:py-48 border-t border-white/5 relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 xl:gap-24 3xl:gap-32 mb-24">
                    {/* Brand & Bio */}
                    <div className="col-span-1 md:col-span-2 space-y-8">
                        <div className="text-white font-black text-2xl 3xl:text-4xl tracking-tighter uppercase transition-all hover:scale-105 inline-block cursor-pointer">
                            CHAMIKA<span className="text-blue-500">.</span>DEV
                        </div>
                        <p className="text-gray-500 max-w-sm 3xl:max-w-xl leading-relaxed text-sm md:text-base 3xl:text-2xl opacity-70">
                            Designing and building immersive digital experiences that merge futuristic aesthetics with high-performance code.
                            Always pushing the boundaries of what&apos;s possible on the web.
                        </p>
                        <div className="flex items-center gap-8 pt-4">
                            <a href="https://github.com/ChamikaShashipriya99" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-all transform hover:scale-125 text-2xl 3xl:text-4xl">
                                <FaGithub />
                            </a>
                            <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-all transform hover:scale-125 text-2xl 3xl:text-4xl">
                                <FaLinkedin />
                            </a>
                            <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-all transform hover:scale-125 text-2xl 3xl:text-4xl">
                                <FaTwitter />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-8">
                        <h4 className="text-white font-black uppercase tracking-[0.3em] text-xs 3xl:text-lg opacity-50">Navigation</h4>
                        <ul className="space-y-4">
                            {['Home', 'About', 'Skills', 'Projects', 'Experience', 'Contact'].map((item) => (
                                <li key={item}>
                                    <a href={`#${item.toLowerCase()}`} className="text-gray-500 hover:text-blue-400 transition-colors text-sm 3xl:text-xl font-medium">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Details */}
                    <div className="space-y-8">
                        <h4 className="text-white font-black uppercase tracking-[0.3em] text-xs 3xl:text-lg opacity-50">Contact</h4>
                        <ul className="space-y-6">
                            <li className="text-sm 3xl:text-xl">
                                <span className="text-gray-600 block mb-2 uppercase text-[10px] 3xl:text-xs tracking-[0.4em] font-bold">Email</span>
                                <a href="mailto:chamikashashipriya3@gmail.com" className="text-gray-400 hover:text-white transition-colors font-medium">chamikashashipriya3@gmail.com</a>
                            </li>
                            <li className="text-sm 3xl:text-xl">
                                <span className="text-gray-600 block mb-2 uppercase text-[10px] 3xl:text-xs tracking-[0.4em] font-bold">Phone</span>
                                <span className="text-gray-400 font-medium">0704120358</span>
                            </li>
                            <li className="text-sm 3xl:text-xl">
                                <span className="text-gray-600 block mb-2 uppercase text-[10px] 3xl:text-xs tracking-[0.4em] font-bold">Location</span>
                                <span className="text-gray-400 font-medium">Ambalangoda & Malabe, Sri Lanka</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-gray-600 text-[10px] md:text-xs 3xl:text-lg font-mono tracking-[0.3em] uppercase">
                        &copy; {new Date().getFullYear()} Chamika.portfolio &bull; all rights reserved
                    </div>
                </div>
            </div>

            {/* Subtle Background Accent */}
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
        </footer>
    );
}
