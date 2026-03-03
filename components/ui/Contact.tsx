'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard';
import emailjs from '@emailjs/browser';
import { HiMail, HiUser, HiChatAlt2, HiPaperAirplane, HiPhone, HiCheckCircle, HiExclamationCircle } from 'react-icons/hi';
import { FaWhatsapp, FaGithub, FaLinkedin } from 'react-icons/fa';

export default function Contact() {
    const formRef = useRef<HTMLFormElement>(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<null | 'success' | 'error'>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(formRef.current!);
        const email = formData.get('user_email') as string;

        // Enhanced Validation for email format
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setStatus('error');
            setTimeout(() => setStatus(null), 5000);
            return;
        }

        setLoading(true);

        try {
            await emailjs.sendForm(
                'service_mz488cd',
                'template_j1ia91i',
                formRef.current!,
                'PNeYKrOGJd3zQ3U-U'
            );

            setStatus('success');
            formRef.current?.reset();
        } catch (error) {
            console.error('EmailJS Error:', error);
            setStatus('error');
        } finally {
            setLoading(false);
            setTimeout(() => setStatus(null), 6000);
        }
    };

    return (
        <section id="contact" className="py-24 5xl:py-48 relative">
            <div className="container mx-auto px-6 max-w-5xl 3xl:max-w-7xl">
                <div className="grid md:grid-cols-2 gap-16 xl:gap-24">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-12"
                    >
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] 3xl:text-xs font-mono uppercase tracking-widest"
                            >
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                Open to Work
                            </motion.div>
                            <h2 className="text-3xl sm:text-5xl lg:text-6xl 3xl:text-7xl font-black text-white tracking-tighter uppercase leading-tight">
                                Let&apos;s Build <br />
                                <span className="text-blue-500">Something New</span>
                            </h2>
                            <div className="h-1.5 w-24 bg-blue-600 rounded-full" />
                            <p className="text-gray-500 font-mono text-xs md:text-sm 3xl:text-lg uppercase tracking-[0.4em] mt-6">Get in touch for collaborations</p>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-center gap-6 group">
                                <div className="w-14 h-14 3xl:w-20 3xl:h-20 rounded-2xl glassmorphism flex items-center justify-center text-blue-500 group-hover:scale-110 group-hover:bg-blue-500/10 transition-all duration-500">
                                    <HiMail className="text-2xl 3xl:text-4xl" />
                                </div>
                                <div>
                                    <div className="text-[10px] 3xl:text-xs text-gray-500 uppercase tracking-[0.3em] mb-1 font-bold">Email Me</div>
                                    <a href="mailto:chamikashashipriya3@gmail.com" className="text-white font-medium md:text-lg 3xl:text-2xl hover:text-blue-400 transition-colors">chamikashashipriya3@gmail.com</a>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 group">
                                <div className="w-14 h-14 3xl:w-20 3xl:h-20 rounded-2xl glassmorphism flex items-center justify-center text-blue-500 group-hover:scale-110 group-hover:bg-blue-500/10 transition-all duration-500">
                                    <HiPhone className="text-2xl 3xl:text-4xl" />
                                </div>
                                <div>
                                    <div className="text-[10px] 3xl:text-xs text-gray-500 uppercase tracking-[0.3em] mb-1 font-bold">Call Me</div>
                                    <a href="tel:0704120358" className="text-white font-medium md:text-lg 3xl:text-2xl hover:text-blue-400 transition-colors">0704120358</a>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 group">
                                <div className="w-14 h-14 3xl:w-20 3xl:h-20 rounded-2xl glassmorphism flex items-center justify-center text-blue-500 group-hover:scale-110 group-hover:bg-blue-500/10 transition-all duration-500">
                                    <HiChatAlt2 className="text-2xl 3xl:text-4xl" />
                                </div>
                                <div>
                                    <div className="text-[10px] 3xl:text-xs text-gray-500 uppercase tracking-[0.3em] mb-1 font-bold">Location</div>
                                    <div className="text-white font-medium md:text-lg 3xl:text-2xl">Ambalangoda & Malabe, Sri Lanka</div>
                                </div>
                            </div>

                            {/* Social Icons Row */}
                            <div className="flex items-center gap-4 pt-4">
                                <a href="https://wa.me/94750471511" target="_blank" rel="noopener noreferrer" className="w-14 h-14 3xl:w-20 3xl:h-20 rounded-2xl glassmorphism flex items-center justify-center text-green-500 hover:scale-110 hover:bg-green-500/10 transition-all duration-500" title="WhatsApp">
                                    <FaWhatsapp className="text-2xl 3xl:text-4xl" />
                                </a>
                                <a href="https://www.linkedin.com/in/chamika-shashipriya-722366321" target="_blank" rel="noopener noreferrer" className="w-14 h-14 3xl:w-20 3xl:h-20 rounded-2xl glassmorphism flex items-center justify-center text-blue-400 hover:scale-110 hover:bg-blue-400/10 transition-all duration-500" title="LinkedIn">
                                    <FaLinkedin className="text-2xl 3xl:text-4xl" />
                                </a>
                                <a href="https://github.com/ChamikaShashipriya99" target="_blank" rel="noopener noreferrer" className="w-14 h-14 3xl:w-20 3xl:h-20 rounded-2xl glassmorphism flex items-center justify-center text-gray-400 hover:scale-110 hover:bg-white/10 transition-all duration-500" title="GitHub">
                                    <FaGithub className="text-2xl 3xl:text-4xl" />
                                </a>
                            </div>
                        </div>

                        <GlassCard className="!p-8 3xl:!p-12 bg-blue-600/5 group hover:bg-blue-600/10 border-blue-500/10" hoverScale={false}>
                            <p className="text-gray-400 text-sm md:text-base 3xl:text-xl leading-relaxed opacity-80">
                                Currently looking for new opportunities and interesting projects. If you have a project that needs a futuristic touch, reach out!
                            </p>
                        </GlassCard>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                            <div className="relative group">
                                <HiUser className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors text-lg" />
                                <input
                                    required
                                    type="text"
                                    name="user_name"
                                    placeholder="Your Name"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white focus:outline-none focus:border-blue-500 focus:bg-white/[0.07] transition-all placeholder:text-gray-600 3xl:text-xl 3xl:py-8"
                                />
                            </div>

                            <div className="relative group">
                                <HiMail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors text-lg" />
                                <input
                                    required
                                    type="email"
                                    name="user_email"
                                    placeholder="Email Address"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white focus:outline-none focus:border-blue-500 focus:bg-white/[0.07] transition-all placeholder:text-gray-600 3xl:text-xl 3xl:py-8"
                                />
                            </div>

                            <div className="relative group">
                                <textarea
                                    required
                                    name="message"
                                    rows={6}
                                    placeholder="Tell me about your project..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white focus:outline-none focus:border-blue-500 focus:bg-white/[0.07] transition-all placeholder:text-gray-600 resize-none 3xl:text-xl 3xl:py-8"
                                />
                            </div>

                            <button
                                disabled={loading}
                                type="submit"
                                className="w-full group relative py-6 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm 3xl:text-xl flex items-center justify-center gap-3 overflow-hidden hover:bg-blue-700 transition-all disabled:opacity-50 shadow-xl shadow-blue-600/20 active:scale-[0.98]"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Transmit Message <HiPaperAirplane className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            {status === 'success' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 flex items-center gap-4 mt-4"
                                >
                                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 shrink-0">
                                        <HiCheckCircle className="text-2xl" />
                                    </div>
                                    <div>
                                        <h5 className="text-white font-bold uppercase tracking-wider text-sm mb-1">Transmission Successful!</h5>
                                        <p className="text-gray-400 text-xs 3xl:text-sm leading-relaxed">The mainframe has received your message. I&apos;ll get back to you soon!</p>
                                    </div>
                                </motion.div>
                            )}

                            {status === 'error' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex items-center gap-4 mt-4"
                                >
                                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 shrink-0">
                                        <HiExclamationCircle className="text-2xl" />
                                    </div>
                                    <div>
                                        <h5 className="text-white font-bold uppercase tracking-wider text-sm mb-1">Transmission Warning</h5>
                                        <p className="text-gray-400 text-xs 3xl:text-sm leading-relaxed">Please verify your email format or check your connection and try again.</p>
                                    </div>
                                </motion.div>
                            )}
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
