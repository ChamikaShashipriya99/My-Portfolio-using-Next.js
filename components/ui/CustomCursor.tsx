'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import './custom-cursor.css';

const nativeTargets = 'input, textarea, select, [role="textbox"], [contenteditable]:not([contenteditable="false"]), canvas, video, iframe, [draggable="true"], [data-native-cursor]';
const interactiveTargets = 'a[href], button:not(:disabled), [role="button"]:not([aria-disabled="true"]), summary, [data-cursor="pointer"]';

export default function CustomCursor() {
    const [appearance, setAppearance] = useState({ visible: false, interactive: false });
    const visible = useRef(false);
    const position = useRef({ x: -100, y: -100 });
    const x = useMotionValue(-100), y = useMotionValue(-100);
    const ringX = useSpring(x, { stiffness: 350, damping: 32, mass: 0.4 });
    const ringY = useSpring(y, { stiffness: 350, damping: 32, mass: 0.4 });
    const reducedMotion = useReducedMotion();

    useEffect(() => {
        const finePointer = window.matchMedia('(hover: hover) and (pointer: fine) and (forced-colors: none)');
        const root = document.documentElement;
        const hide = () => {
            visible.current = false;
            root.removeAttribute('data-custom-cursor');
            setAppearance(previous => previous.visible ? { ...previous, visible: false } : previous);
        };
        const classify = (target: Element | null) => {
            if (!finePointer.matches || !target || target.closest(nativeTargets)) { hide(); return; }
            const interactive = !!target.closest(interactiveTargets);
            const first = !visible.current;
            if (first) { ringX.jump(position.current.x); ringY.jump(position.current.y); }
            visible.current = true;
            root.setAttribute('data-custom-cursor', 'active');
            setAppearance(previous => previous.visible && previous.interactive === interactive ? previous : { visible: true, interactive });
        };
        const move = (event: PointerEvent) => {
            if (event.pointerType !== 'mouse' || !finePointer.matches) { hide(); return; }
            position.current = { x: event.clientX, y: event.clientY };
            x.set(event.clientX); y.set(event.clientY);
            classify(event.target instanceof Element ? event.target : null);
        };
        const keyboard = (event: KeyboardEvent) => { if (['Tab', 'Escape', 'Enter', ' '].includes(event.key)) hide(); };
        const changed = () => hide();
        let frame = 0;
        const scroll = () => {
            if (!visible.current) return;
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => classify(document.elementFromPoint(position.current.x, position.current.y)));
        };
        window.addEventListener('pointermove', move, { passive: true });
        document.documentElement.addEventListener('pointerleave', hide);
        window.addEventListener('blur', hide);
        window.addEventListener('keydown', keyboard);
        window.addEventListener('scroll', scroll, { passive: true });
        document.addEventListener('visibilitychange', hide);
        finePointer.addEventListener('change', changed);
        return () => {
            cancelAnimationFrame(frame);
            root.removeAttribute('data-custom-cursor');
            window.removeEventListener('pointermove', move);
            document.documentElement.removeEventListener('pointerleave', hide);
            window.removeEventListener('blur', hide);
            window.removeEventListener('keydown', keyboard);
            window.removeEventListener('scroll', scroll);
            document.removeEventListener('visibilitychange', hide);
            finePointer.removeEventListener('change', changed);
        };
    }, [x, y, ringX, ringY]);

    return <div aria-hidden="true" className="custom-cursor-layer fixed inset-0 pointer-events-none z-[10000]" style={{ visibility: appearance.visible ? 'visible' : 'hidden' }}>
        <motion.div className="fixed left-0 top-0 w-1.5 h-1.5 rounded-full bg-blue-200" style={{ x, y, translateX: '-50%', translateY: '-50%' }} />
        <motion.div className="fixed left-0 top-0 w-7 h-7 rounded-full border border-blue-400/65" style={{ x: reducedMotion ? x : ringX, y: reducedMotion ? y : ringY, translateX: '-50%', translateY: '-50%' }}
            animate={{ scale: appearance.interactive ? 1.45 : 1, backgroundColor: appearance.interactive ? 'rgba(59,130,246,0.07)' : 'rgba(59,130,246,0)' }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.18, ease: 'easeOut' }} />
    </div>;
}
