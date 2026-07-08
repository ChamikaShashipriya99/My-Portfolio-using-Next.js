'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate, animate } from 'framer-motion';
import { HiDownload } from 'react-icons/hi';

interface SingleCardProps {
    frontImage: string;
    backImage: string;
    title: string;
    delay?: number;
}

const SingleCard = ({ frontImage, backImage, title, delay = 0 }: SingleCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    
    // Y base rotation (used for auto-spinning and snapping to front/back faces)
    const rotateY = useMotionValue(0);
    // Y vertical float offset (floating when idle, flat when hovered)
    const yFloat = useMotionValue(0);
    
    // Tilt angle offset targets relative to mouse position
    const tiltX = useMotionValue(0);
    const tiltY = useMotionValue(0);
    
    // Mouse glare positions (percentage 0 to 100)
    const glareX = useMotionValue(50);
    const glareY = useMotionValue(50);
    
    // Target opacity of the glare sheen (0 when not hovering, 1 when hovering)
    const glareOpacityTarget = useMotionValue(0);
    
    // Spring physics configuration to smooth coordinates and tilts
    const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
    const springTiltX = useSpring(tiltX, springConfig);
    const springTiltY = useSpring(tiltY, springConfig);
    const springGlareX = useSpring(glareX, springConfig);
    const springGlareY = useSpring(glareY, springConfig);
    const glareOpacity = useSpring(glareOpacityTarget, springConfig);
    
    // Glare templates
    const glareBgFront = useMotionTemplate`radial-gradient(circle at ${springGlareX}% ${springGlareY}%, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 65%)`;
    
    // Invert horizontal coordinate of glare on the back face to match card orientation
    const springGlareXBack = useTransform(springGlareX, (x) => 100 - x);
    const glareBgBack = useMotionTemplate`radial-gradient(circle at ${springGlareXBack}% ${springGlareY}%, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 65%)`;
    
    // Combine base auto-spin rotateY and interactive springTiltY
    const finalRotateY = useTransform(
        [rotateY, springTiltY],
        ([latestRotateY, latestTiltY]) => Number(latestRotateY) + Number(latestTiltY)
    );
    
    // Store running animation instances to stop them on hover
    const floatAnimRef = useRef<any>(null);
    const spinAnimRef = useRef<any>(null);
    
    const resumeAnimation = () => {
        // Stop current animation references if any
        if (floatAnimRef.current) floatAnimRef.current.stop();
        if (spinAnimRef.current) spinAnimRef.current.stop();
        
        // Start infinite float loop
        floatAnimRef.current = animate(yFloat, [yFloat.get(), -10, yFloat.get()], {
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut'
        });
        
        // Start infinite spin loop
        const startY = rotateY.get();
        spinAnimRef.current = animate(rotateY, [startY, startY + 360], {
            duration: 10,
            repeat: Infinity,
            ease: 'linear'
        });
    };
    
    useEffect(() => {
        // Start animation after delay
        const timer = setTimeout(resumeAnimation, delay * 1000);
        return () => {
            clearTimeout(timer);
            if (floatAnimRef.current) floatAnimRef.current.stop();
            if (spinAnimRef.current) spinAnimRef.current.stop();
        };
    }, []);
    
    const handleMouseEnter = () => {
        setIsHovered(true);
        
        // 1. Stop active animations
        if (floatAnimRef.current) floatAnimRef.current.stop();
        if (spinAnimRef.current) spinAnimRef.current.stop();
        
        // 2. Snap to nearest flat side (front 0/360 or back 180 degrees)
        const currentY = rotateY.get();
        let normalizedY = currentY % 360;
        if (normalizedY < 0) normalizedY += 360;
        
        let targetY = 0;
        if (normalizedY > 90 && normalizedY < 270) {
            targetY = 180;
        } else {
            targetY = normalizedY >= 270 ? 360 : 0;
        }
        
        const fullRotations = Math.floor(currentY / 360) * 360;
        const absoluteTargetY = fullRotations + targetY;
        
        // Smoothly snap to target flat angle and lower vertical float height to 0
        animate(rotateY, absoluteTargetY, { type: 'spring', stiffness: 100, damping: 20 });
        animate(yFloat, 0, { type: 'spring', stiffness: 100, damping: 20 });
        
        // 3. Fade in glare effect
        glareOpacityTarget.set(1);
    };
    
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        
        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        
        // Mouse coordinate offset relative to center of the card
        const mouseXVal = e.clientX - rect.left;
        const mouseYVal = e.clientY - rect.top;
        
        // Normalize coordinates to [-0.5, 0.5] range
        const normX = (mouseXVal / width) - 0.5;
        const normY = (mouseYVal / height) - 0.5;
        
        // Determine whether card is facing back or front to flip tilt coordinates
        const currentY = rotateY.get();
        let normalizedY = currentY % 360;
        if (normalizedY < 0) normalizedY += 360;
        const isBack = normalizedY > 90 && normalizedY < 270;
        const factor = isBack ? -1 : 1;
        
        // Set rotational tilt values (max 20 degrees)
        tiltX.set(normY * -20 * factor);
        tiltY.set(normX * 20 * factor);
        
        // Set glare coordinates targets
        glareX.set((mouseXVal / width) * 100);
        glareY.set((mouseYVal / height) * 100);
    };
    
    const handleMouseLeave = () => {
        setIsHovered(false);
        
        // 1. Reset tilts
        tiltX.set(0);
        tiltY.set(0);
        
        // 2. Fade out glare effect
        glareOpacityTarget.set(0);
        
        // 3. Resume auto float and spin immediately
        resumeAnimation();
    };
    
    return (
        <div className="flex flex-col items-center gap-8">
            <div
                className="perspective-1000 group"
                onMouseEnter={handleMouseEnter}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                <motion.div
                    ref={cardRef}
                    style={{
                        y: yFloat,
                        rotateX: springTiltX,
                        rotateY: finalRotateY,
                        transformStyle: 'preserve-3d'
                    }}
                    className="relative w-[240px] h-[400px] md:w-[280px] md:h-[480px] 3xl:w-[350px] 3xl:h-[600px] cursor-pointer"
                >
                    {/* Front Side */}
                    <div
                        className="absolute inset-0 w-full h-full rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 bg-neutral-900"
                        style={{ backfaceVisibility: 'hidden' }}
                    >
                        <img
                            src={frontImage}
                            alt={`${title} Front`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/350x600/111/444?text=Front+Missing';
                            }}
                        />
                        {/* Dynamic Holographic Glare */}
                        <motion.div 
                            className="absolute inset-0 pointer-events-none mix-blend-overlay z-10"
                            style={{ background: glareBgFront, opacity: glareOpacity }}
                        />
                    </div>

                    {/* Back Side */}
                    <div
                        className="absolute inset-0 w-full h-full rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 bg-neutral-900"
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    >
                        <img
                            src={backImage}
                            alt={`${title} Back`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/350x600/111/444?text=Back+Missing';
                            }}
                        />
                        {/* Dynamic Holographic Glare */}
                        <motion.div 
                            className="absolute inset-0 pointer-events-none mix-blend-overlay z-10"
                            style={{ background: glareBgBack, opacity: glareOpacity }}
                        />
                    </div>

                    {/* Glow on hover */}
                    <div className="absolute -inset-1 bg-blue-500/20 rounded-[2.2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                </motion.div>
            </div>

            {/* Download button */}
            <a
                href={frontImage}
                download={`${title.replace(/ /g, '-')}-chamika-business-card.png`}
                className="group flex items-center gap-2.5 px-6 py-3 rounded-full glassmorphism border border-white/10 text-gray-400 hover:text-white hover:border-blue-500/40 hover:bg-blue-500/10 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300 text-[10px] font-bold uppercase tracking-[0.2em]"
            >
                <HiDownload className="text-base group-hover:-translate-y-0.5 transition-transform duration-200" />
                Download Card
            </a>
        </div>
    );
};

export default function BusinessCard() {
    return (
        <section className="py-24 5xl:py-48 relative overflow-hidden flex flex-col items-center">
            <span aria-hidden="true" className="pointer-events-none select-none absolute bottom-8 right-6 font-black text-white opacity-[0.03] text-[8rem] sm:text-[10rem] md:text-[14rem] lg:text-[18rem] leading-none tracking-tighter">09</span>
            {/* Background Portal Effect */}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-blue-600/10 rounded-full blur-[180px] pointer-events-none -z-10 ring-1 ring-blue-500/20 shadow-[0_0_100px_rgba(59,130,246,0.1)]"
            />

            <div className="container mx-auto px-6 mb-24 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl 5xl:text-8xl font-black text-white tracking-tighter uppercase mb-4">
                        Digital <span className="text-blue-500">Collectibles</span>
                    </h2>
                    <div className="h-1.5 w-24 bg-blue-600 rounded-full mx-auto mb-8" />
                </motion.div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-16 md:gap-32 px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0, x: 100, rotate: -20 }}
                    whileInView={{ opacity: 1, scale: 1, x: 0, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 20,
                        delay: 0.5
                    }}
                >
                    <SingleCard
                        frontImage="/images/business-card-left.png"
                        backImage="/images/business-card-left-back.png"
                        title="Profile Core"
                        delay={0}
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0, x: -100, rotate: 20 }}
                    whileInView={{ opacity: 1, scale: 1, x: 0, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 20,
                        delay: 0.7
                    }}
                >
                    <SingleCard
                        frontImage="/images/business-card.png"
                        backImage="/images/business-card-back.png"
                        title="Main Identity"
                        delay={1}
                    />
                </motion.div>
            </div>

            {/* Additional Background Glows */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[40rem] h-[40rem] bg-blue-600/5 rounded-full blur-[180px] pointer-events-none -z-10" />
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[40rem] h-[40rem] bg-purple-600/5 rounded-full blur-[180px] pointer-events-none -z-10" />
        </section>
    );
}
