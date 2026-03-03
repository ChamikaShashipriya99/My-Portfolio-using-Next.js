import React from 'react';
import GlassCard from '@/components/ui/GlassCard';

export default function Loading() {
    return (
        <div className="min-h-screen bg-black overflow-hidden">
            {/* Header Skeleton */}
            <header className="relative h-[60vh] flex items-end border-b border-white/5 bg-neutral-900/20">
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />

                <div className="container mx-auto px-6 pb-12 relative z-10 space-y-8">
                    {/* Back Button Skeleton */}
                    <div className="w-32 h-4 bg-white/5 rounded animate-pulse" />

                    <div className="space-y-4">
                        {/* Title Skeleton */}
                        <div className="w-3/4 max-w-2xl h-16 md:h-24 bg-white/10 rounded-2xl animate-pulse" />

                        {/* Meta Stats Skeleton */}
                        <div className="flex gap-6">
                            <div className="w-24 h-4 bg-white/5 rounded animate-pulse" />
                            <div className="w-24 h-4 bg-white/5 rounded animate-pulse" />
                            <div className="w-24 h-4 bg-white/5 rounded animate-pulse" />
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-6 py-16">
                <div className="grid lg:grid-cols-3 gap-16">
                    {/* Main Content Skeleton */}
                    <div className="lg:col-span-2 space-y-12">
                        <div className="space-y-6">
                            {/* Header Placeholder */}
                            <div className="w-1/2 h-10 bg-white/10 rounded-xl animate-pulse" />

                            {/* Text Paragraphs Placeholder */}
                            <div className="space-y-3">
                                <div className="w-full h-4 bg-white/5 rounded animate-pulse" />
                                <div className="w-full h-4 bg-white/5 rounded animate-pulse" />
                                <div className="w-5/6 h-4 bg-white/5 rounded animate-pulse" />
                            </div>

                            <div className="space-y-3 pt-8">
                                <div className="w-full h-4 bg-white/5 rounded animate-pulse" />
                                <div className="w-full h-4 bg-white/5 rounded animate-pulse" />
                                <div className="w-2/3 h-4 bg-white/5 rounded animate-pulse" />
                            </div>

                            {/* Image Placeholder */}
                            <div className="w-full aspect-video bg-white/5 rounded-3xl animate-pulse my-12" />

                            <div className="space-y-3 pt-8">
                                <div className="w-full h-4 bg-white/5 rounded animate-pulse" />
                                <div className="w-full h-4 bg-white/5 rounded animate-pulse" />
                                <div className="w-full h-4 bg-white/5 rounded animate-pulse" />
                                <div className="w-1/2 h-4 bg-white/5 rounded animate-pulse" />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Skeleton */}
                    <aside className="lg:col-span-1 space-y-8">
                        <GlassCard className="p-8 space-y-10">
                            {/* ToC Skeleton */}
                            <div className="space-y-4">
                                <div className="w-32 h-4 bg-white/10 rounded animate-pulse" />
                                <div className="space-y-2">
                                    <div className="w-full h-3 bg-white/5 rounded animate-pulse" />
                                    <div className="w-5/6 h-3 bg-white/5 rounded animate-pulse pl-4" />
                                    <div className="w-4/6 h-3 bg-white/5 rounded animate-pulse pl-4" />
                                    <div className="w-full h-3 bg-white/5 rounded animate-pulse" />
                                </div>
                            </div>

                            {/* Project Intel Skeleton */}
                            <div className="space-y-6">
                                <div className="w-32 h-4 bg-white/10 rounded animate-pulse" />
                                <div className="space-y-4">
                                    <div className="w-full h-14 bg-blue-600/20 rounded-xl animate-pulse" />
                                    <div className="w-full h-14 bg-white/5 rounded-xl animate-pulse" />
                                </div>
                            </div>
                        </GlassCard>
                    </aside>
                </div>
            </div>
        </div>
    );
}
