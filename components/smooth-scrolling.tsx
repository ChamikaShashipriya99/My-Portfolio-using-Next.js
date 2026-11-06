'use client';

import { ReactLenis } from 'lenis/react';
import { ReactNode, useEffect } from 'react';

export default function SmoothScrolling({ children }: { children: ReactNode }) {
    useEffect(() => {
        let idle: number | undefined;
        let timer: ReturnType<typeof setTimeout> | undefined;
        const register = () => { void navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' }).catch(() => {}); };
        if ('serviceWorker' in navigator) {
            if (process.env.NODE_ENV === 'production') {
                if ('requestIdleCallback' in window) idle = window.requestIdleCallback(register, { timeout: 4000 });
                else timer = setTimeout(register, 3000);
            } else {
                void navigator.serviceWorker.getRegistrations().then(registrations => {
                    registrations.forEach(registration => {
                        const script = registration.active?.scriptURL || registration.waiting?.scriptURL;
                        if (script && new URL(script).pathname === '/sw.js') void registration.unregister();
                    });
                }).catch(() => {});
            }
        }

        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        document.addEventListener('contextmenu', handleContextMenu);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            if (idle !== undefined) window.cancelIdleCallback(idle);
            if (timer) clearTimeout(timer);
        };
    }, []);

    return (
        <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
            {children}
        </ReactLenis>
    );
}
