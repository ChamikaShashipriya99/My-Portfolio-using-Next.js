'use client';

import React, { useEffect, useRef, useState } from 'react';
import { skillCategories } from './SkillsMarquee';
import { motion } from 'framer-motion';
import { HiSearch } from 'react-icons/hi';

interface SkillItem {
    name: string;
    icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
    color: string;
    category?: string;
}

interface SkillPoint extends SkillItem {
    x: number;
    y: number;
    z: number;
}

const categories = [
    { id: 'All', label: 'All' },
    { id: 'Programming Languages', label: 'Languages' },
    { id: 'Databases & Servers', label: 'Databases' },
    { id: 'Frameworks & Platforms', label: 'Frameworks' },
    { id: 'Tools & IDE\'s', label: 'Tools' }
];

export default function Skills3DCloud() {
    const containerRef = useRef<HTMLDivElement>(null);
    const elementRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const searchQueryRef = useRef(searchQuery);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const selectedCategoryRef = useRef(selectedCategory);

    // Drag and Momentum rotation refs
    const isDraggingRef = useRef(false);
    const startXRef = useRef(0);
    const startYRef = useRef(0);
    const totalDragDistRef = useRef(0);
    const inertiaX = useRef(0);
    const inertiaY = useRef(0);

    // Flatten skill categories to get all skills with category field
    const skills = React.useMemo(() => {
        return skillCategories.flatMap(category => 
            category.skills.map(skill => ({
                ...skill,
                category: category.title
            }))
        );
    }, []);

    // Sync selected category to ref for access in requestAnimationFrame
    useEffect(() => {
        selectedCategoryRef.current = selectedCategory;
    }, [selectedCategory]);

    // Sync search query to ref for access in the requestAnimationFrame loop
    useEffect(() => {
        searchQueryRef.current = searchQuery;
    }, [searchQuery]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const count = skills.length;
        const radius = Math.min(200, window.innerWidth * 0.3);
        const depth = 450;

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
        let activeHoveredIndex: number | null = null;

        // Mouse Drag Handlers
        const handleMouseDown = (e: MouseEvent) => {
            isDraggingRef.current = true;
            startXRef.current = e.clientX;
            startYRef.current = e.clientY;
            totalDragDistRef.current = 0;
            inertiaX.current = 0;
            inertiaY.current = 0;
        };

        const handleMouseMoveWindow = (e: MouseEvent) => {
            // Track cursor coordinates relative to center for normal hover speed when NOT dragging
            const rect = container.getBoundingClientRect();
            const relativeMouseX = e.clientX - rect.left - rect.width / 2;
            const relativeMouseY = e.clientY - rect.top - rect.height / 2;
            currentRotationX = (relativeMouseY / (rect.height / 2)) * 0.015;
            currentRotationY = -(relativeMouseX / (rect.width / 2)) * 0.015;

            if (!isDraggingRef.current) return;

            const dx = e.clientX - startXRef.current;
            const dy = e.clientY - startYRef.current;

            inertiaX.current = dx * 0.006;
            inertiaY.current = dy * 0.006;
            totalDragDistRef.current += Math.abs(dx) + Math.abs(dy);

            startXRef.current = e.clientX;
            startYRef.current = e.clientY;
        };

        const handleMouseUpWindow = () => {
            isDraggingRef.current = false;
        };

        // Touch Drag Handlers for Mobile
        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length === 0) return;
            isDraggingRef.current = true;
            startXRef.current = e.touches[0].clientX;
            startYRef.current = e.touches[0].clientY;
            totalDragDistRef.current = 0;
            inertiaX.current = 0;
            inertiaY.current = 0;
        };

        const handleTouchMoveWindow = (e: TouchEvent) => {
            if (!isDraggingRef.current || e.touches.length === 0) return;
            const dx = e.touches[0].clientX - startXRef.current;
            const dy = e.touches[0].clientY - startYRef.current;

            inertiaX.current = dx * 0.006;
            inertiaY.current = dy * 0.006;
            totalDragDistRef.current += Math.abs(dx) + Math.abs(dy);

            startXRef.current = e.touches[0].clientX;
            startYRef.current = e.touches[0].clientY;
        };

        const handleTouchEndWindow = () => {
            isDraggingRef.current = false;
        };

        const handleMouseEnter = () => {
            isHovered = true;
        };

        const handleMouseLeave = () => {
            isHovered = false;
        };

        container.addEventListener('mousedown', handleMouseDown);
        container.addEventListener('touchstart', handleTouchStart);
        container.addEventListener('mouseenter', handleMouseEnter);
        container.addEventListener('mouseleave', handleMouseLeave);

        window.addEventListener('mousemove', handleMouseMoveWindow);
        window.addEventListener('mouseup', handleMouseUpWindow);
        window.addEventListener('touchmove', handleTouchMoveWindow, { passive: true });
        window.addEventListener('touchend', handleTouchEndWindow);

        let animationFrameId: number;

        const updatePositions = () => {
            let rx = 0;
            let ry = 0;

            if (isDraggingRef.current) {
                // Drag rotation speed
                rx = inertiaY.current;
                ry = -inertiaX.current;
                // Decay inertia when dragging is active but mouse is stationary
                inertiaX.current *= 0.85;
                inertiaY.current *= 0.85;
            } else {
                // If there's drag release momentum (inertia), spin with it
                if (Math.abs(inertiaX.current) > 0.0001 || Math.abs(inertiaY.current) > 0.0001) {
                    rx = inertiaY.current;
                    ry = -inertiaX.current;
                    inertiaX.current *= 0.95; // apply friction
                    inertiaY.current *= 0.95;
                } else {
                    // Hover/Self rotation speed
                    const damping = activeHoveredIndex !== null ? 0.1 : 1.0;
                    rx = (isHovered ? currentRotationX : 0.002) * damping;
                    ry = (isHovered ? currentRotationY : 0.002) * damping;
                }
            }

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
                let scale = depth / (depth - z2);
                // Cap the scale to a safe range to prevent giant or tiny overlaps
                scale = Math.max(0.65, Math.min(1.2, scale));
                
                // Update DOM directly for maximum 60FPS performance
                const el = elementRefs.current[index];
                if (el) {
                    const query = searchQueryRef.current.toLowerCase();
                    const matchesSearch = query === '' || p.name.toLowerCase().includes(query);
                    const matchesCategory = selectedCategoryRef.current === 'All' || p.category === selectedCategoryRef.current;
                    const isVisible = matchesSearch && matchesCategory;
                    
                    // Style attributes
                    const screenX = x2 * scale;
                    const screenY = y1 * scale;
                    const isBubbleHovered = activeHoveredIndex === index;
                    
                    let opacity = (z2 + radius) / (2 * radius) * 0.6 + 0.4;
                    if (!isVisible) {
                        opacity *= 0.12; // Dim non-matching skills heavily
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
                container.removeEventListener('mousedown', handleMouseDown);
                container.removeEventListener('touchstart', handleTouchStart);
                container.removeEventListener('mouseenter', handleMouseEnter);
                container.removeEventListener('mouseleave', handleMouseLeave);
            }
            window.removeEventListener('mousemove', handleMouseMoveWindow);
            window.removeEventListener('mouseup', handleMouseUpWindow);
            window.removeEventListener('touchmove', handleTouchMoveWindow);
            window.removeEventListener('touchend', handleTouchEndWindow);

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
        // If the user dragged more than 8 pixels, treat it as a drag rotation, not a filter click
        if (totalDragDistRef.current > 8) {
            return;
        }
        // Dispatch custom event to trigger filter on Projects section
        const event = new CustomEvent('filter-projects', { detail: { tech: techName } });
        window.dispatchEvent(event);
    };

    return (
        <div className="w-full max-w-3xl flex flex-col items-center select-none">
            {/* Search Input Bar */}
            <div className="relative w-full max-w-sm mb-6 px-6">
                <HiSearch className="absolute left-9 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search technical arsenal..."
                    className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 text-white focus:outline-none focus:border-blue-500 focus:bg-white/[0.08] transition-all placeholder:text-gray-500 text-xs md:text-sm tracking-wider font-mono"
                />
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-12 px-6">
                {categories.map((cat) => {
                    const isActive = selectedCategory === cat.id;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 border ${
                                isActive
                                    ? 'text-white border-blue-500 bg-blue-600/20 shadow-md shadow-blue-500/10'
                                    : 'text-gray-400 border-white/5 bg-white/5 hover:text-white hover:border-white/10'
                            }`}
                        >
                            {cat.label}
                        </button>
                    );
                })}
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
                            className="absolute left-1/2 top-1/2 rounded-xl glassmorphism px-2 py-1.5 sm:px-3 sm:py-2 flex items-center gap-1.5 sm:gap-2 border border-white/5 cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-colors duration-200"
                        >
                            <Icon className="text-[10px] sm:text-lg" style={{ color: skill.color }} />
                            <span className="text-white font-mono text-[8px] sm:text-[11px] uppercase tracking-wider whitespace-nowrap">
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
