'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function Background() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth the mouse movement
    const springConfig = { damping: 25, stiffness: 150 };
    const smoothedX = useSpring(mouseX, springConfig);
    const smoothedY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            mouseX.set(clientX);
            mouseY.set(clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div className="fixed inset-0 -z-0 overflow-hidden bg-black pointer-events-none">
            {/* Animated Glow 1 */}
            <motion.div
                style={{
                    x: smoothedX,
                    y: smoothedY,
                }}
                className="absolute top-0 left-0 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.15)_0%,_transparent_70%)] rounded-full will-change-transform"
            />

            {/* Animated Glow 2 */}
            <motion.div
                animate={{
                    x: [0, 100, -100, 0],
                    y: [0, -50, 50, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,_rgba(147,51,234,0.1)_0%,_transparent_70%)] rounded-full will-change-transform"
            />

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.08]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            {/* Vignette */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/80" />
        </div>
    );
}
