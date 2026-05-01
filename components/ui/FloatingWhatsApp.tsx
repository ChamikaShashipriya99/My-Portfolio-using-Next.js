'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';

export default function FloatingWhatsApp() {
    const [showTooltip, setShowTooltip] = React.useState(false);

    React.useEffect(() => {
        const timer = setTimeout(() => setShowTooltip(true), 5000);
        const hideTimer = setTimeout(() => setShowTooltip(false), 10000);
        return () => {
            clearTimeout(timer);
            clearTimeout(hideTimer);
        };
    }, []);

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-2">
            <AnimatePresence>
                {showTooltip && (
                    <motion.div
                        initial={{ opacity: 0, x: 20, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.8 }}
                        className="bg-black/80 text-white text-[10px] uppercase tracking-widest px-4 py-2 rounded-2xl backdrop-blur-xl border border-white/10 shadow-2xl mb-2 whitespace-nowrap hidden md:block"
                    >
                        Need help? <span className="text-[#25D366] font-bold">Chat with me</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.a
                href="https://wa.me/94750471511"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ 
                    delay: 1, 
                    type: 'spring', 
                    stiffness: 260, 
                    damping: 20 
                }}
                className="group relative w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.3)] hover:shadow-[0_15px_40px_rgba(37,211,102,0.5)] transition-all"
                title="Chat on WhatsApp"
            >
                {/* Ripple Effect Animation */}
                <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
                
                <FaWhatsapp size={32} className="relative z-10" />
                
                {/* Mobile Notification Dot */}
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full" />
            </motion.a>
        </div>
    );
}
