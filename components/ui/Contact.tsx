'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Check, Copy, Github, Linkedin, Mail, MapPin, Phone, Send, X } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { contactLimits, validateContact, type ContactErrors, type ContactFields } from '@/lib/contact-validation';

const emailAddress = 'chamikashashipriya3@gmail.com';
const initialFields: ContactFields = { user_name: '', user_email: '', message: '' };
type Feedback = { kind: 'success' | 'error' | 'validation' | 'info'; text: string } | null;

export default function Contact() {
    const [fields, setFields] = useState<ContactFields>(initialFields);
    const [errors, setErrors] = useState<ContactErrors>({});
    const [feedback, setFeedback] = useState<Feedback>(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [copyFailed, setCopyFailed] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const honeyRef = useRef<HTMLInputElement>(null);
    const sending = useRef(false);
    const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const reducedMotion = useReducedMotion();
    useEffect(() => () => { if (copyTimer.current) clearTimeout(copyTimer.current); }, []);
    const copyEmail = async () => {
        try {
            await navigator.clipboard.writeText(emailAddress);
            setCopyFailed(false); setCopied(true);
            if (copyTimer.current) clearTimeout(copyTimer.current);
            copyTimer.current = setTimeout(() => setCopied(false), 3000);
        } catch { setCopyFailed(true); }
    };
    const change = (name: keyof ContactFields, value: string) => {
        setFields(previous => ({ ...previous, [name]: value }));
        setErrors(previous => ({ ...previous, [name]: undefined }));
    };
    const validated = () => {
        const next = validateContact(fields);
        setErrors(next);
        if (Object.keys(next).length) {
            setFeedback({ kind: 'validation', text: 'Please correct the highlighted fields before continuing.' });
            formRef.current?.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
            return null;
        }
        if (honeyRef.current?.value) {
            setFeedback({ kind: 'error', text: 'Unable to submit this form. Please use the email link instead.' });
            return null;
        }
        return { user_name: fields.user_name.trim(), user_email: fields.user_email.trim(), message: fields.message.trim() };
    };
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (sending.current) return;
        const values = validated();
        if (!values) return;
        sending.current = true; setLoading(true); setFeedback(null);
        try {
            const { default: emailjs } = await import('@emailjs/browser');
            await emailjs.send('service_mz488cd', 'template_j1ia91i', values, {
                publicKey: 'PNeYKrOGJd3zQ3U-U',
                limitRate: { id: 'portfolio-contact', throttle: 15000 },
            });
            setFeedback({ kind: 'success', text: 'Message sent successfully. Thank you for getting in touch.' });
            setFields(initialFields);
        } catch (error: unknown) {
            const status = error && typeof error === 'object' && 'status' in error ? Number(error.status) : 0;
            setFeedback({ kind: 'error', text: status === 429 ? 'Please wait at least 15 seconds before trying again. Your message is still here.' : 'Your message could not be sent. Your text has been kept—retry below or use your email app.' });
        } finally { sending.current = false; setLoading(false); }
    };
    const continueWhatsApp = () => {
        if (sending.current) return;
        const values = validated();
        if (!values) return;
        const text = `Hello Chamika!\n\nName: ${values.user_name}\nEmail: ${values.user_email}\n\n${values.message}`;
        window.open(`https://wa.me/94750471511?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
        setFeedback({ kind: 'info', text: 'Continue in WhatsApp to review and send your prefilled message. If it did not open, check your browser’s popup settings.' });
    };
    const fieldClass = 'w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline focus:outline-2 focus:outline-blue-400 focus:outline-offset-2 disabled:opacity-60';
    const buttonFocus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-2';

    return <section id="contact" aria-labelledby="contact-title" className="py-12 sm:py-16 relative">
        <span aria-hidden="true" className="absolute top-8 right-6 text-[10rem] lg:text-[18rem] font-black leading-none text-white/[0.03] pointer-events-none">07</span>
        <div className="container mx-auto px-6 max-w-6xl relative">
            <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 items-start">
                <motion.div initial={reducedMotion ? false : { opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: reducedMotion ? 0 : 0.5 }} className="min-w-0 space-y-8">
                    <div>
                        <p className="text-xs font-mono uppercase tracking-[0.2em] text-blue-400 mb-4">Open to full-time opportunities</p>
                        <h2 id="contact-title" className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-white uppercase leading-tight">Let’s build<br /><span className="text-blue-500">something useful.</span></h2>
                        <div className="h-1 w-24 bg-blue-600 rounded-full mt-4" />
                        <p className="text-sm sm:text-base text-gray-400 leading-relaxed mt-5 max-w-md">Have a role, a project, or a question in mind? Send a message or reach me directly.</p>
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-start gap-4"><Mail aria-hidden="true" size={20} className="text-blue-400 shrink-0 mt-1" /><div className="min-w-0"><h3 className="font-mono text-[10px] uppercase tracking-widest text-gray-500">Email</h3><a href={`mailto:${emailAddress}`} className={`block mt-1 text-sm sm:text-base text-gray-100 break-all hover:text-blue-300 rounded ${buttonFocus}`}>{emailAddress}</a><div className="flex flex-wrap gap-4 mt-3 text-xs"><button type="button" onClick={copyEmail} className={`inline-flex items-center gap-1.5 text-gray-400 hover:text-white rounded ${buttonFocus}`}>{copied ? <Check size={13} /> : <Copy size={13} />}{copied ? 'Copied' : 'Copy email'}</button><a href={`mailto:${emailAddress}`} className={`inline-flex items-center gap-1 text-blue-300 hover:text-white rounded ${buttonFocus}`}>Open email app <ArrowUpRight size={13} aria-hidden="true" /></a></div><p role="status" className="text-xs text-gray-500 mt-2">{copied ? 'Email address copied.' : copyFailed ? 'Copy unavailable. Select the address or open your email app.' : ''}</p></div></div>
                        <div className="flex items-start gap-4"><Phone size={20} aria-hidden="true" className="text-blue-400 shrink-0 mt-1" /><div><h3 className="font-mono text-[10px] uppercase tracking-widest text-gray-500">Calls</h3><a href="tel:+94704120358" className={`inline-block text-sm text-gray-200 hover:text-blue-300 mt-1 rounded ${buttonFocus}`}>+94 70 412 0358</a></div></div>
                        <div className="flex items-start gap-4"><FaWhatsapp size={20} aria-hidden="true" className="text-green-400 shrink-0 mt-1" /><div><h3 className="font-mono text-[10px] uppercase tracking-widest text-gray-500">WhatsApp · separate number</h3><a href="https://wa.me/94750471511" target="_blank" rel="noopener noreferrer" className={`inline-block text-sm text-gray-200 hover:text-green-300 mt-1 rounded ${buttonFocus}`}>+94 75 047 1511<span className="sr-only"> (opens in a new tab)</span></a></div></div>
                        <div className="flex items-start gap-4"><MapPin size={20} aria-hidden="true" className="text-blue-400 shrink-0 mt-1" /><div><h3 className="font-mono text-[10px] uppercase tracking-widest text-gray-500">Location</h3><p className="text-sm text-gray-300 mt-1">Ambalangoda &amp; Malabe, Sri Lanka</p></div></div>
                    </div>
                    <div className="flex gap-3">{[{ href: 'https://github.com/ChamikaShashipriya99', label: 'GitHub', icon: Github }, { href: 'https://www.linkedin.com/in/chamika-shashipriya-722366321', label: 'LinkedIn', icon: Linkedin }].map(link => <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={`${link.label} (opens in a new tab)`} className={`p-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-blue-400/40 ${buttonFocus}`}><link.icon size={18} aria-hidden="true" /></a>)}</div>
                </motion.div>

                <form ref={formRef} onSubmit={handleSubmit} noValidate aria-busy={loading} className="min-w-0 rounded-2xl border border-white/10 bg-neutral-950/70 p-5 sm:p-7 space-y-5">
                    <div><h3 className="text-xl text-white font-semibold">Send a message</h3><p className="text-xs text-gray-500 mt-2">All fields are required. Your details are used to respond to your message.</p></div>
                    <div aria-hidden="true" className="absolute -left-[10000px] w-px h-px overflow-hidden"><label htmlFor="contact-website">Leave this field empty</label><input ref={honeyRef} id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" /></div>
                    {(['user_name', 'user_email', 'message'] as const).map(name => {
                        const label = name === 'user_name' ? 'Your name' : name === 'user_email' ? 'Email address' : 'Message';
                        const errorId = `${name}-error`;
                        const common = { id: name, name, required: true, disabled: loading, maxLength: contactLimits[name], value: fields[name], onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => change(name, event.target.value), 'aria-invalid': !!errors[name], 'aria-describedby': [errors[name] ? errorId : '', name === 'message' ? 'message-count' : ''].filter(Boolean).join(' ') || undefined, className: `${fieldClass} ${errors[name] ? 'border-red-400/70' : 'border-white/10'}` };
                        return <div key={name}><label htmlFor={name} className="block text-xs font-medium text-gray-300 mb-2">{label}</label>{name === 'message' ? <textarea {...common} rows={6} placeholder="Tell me about the opportunity, project, or question…" className={`${common.className} resize-y min-h-36`} /> : <input {...common} type={name === 'user_email' ? 'email' : 'text'} autoComplete={name === 'user_email' ? 'email' : 'name'} placeholder={name === 'user_email' ? 'name@example.com' : 'Your name'} />}{errors[name] && <p id={errorId} className="text-xs text-red-300 mt-2">{errors[name]}</p>}{name === 'message' && <p id="message-count" className="mt-2 text-[11px] text-gray-500 text-right">{fields.message.length.toLocaleString()} / 2,000 characters</p>}</div>;
                    })}
                    <div className="space-y-3"><button type="submit" disabled={loading} className={`w-full rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60 flex justify-center items-center gap-2 ${buttonFocus}`}><Send size={15} aria-hidden="true" />{loading ? 'Sending…' : feedback?.kind === 'error' ? 'Retry sending' : 'Send message'}</button><button type="button" disabled={loading} onClick={continueWhatsApp} aria-describedby="whatsapp-help" className={`w-full rounded-xl border border-green-500/30 bg-green-500/5 px-4 py-3.5 text-sm font-medium text-green-300 hover:bg-green-500/10 disabled:opacity-60 flex justify-center items-center gap-2 ${buttonFocus}`}><FaWhatsapp size={17} aria-hidden="true" />Continue in WhatsApp</button><p id="whatsapp-help" className="text-[11px] text-gray-500 leading-relaxed">WhatsApp opens in a new tab with your name, email, and message prefilled. Review it and choose Send there; opening it does not send automatically.</p></div>
                    <div role="status" aria-live="polite" aria-atomic="true" className="text-sm text-blue-200">{loading ? 'Sending your message. Please wait.' : ''}</div>
                    <div aria-live="polite" aria-atomic="true">{feedback && <div className={`rounded-xl border p-4 ${feedback.kind === 'success' ? 'border-green-500/30 bg-green-500/5 text-green-200' : feedback.kind === 'error' || feedback.kind === 'validation' ? 'border-red-500/30 bg-red-500/5 text-red-200' : 'border-blue-500/20 text-blue-200'}`}><div className="flex items-start gap-3"><p className="text-sm leading-relaxed flex-1">{feedback.text}</p><button type="button" aria-label="Dismiss message status" onClick={() => setFeedback(null)} className={`shrink-0 rounded p-1 ${buttonFocus}`}><X size={14} aria-hidden="true" /></button></div>{feedback.kind === 'error' && <a href={`mailto:${emailAddress}`} className={`inline-block mt-3 text-xs underline rounded ${buttonFocus}`}>Open email app instead</a>}</div>}</div>
                </form>
            </div>
        </div>
    </section>;
}
