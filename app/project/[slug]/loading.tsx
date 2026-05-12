import React from 'react';
import GlassCard from '@/components/ui/GlassCard';

export default function Loading() {
    return (
        <div className="min-h-screen bg-black text-gray-300 pb-24 selection:bg-white/20 overflow-hidden">
            {/* Header Skeleton */}
            <header className="relative pt-32 pb-24 overflow-hidden border-b border-white/5">
                <div className="max-w-4xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
                    {/* Back Button Placeholder */}
                    <div className="w-32 h-4 bg-white/10 rounded animate-pulse mb-12" />

                    <div className="space-y-8 flex flex-col items-center w-full">
                        {/* Title Placeholder */}
                        <div className="w-3/4 max-w-2xl h-16 md:h-24 bg-white/10 rounded-2xl animate-pulse" />
                        
                        {/* Stats Pills Placeholder */}
                        <div className="flex flex-wrap items-center justify-center gap-6">
                            <div className="w-24 h-8 bg-white/5 rounded-full animate-pulse border border-white/10" />
                            <div className="w-32 h-8 bg-white/5 rounded-full animate-pulse border border-white/10" />
                            <div className="w-28 h-8 bg-white/5 rounded-full animate-pulse border border-white/10" />
                            <div className="w-32 h-8 bg-white/5 rounded-full animate-pulse border border-white/10" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Sticky Top Bar Skeleton */}
            <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-4xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="w-full sm:w-auto flex-1 overflow-hidden flex gap-4">
                        <div className="w-16 h-6 bg-white/10 rounded-full animate-pulse" />
                        <div className="w-20 h-6 bg-white/5 rounded-full animate-pulse" />
                        <div className="w-24 h-6 bg-white/5 rounded-full animate-pulse" />
                        <div className="w-16 h-6 bg-white/5 rounded-full animate-pulse" />
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="w-32 h-10 bg-white/10 rounded-full animate-pulse" />
                        <div className="w-28 h-10 bg-white/5 rounded-full animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Single Column Content Skeleton */}
            <div className="max-w-4xl mx-auto px-6 py-16">
                <div className="space-y-12">
                    <div className="space-y-6">
                        <div className="w-1/2 h-10 bg-white/10 rounded-xl animate-pulse" />
                        <div className="space-y-3">
                            <div className="w-full h-4 bg-white/5 rounded animate-pulse" />
                            <div className="w-full h-4 bg-white/5 rounded animate-pulse" />
                            <div className="w-5/6 h-4 bg-white/5 rounded animate-pulse" />
                        </div>

                        <div className="w-full aspect-video bg-white/5 rounded-3xl animate-pulse my-12" />

                        <div className="w-1/3 h-8 bg-white/10 rounded-lg animate-pulse pt-8" />
                        <div className="space-y-3">
                            <div className="w-full h-4 bg-white/5 rounded animate-pulse" />
                            <div className="w-full h-4 bg-white/5 rounded animate-pulse" />
                            <div className="w-2/3 h-4 bg-white/5 rounded animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Mission Pipeline Skeleton */}
                <section className="mt-32 pt-24 border-t border-white/5">
                    <div className="flex flex-col items-center text-center mb-16 gap-4">
                        <div className="w-64 h-12 bg-white/10 rounded-xl animate-pulse" />
                        <div className="w-16 h-1.5 bg-white/5 rounded-full animate-pulse" />
                        <div className="w-48 h-3 bg-white/5 rounded animate-pulse" />
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <GlassCard key={i} className="h-full flex flex-col p-4 3xl:p-8 space-y-6">
                                <div className="aspect-video rounded-2xl bg-white/5 animate-pulse" />
                                <div className="w-3/4 h-6 bg-white/10 rounded animate-pulse" />
                                <div className="space-y-2 flex-grow">
                                    <div className="w-full h-3 bg-white/5 rounded animate-pulse" />
                                    <div className="w-5/6 h-3 bg-white/5 rounded animate-pulse" />
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-12 h-5 bg-white/5 rounded animate-pulse" />
                                    <div className="w-16 h-5 bg-white/5 rounded animate-pulse" />
                                </div>
                                <div className="pt-4 border-t border-white/5">
                                    <div className="w-full h-10 bg-white/10 rounded-xl animate-pulse" />
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
