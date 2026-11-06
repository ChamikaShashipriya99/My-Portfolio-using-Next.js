'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { Skill } from './skills-data';

export default function Skills3DCloud({ skills, paused, onSelect }: { skills: Skill[]; paused: boolean; onSelect: (skill: Skill) => void }) {
    const container = useRef<HTMLDivElement>(null);
    const elements = useRef<(HTMLButtonElement | null)[]>([]);
    const [interacting, setInteracting] = useState(false);
    const stopped = useRef(paused);
    useEffect(() => { stopped.current = paused || interacting; }, [paused, interacting]);
    useEffect(() => {
        const root = container.current;
        if (!root) return;
        let radius = 140, angle = 0, frame = 0, previous = 0;
        const measure = () => { radius = Math.min(180, root.clientWidth * 0.28); };
        const observer = new ResizeObserver(measure);
        observer.observe(root);
        measure();
        const points = skills.map((_, index) => {
            const y = skills.length === 1 ? 0 : 1 - index / (skills.length - 1) * 2;
            const ring = Math.sqrt(1 - y * y);
            const theta = index * Math.PI * (3 - Math.sqrt(5));
            return { x: Math.cos(theta) * ring, y, z: Math.sin(theta) * ring };
        });
        const draw = (time: number) => {
            if ((stopped.current || document.hidden) && previous) { previous = time; frame = requestAnimationFrame(draw); return; }
            const elapsed = previous ? Math.min(time - previous, 40) : 0;
            previous = time;
            if (!stopped.current) angle += elapsed * 0.00012;
            points.forEach((point, index) => {
                const element = elements.current[index];
                if (!element) return;
                const x = point.x * Math.cos(angle) + point.z * Math.sin(angle);
                const z = -point.x * Math.sin(angle) + point.z * Math.cos(angle);
                const scale = 0.75 + (z + 1) * 0.15;
                element.style.transform = `translate(-50%, -50%) translate(${x * radius}px, ${point.y * radius}px) scale(${scale})`;
                element.style.opacity = String(0.45 + (z + 1) * 0.275);
                element.style.zIndex = String(Math.round((z + 1) * 10));
            });
            frame = requestAnimationFrame(draw);
        };
        frame = requestAnimationFrame(draw);
        return () => { cancelAnimationFrame(frame); observer.disconnect(); };
    }, [skills]);
    return <div>
        <p className="text-xs text-gray-500 mb-3">Select a technology for project evidence. Rotation pauses on hover or keyboard focus.</p>
        <div ref={container} onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)} onFocusCapture={() => setInteracting(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setInteracting(false); }} className="relative h-[360px] sm:h-[460px] overflow-hidden rounded-2xl border border-white/10 bg-blue-950/5" style={{ touchAction: 'pan-y' }} role="group" aria-label="Technology orbit">
            <div aria-hidden="true" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 rounded-full bg-blue-600/10 blur-3xl" />
            {skills.map((skill, index) => <button type="button" key={skill.name} ref={element => { elements.current[index] = element; }} onClick={() => onSelect(skill)} aria-label={`View project evidence for ${skill.name}`} className="absolute left-1/2 top-1/2 flex items-center gap-2 rounded-full border border-white/10 bg-neutral-950/95 px-3 py-2 text-xs text-gray-200 hover:border-blue-400 focus-visible:outline focus-visible:outline-blue-400 focus:!opacity-100 focus:!z-50">
                <skill.icon aria-hidden="true" style={{ color: skill.color }} className="text-base" />{skill.name}
            </button>)}
        </div>
    </div>;
}
