'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Download, Pause, Play, UserRoundPlus } from 'lucide-react';

const portfolio = 'https://chamika-shashipriya.vercel.app/';

export default function BusinessCard() {
    const [back, setBack] = useState(false);
    const [automatic, setAutomatic] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [focused, setFocused] = useState(false);
    const section = useRef<HTMLElement>(null);
    const visible = useInView(section, { amount: 0.2 });
    const reducedMotion = useReducedMotion();
    useEffect(() => {
        if (!automatic || hovered || focused || !visible || reducedMotion) return;
        const timer = window.setInterval(() => setBack(value => !value), 6000);
        return () => window.clearInterval(timer);
    }, [automatic, hovered, focused, visible, reducedMotion]);
    const chooseSide = (value: boolean) => { setAutomatic(false); setBack(value); };
    const focusClass = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-4';
    return <section ref={section} id="business-card" aria-labelledby="business-card-title" className="py-12 sm:py-16 relative overflow-hidden">
        <span aria-hidden="true" className="absolute bottom-8 right-6 text-[10rem] lg:text-[18rem] font-black leading-none text-white/[0.03] pointer-events-none">09</span>
        <div className="container mx-auto px-6 relative max-w-6xl">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-blue-400 mb-3">Keep in touch</p>
            <h2 id="business-card-title" className="text-3xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-tight">Digital <span className="text-blue-500">Business Card</span></h2>
            <div className="w-24 h-1 bg-blue-600 rounded-full mt-4" />
            <p className="text-sm sm:text-base text-gray-400 max-w-xl leading-relaxed mt-5 mb-10">Save my contact details, download either side of the card, or scan the QR code to open my portfolio.</p>
            <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 items-start">
                <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }} className="min-w-0 flex flex-col items-center">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-4">One card · profile front / contact back</p>
                    <button type="button" onClick={() => chooseSide(!back)} aria-label={back ? 'Show front of business card' : 'Show back of business card'} aria-describedby="business-card-flip-help" className={`block relative w-[210px] sm:w-[280px] max-w-full aspect-[4/7] rounded-2xl ${focusClass}`} style={{ perspective: '1200px' }}>
                        <motion.span className="absolute inset-0 block" initial={false} animate={{ rotateY: back ? 180 : 0 }} transition={{ duration: reducedMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }} style={{ transformStyle: 'preserve-3d' }}>
                            <span aria-hidden={back} className="absolute inset-0 block rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-neutral-950" style={{ backfaceVisibility: 'hidden' }}>
                                <Image src="/contact/business-card-front.webp" alt="Profile artwork: Chamika, Full Stack Developer" fill sizes="(min-width: 640px) 280px, 210px" className="object-contain" />
                            </span>
                            <span aria-hidden={!back} className="absolute inset-0 block rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-neutral-950" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                                <Image src="/contact/business-card-back.png" alt="Contact side with email, separate call and WhatsApp numbers, and portfolio QR code" fill sizes="(min-width: 640px) 280px, 210px" className="object-contain" />
                            </span>
                        </motion.span>
                    </button>
                    <p id="business-card-flip-help" className="text-xs text-gray-500 mt-4">Tap the card, or use the buttons below to flip it.</p>
                    <div role="group" aria-label="Card side" className="flex gap-2 mt-4">
                        {[{ value: false, label: 'Show front' }, { value: true, label: 'Show back' }].map(option => <button key={option.label} type="button" aria-pressed={back === option.value} onClick={() => chooseSide(option.value)} className={`rounded-xl px-4 py-2.5 border text-xs ${back === option.value ? 'border-blue-400/40 bg-blue-500/10 text-blue-200' : 'border-white/10 text-gray-400 hover:text-white'} ${focusClass}`}>{option.label}</button>)}
                    </div>
                    <button type="button" disabled={!!reducedMotion} aria-pressed={automatic} onClick={() => setAutomatic(value => !value)} className={`flex items-center gap-2 mt-4 px-3 py-2.5 rounded-lg text-xs text-gray-400 hover:text-white disabled:opacity-60 ${focusClass}`}>{automatic ? <Pause size={13} /> : <Play size={13} />}{reducedMotion ? 'Automatic motion disabled' : automatic ? 'Turn auto-flip off' : 'Turn auto-flip on'}</button>
                    <p className="text-[11px] text-gray-600 text-center max-w-xs leading-relaxed mt-1">Optional auto-flip pauses on hover and keyboard focus. Manual flipping turns it off.</p>
                    <span role="status" className="sr-only">{back ? 'Contact side shown.' : 'Profile side shown.'}</span>
                    <div className="flex flex-wrap justify-center gap-4 mt-5">
                        <a href="/images/business-card-left.png" download="Chamika-Shashipriya-Card-Front.png" className={`inline-flex items-center gap-1.5 rounded text-xs text-blue-300 hover:text-white ${focusClass}`}><Download size={13} aria-hidden="true" />Download front</a>
                        <a href="/contact/business-card-back.png" download="Chamika-Shashipriya-Card-Back.png" className={`inline-flex items-center gap-1.5 rounded text-xs text-blue-300 hover:text-white ${focusClass}`}><Download size={13} aria-hidden="true" />Download back</a>
                    </div>
                </div>
                <div className="min-w-0 space-y-7">
                    <div><h3 className="text-2xl text-white font-semibold">Chamika Shashipriya</h3><p className="text-sm text-blue-300 mt-2">Full-Stack Web Developer · Sri Lanka</p></div>
                    <dl className="divide-y divide-white/10 border-y border-white/10">
                        {[
                            { label: 'Email', value: 'chamikashashipriya3@gmail.com', href: 'mailto:chamikashashipriya3@gmail.com' },
                            { label: 'Calls', value: '+94 70 412 0358', href: 'tel:+94704120358' },
                            { label: 'WhatsApp · separate number', value: '+94 75 047 1511', href: 'https://wa.me/94750471511' },
                            { label: 'Portfolio', value: 'chamika-shashipriya.vercel.app', href: portfolio },
                        ].map(item => <div key={item.label} className="py-4"><dt className="text-[10px] font-mono tracking-widest uppercase text-gray-500">{item.label}</dt><dd className="mt-1.5 text-sm text-gray-200"><a href={item.href} className={`break-all hover:text-blue-300 rounded ${focusClass}`}>{item.value}</a></dd></div>)}
                    </dl>
                    <div><a href="/contact/chamika-shashipriya.vcf" download="Chamika-Shashipriya.vcf" className={`inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-3 text-sm font-semibold text-white ${focusClass}`}><UserRoundPlus size={17} aria-hidden="true" />Save contact (.vcf)</a><p className="text-xs text-gray-500 leading-relaxed mt-3">Download and open the vCard in your contacts app. Includes email, your call number, portfolio, and the separate WhatsApp contact.</p></div>
                    <div className="flex flex-col sm:flex-row items-start gap-5 rounded-2xl border border-white/10 bg-neutral-950/50 p-5">
                        <a href={portfolio} aria-label="Open Chamika’s portfolio" className={`block shrink-0 rounded-lg bg-white p-1 ${focusClass}`}><img src="/contact/portfolio-qr.svg" alt="QR code linking to https://chamika-shashipriya.vercel.app/" width={148} height={148} loading="lazy" className="block w-[148px] h-[148px]" /></a>
                        <div className="min-w-0"><h4 className="text-sm font-semibold text-white">Scan to open my portfolio</h4><p className="text-xs text-gray-500 leading-relaxed mt-2">Point your phone’s camera at the code. It links directly to the live website.</p><a href="/contact/portfolio-qr.svg" download="Chamika-Portfolio-QR.svg" className={`inline-flex items-center gap-1.5 text-xs text-blue-300 hover:text-white rounded mt-4 ${focusClass}`}><Download size={13} aria-hidden="true" />Download QR code</a><a href={portfolio} className={`flex items-center gap-1.5 mt-3 text-xs text-gray-400 hover:text-white rounded ${focusClass}`}>Open portfolio <ArrowUpRight size={13} aria-hidden="true" /></a></div>
                    </div>
                </div>
            </div>
        </div>
    </section>;
}
