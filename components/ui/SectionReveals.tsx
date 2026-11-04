'use client';

import { useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';

export default function SectionReveals() {
    const reducedMotion = useReducedMotion();
    useEffect(() => {
        if (reducedMotion) return;
        const root = document.getElementById('main-content');
        if (!root) return;
        const watched = new WeakSet<Element>();
        const animations = new Map<Element, Animation>();
        const observer = new IntersectionObserver(entries => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                observer.unobserve(entry.target);
                // Keep content in the DOM and readable even before animation loads.
                const animation = entry.target.animate([
                    { opacity: 0.72, translate: '0 14px' },
                    { opacity: 1, translate: '0 0' },
                ], { duration: 600, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
                animations.set(entry.target, animation);
                animation.onfinish = () => animations.delete(entry.target);
            }
        }, { threshold: 0.06, rootMargin: '0px 0px -32px 0px' });
        const discover = () => {
            root.querySelectorAll(':scope > section:not(#home) > .container').forEach(element => {
                if (watched.has(element)) return;
                watched.add(element);
                observer.observe(element);
            });
        };
        discover();
        const mutations = new MutationObserver(discover);
        mutations.observe(root, { childList: true, subtree: true });
        return () => {
            observer.disconnect();
            mutations.disconnect();
            animations.forEach(animation => animation.cancel());
        };
    }, [reducedMotion]);
    return null;
}
