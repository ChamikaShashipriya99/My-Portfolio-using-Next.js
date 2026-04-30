'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
    const [isVisible, setIsVisible] = useState(false);
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 250 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        window.addEventListener('mousemove', moveCursor);
        document.body.addEventListener('mouseleave', handleMouseLeave);
        document.body.addEventListener('mouseenter', handleMouseEnter);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            document.body.removeEventListener('mouseleave', handleMouseLeave);
            document.body.removeEventListener('mouseenter', handleMouseEnter);
        };
    }, [cursorX, cursorY, isVisible]);

    return (
        <div className="fixed inset-0 z-[9999] pointer-events-none mix-blend-difference hidden md:block">
            {/* Main Cursor Dot */}
            <motion.div
                style={{
                    left: cursorXSpring,
                    top: cursorYSpring,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    scale: isVisible ? 1 : 0,
                    opacity: isVisible ? 1 : 0,
                }}
                className="w-4 h-4 bg-white rounded-full fixed"
            />
            
            {/* Outer Ring Glow */}
            <motion.div
                style={{
                    left: cursorXSpring,
                    top: cursorYSpring,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    scale: isVisible ? 1 : 0,
                    opacity: isVisible ? 0.3 : 0,
                }}
                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                className="w-12 h-12 border-2 border-blue-500 rounded-full fixed blur-sm"
            />

            {/* Inner Glow Center */}
            <motion.div
                style={{
                    left: cursorXSpring,
                    top: cursorYSpring,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    scale: isVisible ? 1 : 0,
                    opacity: isVisible ? 0.5 : 0,
                }}
                className="w-24 h-24 bg-blue-600/20 rounded-full fixed blur-xl"
            />
        </div>
    );
}
