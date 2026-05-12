'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // Fast spring for the tiny center dot
    const springConfig = { damping: 25, stiffness: 400 };
    // Slower spring for the trailing outer ring
    const springConfigOuter = { damping: 20, stiffness: 150 }; 

    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);
    
    const cursorXOuterSpring = useSpring(cursorX, springConfigOuter);
    const cursorYOuterSpring = useSpring(cursorY, springConfigOuter);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Check if hovering over clickable elements (links, buttons, or elements with pointer cursor)
            const clickable = 
                target.closest('a') || 
                target.closest('button') || 
                window.getComputedStyle(target).cursor === 'pointer';
            
            setIsHovering(!!clickable);
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleMouseOver);
        document.body.addEventListener('mouseleave', handleMouseLeave);
        document.body.addEventListener('mouseenter', handleMouseEnter);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
            document.body.removeEventListener('mouseleave', handleMouseLeave);
            document.body.removeEventListener('mouseenter', handleMouseEnter);
        };
    }, [cursorX, cursorY, isVisible]);

    return (
        <div className="fixed inset-0 z-[10000] pointer-events-none mix-blend-difference hidden md:block">
            {/* Main Cursor Dot - Sticks exactly to cursor */}
            <motion.div
                style={{
                    left: cursorXSpring,
                    top: cursorYSpring,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    scale: isVisible ? (isHovering ? 0 : 1) : 0,
                    opacity: isVisible ? (isHovering ? 0 : 1) : 0,
                }}
                className="w-3 h-3 bg-white rounded-full fixed"
            />
            
            {/* Magnetic/Expanding Outer Ring - Trails slightly */}
            <motion.div
                style={{
                    left: cursorXOuterSpring,
                    top: cursorYOuterSpring,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    scale: isVisible ? (isHovering ? 1.8 : 1) : 0,
                    backgroundColor: isHovering ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0)',
                    borderColor: isHovering ? 'rgba(255, 255, 255, 0)' : 'rgba(59, 130, 246, 0.8)',
                    opacity: isVisible ? 1 : 0,
                }}
                transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                className="w-10 h-10 border-2 rounded-full fixed"
            />

            {/* Subtle Blue Inner Glow - disappears on hover */}
            <motion.div
                style={{
                    left: cursorXOuterSpring,
                    top: cursorYOuterSpring,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    scale: isVisible ? (isHovering ? 0 : 1) : 0,
                    opacity: isVisible ? (isHovering ? 0 : 0.5) : 0,
                }}
                className="w-24 h-24 bg-blue-600/30 rounded-full fixed blur-xl"
            />
        </div>
    );
}
