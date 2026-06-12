'use client';

import React, { useEffect, useRef, useState } from 'react';
import { skillCategories } from './SkillsMarquee';
import { motion } from 'framer-motion';
import { HiSearch } from 'react-icons/hi';

interface SkillItem {
    name: string;
    icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
    color: string;
}

interface SkillPoint extends SkillItem {
    x: number;
    y: number;
    z: number;
}

export default function Skills3DCloud() {
    const containerRef = useRef<HTMLDivElement>(null);
    const elementRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const searchQueryRef = useRef(searchQuery);

    // Flatten skill categories to get all skills
    const skills = React.useMemo(() => {
        return skillCategories.flatMap(category => category.skills);
    }, []);

    // Sync search query to ref for access in the requestAnimationFrame loop
    useEffect(() => {
        searchQueryRef.current = searchQuery;
    }, [searchQuery]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const count = skills.length;
        const radius = Math.min(240, window.innerWidth * 0.35);
        const depth = 300;

        // Fibonacci sphere distribution for uniform layout
        let points: SkillPoint[] = skills.map((skill, index) => {
            const phi = Math.acos(-1 + (2 * index) / count);
            const theta = Math.sqrt(count * Math.PI) * phi;
            return {
                ...skill,
                x: radius * Math.sin(phi) * Math.cos(theta),
                y: radius * Math.sin(phi) * Math.sin(theta),
                z: radius * Math.cos(phi),
            };
        });

        let currentRotationX = 0.002; // default self-rotation speeds
        let currentRotationY = 0.002;
        let isHovered = false;
        let mouseX = 0;
        let mouseY = 0;
        let activeHoveredIndex: number | null = null;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            // Center-relative mouse coordinates
            mouseX = e.clientX - rect.left - rect.width / 2;
            mouseY = e.clientY - rect.top - rect.height / 2;

            // Compute rotation speed proportional to mouse displacement
            currentRotationX = (mouseY / (rect.height / 2)) * 0.015;
            currentRotationY = -(mouseX / (rect.width / 2)) * 0.015;
        };

        const handleMouseEnter = () => {
            isHovered = true;
        };

        const handleMouseLeave = () => {
            isHovered = false;
            // Gradually return to default self-rotation
            mouseX = 0;
            mouseY = 0;
        };

        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseenter', handleMouseEnter);
        container.addEventListener('mouseleave', handleMouseLeave);

        let animationFrameId: number;

        const updatePositions = () => {
            // Apply rotation speeds
            // If hovering a specific bubble, slow down the rotation for easier clicking
            const damping = activeHoveredIndex !== null ? 0.1 : 1.0;
            const rx = (isHovered ? currentRotationX : 0.002) * damping;
            const ry = (isHovered ? currentRotationY : 0.002) * damping;

            const cosX = Math.cos(rx);
            const sinX = Math.sin(rx);
            const cosY = Math.cos(ry);
            const sinY = Math.sin(ry);

            points = points.map((p, index) => {
                // 1. Rotate around X-axis
                const y1 = p.y * cosX - p.z * sinX;
                const z1 = p.y * sinX + p.z * cosX;

                // 2. Rotate around Y-axis
                const x2 = p.x * cosY + z1 * sinY;
                const z2 = -p.x * sinY + z1 * cosY;

                // 3. Project to 2D
                const scale = depth / (depth - z2);
                
                // Update DOM directly for maximum 60FPS performance
                const el = elementRefs.current[index];
                if (el) {
                    const query = searchQueryRef.current.toLowerCase();
                    const matchesSearch = query === '' || p.name.toLowerCase().includes(query);
                    
                    // Style attributes
                    const screenX = x2;
                    const screenY = y1;
                    const isBubbleHovered = activeHoveredIndex === index;
                    
                    let opacity = (z2 + radius) / (2 * radius) * 0.6 + 0.4;
                    if (!matchesSearch) {
                        opacity *= 0.15; // Dim non-matching skills
                    } else if (isBubbleHovered) {
                        opacity = 1.0;
                    }

                    const finalScale = scale * (isBubbleHovered ? 1.25 : 1.0);
                    const zIndex = Math.round(z2 + radius) + (isBubbleHovered ? 500 : 0);

                    el.style.transform = `translate3d(-50%, -50%, 0) translate3d(${screenX}px, ${screenY}px, 0px) scale(${finalScale})`;
                    el.style.opacity = opacity.toString();
                    el.style.zIndex = zIndex.toString();

                    // Search Highlight Effect
                    if (query !== '' && matchesSearch) {
                        el.style.boxShadow = `0 0 20px ${p.color}50`;
                        el.style.borderColor = p.color;
                    } else if (isBubbleHovered) {
                        el.style.boxShadow = `0 0 25px ${p.color}80`;
                        el.style.borderColor = p.color;
                    } else {
                        el.style.boxShadow = '';
                        el.style.borderColor = '';
                    }
                }

                return { ...p, x: x2, y: y1, z: z2 };
            });

            animationFrameId = requestAnimationFrame(updatePositions);
        };

        animationFrameId = requestAnimationFrame(updatePositions);

        // Function to expose bubble hovered index to the render loop
        const registerHoverHandlers = () => {
            elementRefs.current.forEach((el, index) => {
                if (!el) return;
                
                const onOver = () => { activeHoveredIndex = index; };
                const onOut = () => { activeHoveredIndex = null; };

                el.addEventListener('mouseenter', onOver);
                el.addEventListener('mouseleave', onOut);
                
                // Save cleanups on the elements themselves
                (el as any)._onOver = onOver;
                (el as any)._onOut = onOut;
            });
        };

        registerHoverHandlers();

        return () => {
            cancelAnimationFrame(animationFrameId);
            if (container) {
                container.removeEventListener('mousemove', handleMouseMove);
                container.removeEventListener('mouseenter', handleMouseEnter);
                container.removeEventListener('mouseleave', handleMouseLeave);
            }
            // Clean up hover event listeners
            elementRefs.current.forEach((el) => {
                if (el) {
                    el.removeEventListener('mouseenter', (el as any)._onOver);
                    el.removeEventListener('mouseleave', (el as any)._onOut);
                }
            });
        };
    }, [skills]);

    const handleSkillClick = (techName: string) => {
        // Dispatch custom event to trigger filter on Projects section
        const event = new CustomEvent('filter-projects', { detail: { tech: techName } });
        window.dispatchEvent(event);
    };

    return (
        <div className="w-full max-w-3xl flex flex-col items-center select-none">
            {/* Search Input Bar */}
            <div className="relative w-full max-w-sm mb-12 px-6">
                <HiSearch className="absolute left-9 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search technical arsenal..."
                    className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 text-white focus:outline-none focus:border-blue-500 focus:bg-white/[0.08] transition-all placeholder:text-gray-500 text-xs md:text-sm tracking-wider font-mono"
                />
            </div>

            {/* 3D Sphere Container */}
            <div
                ref={containerRef}
                className="relative w-[320px] h-[320px] sm:w-[480px] sm:h-[480px] md:w-[560px] md:h-[560px] flex items-center justify-center overflow-visible cursor-grab active:cursor-grabbing"
            >
                {skills.map((skill, index) => {
                    const Icon = skill.icon;
                    return (
                        <div
                            key={index}
                            ref={(el) => { elementRefs.current[index] = el; }}
                            onClick={() => handleSkillClick(skill.name)}
                            className="absolute left-1/2 top-1/2 rounded-2xl glassmorphism px-3 py-2 sm:px-5 sm:py-3 flex items-center gap-2 border border-white/5 cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-colors duration-200"
                        >
                            <Icon className="text-sm sm:text-2xl" style={{ color: skill.color }} />
                            <span className="text-white font-mono text-[9px] sm:text-xs uppercase tracking-wider whitespace-nowrap">
                                {skill.name}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Dynamic Instruction Overlay */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                className="text-gray-500 font-mono text-[10px] md:text-xs uppercase tracking-[0.25em] text-center mt-8 px-6 animate-pulse"
            >
                Move cursor to rotate sphere • Click a technology to view projects
            </motion.p>
        </div>
    );
}
