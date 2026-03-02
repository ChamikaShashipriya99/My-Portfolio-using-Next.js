'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard';
import emailjs from '@emailjs/browser';
import { HiMail, HiUser, HiChatAlt2, HiPaperAirplane } from 'react-icons/hi';

export default function Contact() {
    const formRef = useRef<HTMLFormElement>(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<null | 'success' | 'error'>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Note: User needs to provide their own EmailJS IDs in production
            // For now, this is set up for the user to fill in
            // await emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formRef.current!, 'YOUR_PUBLIC_KEY');

            // Simulating success for the demo
            await new Promise(resolve => setTimeout(resolve, 1500));
            setStatus('success');
            formRef.current?.reset();
        } catch (error) {
            setStatus('error');
        } finally {
            setLoading(false);
            setTimeout(() => setStatus(null), 5000);
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
                        <div className="space-y-4">
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
                                    <div className="text-white font-medium md:text-lg 3xl:text-2xl">your@email.com</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 group">
                                <div className="w-14 h-14 3xl:w-20 3xl:h-20 rounded-2xl glassmorphism flex items-center justify-center text-blue-500 group-hover:scale-110 group-hover:bg-blue-500/10 transition-all duration-500">
                                    <HiChatAlt2 className="text-2xl 3xl:text-4xl" />
                                </div>
                                <div>
                                    <div className="text-[10px] 3xl:text-xs text-gray-500 uppercase tracking-[0.3em] mb-1 font-bold">Location</div>
                                    <div className="text-white font-medium md:text-lg 3xl:text-2xl">Sri Lanka (Worldwide Ready)</div>
                                </div>
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
                                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-green-500 text-center font-bold mt-4 uppercase tracking-widest text-xs">
                                    Mainframe received your transmission!
                                </motion.p>
                            )}
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
