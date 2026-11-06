'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Background from './Background';
import SectionReveals from './SectionReveals';
import ScrollToTop from './ScrollToTop';
import FloatingWhatsApp from './FloatingWhatsApp';
const AIChatbot = dynamic(() => import('./AIChatbot'), { ssr: false });
const DevConsole = dynamic(() => import('./DevConsole'), { ssr: false });
const CustomCursor = dynamic(() => import('./CustomCursor'), { ssr: false });
export default function SiteEnhancements() {
    const [idle, setIdle] = useState(false);
    useEffect(() => {
        if ('requestIdleCallback' in window) {
            const id = window.requestIdleCallback(() => setIdle(true), { timeout: 2500 });
            return () => window.cancelIdleCallback(id);
        }
        const timer = setTimeout(() => setIdle(true), 1200);
        return () => clearTimeout(timer);
    }, []);
    return <><Background /><SectionReveals /><ScrollToTop /><FloatingWhatsApp />{idle && <><AIChatbot /><DevConsole /><CustomCursor /></>}</>;
}
