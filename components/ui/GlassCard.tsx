import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    hoverScale?: boolean;
}

export default function GlassCard({ children, className, hoverScale = true }: GlassCardProps) {
    return (
        <div
            className={cn(
                'glassmorphism rounded-3xl p-6 transition-all duration-300 border border-white/10 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]',
                hoverScale && 'hover:-translate-y-2',
                className
            )}
        >
            {children}
        </div>
    );
}
