'use client';

import React, { useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

interface Particle {
    x: number;
    y: number;
    size: number;
    baseOpacity: number;
    vx: number;
    vy: number;
    twinkleSpeed: number;
    twinkleOffset: number;
    color: string;
}

const COLORS = [
    '255, 255, 255', // white  — most common
    '255, 255, 255',
    '255, 255, 255',
    '147, 197, 253', // blue-300
    '196, 181, 253', // violet-300
    '103, 232, 249', // cyan-300
];

function makeParticles(count: number, w: number, h: number): Particle[] {
    return Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 1.6 + 0.2,
        baseOpacity: Math.random() * 0.45 + 0.05,
        vx: (Math.random() - 0.5) * 0.12,
        vy: -(Math.random() * 0.18 + 0.03),
        twinkleSpeed: Math.random() * 1.4 + 0.3,
        twinkleOffset: Math.random() * Math.PI * 2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
}

export default function StarField({ count = 120 }: { count?: number }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const visible = useInView(canvasRef, { margin: '100px' });
    useEffect(() => {
        if (!visible) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let raf: number;
        let particles: Particle[] = [];

        const resize = () => {
            canvas.width  = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            particles = makeParticles(count, canvas.width, canvas.height);
        };

        let lastFrame = 0;
        const draw = (ts: number) => {
            if (document.hidden || ts - lastFrame < 33) { raf = requestAnimationFrame(draw); return; }
            lastFrame = ts;
            const t = ts / 1000;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (const p of particles) {
                const twinkle  = 0.4 + 0.6 * Math.sin(t * p.twinkleSpeed + p.twinkleOffset);
                const opacity  = p.baseOpacity * twinkle;

                p.x += p.vx;
                p.y += p.vy;

                // wrap — re-seed x when wrapping vertically so density stays even
                if (p.y < -4) { p.y = canvas.height + 4; p.x = Math.random() * canvas.width; }
                if (p.x < -4)                p.x = canvas.width  + 4;
                if (p.x > canvas.width + 4)  p.x = -4;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p.color}, ${opacity.toFixed(3)})`;
                ctx.fill();
            }

            raf = requestAnimationFrame(draw);
        };

        resize();
        raf = requestAnimationFrame(draw);

        const ro = new ResizeObserver(resize);
        ro.observe(canvas);

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
        };
    }, [count, visible]);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 2 }}
        />
    );
}
