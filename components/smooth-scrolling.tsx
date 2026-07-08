'use client';

import { ReactLenis } from 'lenis/react';
import { ReactNode, useEffect } from 'react';

export default function SmoothScrolling({ children }: { children: ReactNode }) {
    useEffect(() => {
        // Register PWA Service Worker
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then((reg) => console.log('Service Worker registered successfully with scope:', reg.scope))
                .catch((err) => console.error('Service Worker registration failed:', err));
        }

        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        document.addEventListener('contextmenu', handleContextMenu);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
        };
    }, []);

    return (
        <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
            {children}
        </ReactLenis>
    );
}
