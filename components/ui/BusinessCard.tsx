'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SingleCardProps {
    frontImage: string;
    backImage: string;
    title: string;
    delay?: number;
}

const SingleCard = ({ frontImage, backImage, title, delay = 0 }: SingleCardProps) => {
    return (
        <div className="perspective-1000 group">
            <motion.div
                animate={{
                    rotateY: [0, 360],
                    y: [0, -10, 0],
                }}
                transition={{
                    rotateY: {
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                        delay,
                    },
                    y: {
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay,
                    }
                }}
                style={{
                    transformStyle: "preserve-3d",
                }}
                className="relative w-[240px] h-[400px] md:w-[280px] md:h-[480px] 3xl:w-[350px] 3xl:h-[600px] cursor-pointer"
            >
                {/* Front Side */}
                <div
                    className="absolute inset-0 w-full h-full rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 bg-neutral-900"
                    style={{ backfaceVisibility: "hidden" }}
                >
                    <img
                        src={frontImage}
                        alt={`${title} Front`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/350x600/111/444?text=Front+Missing";
                        }}
                    />
                    {/* Glare effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 pointer-events-none" />
                </div>

                {/* Back Side */}
                <div
                    className="absolute inset-0 w-full h-full rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 bg-neutral-900"
                    style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)"
                    }}
                >
                    <img
                        src={backImage}
                        alt={`${title} Back`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/350x600/111/444?text=Back+Missing";
                        }}
                    />
                    {/* Glare effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 pointer-events-none" />
                </div>

                {/* Constant Glow around the card */}
                <div className="absolute -inset-1 bg-blue-500/20 rounded-[2.2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
            </motion.div>
        </div>
    );
};

export default function BusinessCard() {
    return (
        <section className="py-24 5xl:py-48 relative overflow-hidden flex flex-col items-center">
            <div className="container mx-auto px-6 mb-24 text-center relative z-10">
                <h2 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl 5xl:text-8xl font-black text-white tracking-tighter uppercase mb-4">
                    Digital <span className="text-blue-500">Collectibles</span>
                </h2>
                <div className="h-1.5 w-24 bg-blue-600 rounded-full mx-auto mb-8" />
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-16 md:gap-32 px-6">
                <SingleCard
                    frontImage="/images/business-card-left.png"
                    backImage="/images/business-card-left-back.png"
                    title="Profile Core"
                    delay={0}
                />
                <SingleCard
                    frontImage="/images/business-card.png"
                    backImage="/images/business-card-back.png"
                    title="Main Identity"
                    delay={1} // Staggered start
                />
            </div>

            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[40rem] h-[40rem] bg-blue-600/5 rounded-full blur-[180px] pointer-events-none -z-10" />
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[40rem] h-[40rem] bg-purple-600/5 rounded-full blur-[180px] pointer-events-none -z-10" />
        </section>
    );
}
