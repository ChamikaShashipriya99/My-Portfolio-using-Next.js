'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, MessageSquare, AlertCircle, CheckCircle2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import GlassCard from './GlassCard';
import emailjs from '@emailjs/browser';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

const suggestedPrompts = [
    "What is Chamika's tech stack?",
    "Tell me about his SLT internship",
    "What projects has he built?",
    "Tell me about MeetHUB v2",
    "How does his mechanic background help in coding?",
    "Is he open to job opportunities?",
    "Where is Chamika studying?",
    "How can I contact him?"
];

export default function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: "Welcome to **ChamikaZ_AI**. I am your cybernetic interface. Ask me anything about Chamika's experience, education, or tech stack.",
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showRipple, setShowRipple] = useState(true);
    const [emailStatus, setEmailStatus] = useState<null | 'sending' | 'success' | 'error'>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Stop pulsing ripple after the user interacts
    const handleOpenToggle = () => {
        setIsOpen(!isOpen);
        setShowRipple(false);
        setError(null);
    };

    // Scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen, messages]);

    const handleTriggerEmail = async (name: string, email: string, message: string) => {
        setEmailStatus('sending');
        try {
            await emailjs.send(
                'service_mz488cd',
                'template_j1ia91i',
                {
                    user_name: name,
                    user_email: email,
                    message: message
                },
                'PNeYKrOGJd3zQ3U-U'
            );
            setEmailStatus('success');
        } catch (err) {
            console.error('EmailJS Chatbot Error:', err);
            setEmailStatus('error');
        } finally {
            setTimeout(() => {
                setEmailStatus(null);
            }, 6000);
        }
    };

    const handleSendMessage = async (textToSend: string) => {
        const text = textToSend.trim();
        if (!text) return;

        const userMsg: Message = {
            id: `msg-${Date.now()}-${Math.random()}`,
            role: 'user',
            content: text,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setLoading(true);
        setError(null);

        try {
            // Package messages history
            const history = [...messages, userMsg].map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: history })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to establish uplink.');
            }

            let rawResponse = data.response;
            let emailTrigger = null;

            // Pattern: [SEND_EMAIL:{"user_name":"...","user_email":"...","message":"..."}]
            const emailRegex = /\[SEND_EMAIL:(.*?)\]/;
            const match = rawResponse.match(emailRegex);
            if (match) {
                try {
                    emailTrigger = JSON.parse(match[1]);
                    // Strip the tag from the final content
                    rawResponse = rawResponse.replace(emailRegex, '').trim();
                } catch (e) {
                    console.error("Failed to parse EmailJS payload from bot response:", e);
                }
            }

            const aiMsg: Message = {
                id: `msg-${Date.now()}-${Math.random()}`,
                role: 'assistant',
                content: rawResponse,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMsg]);

            if (emailTrigger) {
                handleTriggerEmail(emailTrigger.user_name, emailTrigger.user_email, emailTrigger.message);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Transmission failed. Mainframe connection lost.');
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSendMessage(inputValue);
    };

    return (
        <div className="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-[90] font-sans">
            {/* Chat Trigger Button */}
            <motion.button
                onClick={handleOpenToggle}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className={`relative w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
                    isOpen 
                        ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]' 
                        : 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]'
                }`}
                title="Chat with ChamikaZ_AI"
            >
                {/* Radar/Ripple Ring */}
                {showRipple && !isOpen && (
                    <span className="absolute inset-0 rounded-full border border-blue-500 animate-ping opacity-60 pointer-events-none" />
                )}
                
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close-icon"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <X size={24} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="chat-icon"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="relative"
                        >
                            <Bot size={24} />
                            <Sparkles size={10} className="absolute -top-1 -right-1 text-cyan-300 animate-pulse" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Chat Panel Box */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9, originX: 0, originY: 1 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                        className="absolute bottom-20 left-0 w-[calc(100vw-3rem)] sm:w-[380px] h-[500px] md:h-[550px] flex flex-col pointer-events-auto"
                    >
                        <GlassCard className="h-full flex flex-col p-0 overflow-hidden bg-black/85 border-blue-500/20 shadow-[0_15px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
                            {/* Panel Header */}
                            <div className="bg-gradient-to-r from-blue-950/40 via-blue-900/20 to-black px-6 py-4 border-b border-white/10 flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                                            <Bot size={18} className="animate-pulse" />
                                        </div>
                                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-black rounded-full" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-mono font-bold text-white tracking-wider">ChamikaZ_AI</div>
                                        <div className="text-[10px] font-mono text-blue-400/80 uppercase tracking-widest font-bold">AI Mainframe uplink</div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-500 hover:text-white hover:bg-white/5 p-1.5 rounded-lg transition-colors cursor-pointer"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Chat Content Body */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex flex-col max-w-[85%] ${
                                            msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                                        }`}
                                    >
                                        <div
                                            className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg ${
                                                msg.role === 'user'
                                                    ? 'bg-blue-600 text-white rounded-br-none'
                                                    : 'bg-white/5 border border-white/10 text-gray-300 rounded-bl-none prose prose-invert max-w-none prose-sm'
                                            }`}
                                        >
                                            {msg.role === 'assistant' ? (
                                                <ReactMarkdown 
                                                    remarkPlugins={[remarkGfm]}
                                                    components={{
                                                        p: ({ children }) => <p className="mb-0 leading-relaxed">{children}</p>,
                                                        a: ({ href, children }) => (
                                                            <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline hover:text-blue-300 transition-colors">
                                                                {children}
                                                            </a>
                                                        ),
                                                        ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 my-2">{children}</ul>,
                                                        ol: ({ children }) => <ol className="list-decimal pl-4 space-y-1 my-2">{children}</ol>,
                                                        li: ({ children }) => <li className="text-gray-300">{children}</li>,
                                                        code: ({ children }) => <code className="bg-white/10 text-cyan-300 px-1 py-0.5 rounded font-mono text-xs">{children}</code>
                                                    }}
                                                >
                                                    {msg.content}
                                                </ReactMarkdown>
                                            ) : (
                                                msg.content
                                            )}
                                        </div>
                                        <span className="text-[9px] text-gray-500/80 font-mono mt-1 px-1">
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                ))}

                                {/* Typing indicator */}
                                {loading && (
                                    <div className="mr-auto items-start max-w-[85%] flex flex-col">
                                        <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-none px-4 py-3 text-sm text-gray-400 flex items-center gap-2">
                                            <span className="font-mono text-xs uppercase tracking-widest text-blue-400 animate-pulse">Syncing mainframe</span>
                                            <div className="flex gap-1">
                                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Error alert */}
                                {error && (
                                    <div className="w-full flex items-center gap-2 text-xs text-red-400 bg-red-950/20 border border-red-500/20 rounded-xl p-3">
                                        <AlertCircle size={14} className="shrink-0" />
                                        <span className="font-mono">{error}</span>
                                    </div>
                                )}

                                {/* EmailJS Status Alert */}
                                {emailStatus === 'sending' && (
                                    <div className="w-full flex items-center gap-2 text-xs text-blue-400 bg-blue-950/20 border border-blue-500/20 rounded-xl p-3">
                                        <div className="w-3.5 h-3.5 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin shrink-0" />
                                        <span className="font-mono">Transmitting message via EmailJS secure link...</span>
                                    </div>
                                )}
                                {emailStatus === 'success' && (
                                    <div className="w-full flex items-center gap-2 text-xs text-green-400 bg-green-950/20 border border-green-500/20 rounded-xl p-3 animate-pulse">
                                        <CheckCircle2 size={14} className="shrink-0 text-green-400" />
                                        <span className="font-mono">Transmission confirmed. Message logged to Chamika's inbox!</span>
                                    </div>
                                )}
                                {emailStatus === 'error' && (
                                    <div className="w-full flex items-center gap-2 text-xs text-red-400 bg-red-950/20 border border-red-500/20 rounded-xl p-3">
                                        <AlertCircle size={14} className="shrink-0" />
                                        <span className="font-mono">Transmission failed. Check connection or retry.</span>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                            {/* Suggested Queries */}
                            {!loading && (
                                <div className="px-6 pb-2 pt-1 shrink-0">
                                    <p className="text-[9px] font-mono text-gray-600 uppercase tracking-widest mb-2 font-bold">Suggested transmissions:</p>
                                    <div className="flex gap-2 overflow-x-auto items-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-1">
                                        {suggestedPrompts.map((prompt) => (
                                            <button
                                                key={prompt}
                                                onClick={() => handleSendMessage(prompt)}
                                                className="text-[10px] font-mono text-blue-400 hover:text-white bg-blue-400/5 hover:bg-blue-600/20 border border-blue-400/20 hover:border-blue-400/50 px-2.5 py-1 rounded-lg transition-all text-left cursor-pointer shrink-0"
                                            >
                                                {prompt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Panel Input Form Footer */}
                            <form 
                                onSubmit={handleFormSubmit} 
                                className="p-4 border-t border-white/10 flex gap-2 items-center bg-black/50 shrink-0"
                            >
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Transmit query..."
                                    disabled={loading}
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 focus:bg-white/[0.08] transition-all placeholder:text-gray-600 disabled:opacity-50"
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !inputValue.trim()}
                                    className="p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:bg-neutral-800 disabled:text-neutral-600 transition-colors cursor-pointer shrink-0"
                                >
                                    <Send size={14} />
                                </button>
                            </form>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
