'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCommit, ZoomIn, RotateCcw, Activity } from 'lucide-react';
import GlassCard from './GlassCard';

interface DayData {
    date: string;
    contributionCount: number;
    color: string;
}

interface CalendarData {
    totalContributions: number;
    weeks: {
        contributionDays: DayData[];
    }[];
}

// Flat list of days helper
function getFlattenedDays(calendarData: CalendarData | null): DayData[] {
    if (!calendarData) return [];
    const days: DayData[] = [];
    calendarData.weeks.forEach(week => {
        week.contributionDays.forEach(day => {
            days.push(day);
        });
    });
    return days;
}

// 3D City mesh rendering component
interface CityMeshProps {
    days: DayData[];
    onHoverDay: (day: DayData | null, clientX?: number, clientY?: number) => void;
    animationProgress: number;
}

function DevCity({ days, onHoverDay, animationProgress }: CityMeshProps) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const { raycaster, camera, mouse } = useThree();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const dummy = useMemo(() => new THREE.Object3D(), []);
    const tempColor = useMemo(() => new THREE.Color(), []);

    const countX = 52; // Weeks
    const countZ = 7;   // Days
    const spacingX = 0.28;
    const spacingZ = 0.28;
    const size = 0.2;

    // Set initial position, scale and color for all instances
    useEffect(() => {
        if (!meshRef.current) return;

        days.forEach((day, index) => {
            const w = Math.floor(index / 7);
            const d = index % 7;

            // Center the grid around origin
            const x = (w - countX / 2) * spacingX;
            const z = (d - countZ / 2) * spacingZ;

            // Height is based on commits, scaled down slightly
            // We multiply height by the entrance animation progress
            const height = Math.max(0.05, day.contributionCount * 0.25) * animationProgress;

            dummy.position.set(x, height / 2, z);
            dummy.scale.set(size, height, size);
            dummy.updateMatrix();

            meshRef.current!.setMatrixAt(index, dummy.matrix);

            // Set normal color
            tempColor.set(day.color);
            meshRef.current!.setColorAt(index, tempColor);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) {
            meshRef.current.instanceColor.needsUpdate = true;
        }
    }, [days, animationProgress, dummy, tempColor]);

    return (
        <instancedMesh 
            ref={meshRef} 
            args={[undefined, undefined, days.length]} 
            castShadow 
            receiveShadow
            onPointerMove={(e) => {
                e.stopPropagation();
                const instanceId = e.instanceId;
                if (instanceId !== undefined && instanceId < days.length) {
                    if (instanceId !== hoveredIndex) {
                        // Restore old color of previously hovered block
                        if (hoveredIndex !== null && days[hoveredIndex]) {
                            tempColor.set(days[hoveredIndex].color);
                            meshRef.current!.setColorAt(hoveredIndex, tempColor);
                        }

                        setHoveredIndex(instanceId);

                        // Highlight color of new block
                        tempColor.set('#60a5fa'); // Glow blue on hover
                        meshRef.current!.setColorAt(instanceId, tempColor);
                        meshRef.current!.instanceColor!.needsUpdate = true;
                    }
                    
                    // Continually pass correct screen client coordinates to the tooltip
                    onHoverDay(days[instanceId], e.clientX, e.clientY);
                }
            }}
            onPointerOut={(e) => {
                if (hoveredIndex !== null && days[hoveredIndex]) {
                    // Restore original color
                    tempColor.set(days[hoveredIndex].color);
                    meshRef.current!.setColorAt(hoveredIndex, tempColor);
                    meshRef.current!.instanceColor!.needsUpdate = true;
                }
                setHoveredIndex(null);
                onHoverDay(null);
            }}
        >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial roughness={0.1} metalness={0.7} />
        </instancedMesh>
    );
}

// Scene setup with camera rotation
function CityScene({ days, onHoverDay, autoRotate, animationProgress }: { 
    days: DayData[]; 
    onHoverDay: (day: DayData | null, cx?: number, cy?: number) => void;
    autoRotate: boolean;
    animationProgress: number;
}) {
    const groupRef = useRef<THREE.Group>(null);
    const controlsRef = useRef<any>(null);

    useFrame((state) => {
        if (autoRotate && groupRef.current) {
            groupRef.current.rotation.y += 0.0025;
        }
    });

    return (
        <>
            <ambientLight intensity={0.6} />
            <directionalLight 
                position={[10, 20, 15]} 
                intensity={1.2} 
                castShadow 
                shadow-mapSize-width={1024} 
                shadow-mapSize-height={1024} 
            />
            <pointLight position={[-10, 10, -10]} intensity={0.5} />

            <group ref={groupRef}>
                <DevCity days={days} onHoverDay={onHoverDay} animationProgress={animationProgress} />
                
                {/* City Grid Plate */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
                    <planeGeometry args={[16, 3]} />
                    <meshStandardMaterial color="#0c0f17" roughness={0.9} metalness={0.1} />
                </mesh>
            </group>

            <OrbitControls 
                ref={controlsRef}
                enableZoom={true} 
                maxPolarAngle={Math.PI / 2 - 0.05} // don't go below ground
                minDistance={5}
                maxDistance={15}
                makeDefault
            />
        </>
    );
}

export default function ContributionSkyline() {
    const [calendarData, setCalendarData] = useState<CalendarData | null>(null);
    const [loading, setLoading] = useState(true);
    const [hoveredDay, setHoveredDay] = useState<DayData | null>(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
    const [autoRotate, setAutoRotate] = useState(true);
    const [animationProgress, setAnimationProgress] = useState(0);
    const [isClient, setIsClient] = useState(false);

    // Track client mounting
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Fetch contribution data
    useEffect(() => {
        const fetchContributions = async () => {
            try {
                const res = await fetch('/api/github-contributions');
                const result = await res.json();
                setCalendarData(result.data);
            } catch (error) {
                console.error('Failed to load contributions:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchContributions();
    }, []);

    // Entrance height animation loop
    useEffect(() => {
        if (loading || !calendarData) return;

        let frameId: number;
        let startTimestamp: number | null = null;
        const duration = 1800; // 1.8 seconds

        const animate = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const elapsed = timestamp - startTimestamp;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out cubic
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            setAnimationProgress(easeOutCubic);

            if (progress < 1) {
                frameId = requestAnimationFrame(animate);
            }
        };

        frameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameId);
    }, [loading, calendarData]);

    const days = useMemo(() => getFlattenedDays(calendarData), [calendarData]);

    const handleHoverDay = (day: DayData | null, clientX?: number, clientY?: number) => {
        setHoveredDay(day);
        if (clientX !== undefined && clientY !== undefined) {
            setTooltipPos({ x: clientX, y: clientY });
        }
    };

    const handleResetCamera = () => {
        // Simple turntable switch
        setAutoRotate(prev => !prev);
    };

    return (
        <section id="skyline" className="py-24 5xl:py-48 relative overflow-hidden bg-black/30 border-t border-b border-white/5">
            <div className="container mx-auto px-6 relative z-10">
                
                {/* Section Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                    <div className="space-y-4">
                        <h2 className="text-3xl sm:text-5xl lg:text-6xl 3xl:text-7xl font-black text-white tracking-tighter uppercase leading-tight">
                            Dev <span className="text-blue-500">Skyline</span>
                        </h2>
                        <div className="h-1.5 w-24 bg-blue-600 rounded-full" />
                        <p className="text-gray-500 font-mono text-xs md:text-sm 3xl:text-base uppercase tracking-[0.4em]">
                            Interactive 3D GitHub Contribution City
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleResetCamera}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-mono text-[10px] uppercase tracking-wider border font-bold transition-all ${
                                autoRotate 
                                    ? 'bg-blue-600/10 border-blue-500/30 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                            }`}
                        >
                            <RotateCcw size={12} className={autoRotate ? 'animate-spin' : ''} /> 
                            {autoRotate ? "Auto-Rotate [ON]" : "Auto-Rotate [OFF]"}
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-4 gap-8 xl:gap-12 items-stretch">
                    {/* Left Stats Display Panel */}
                    <div className="lg:col-span-1 flex flex-col justify-between gap-6">
                        <GlassCard className="flex-1 flex flex-col justify-between p-6 md:p-8 bg-blue-950/5 border-white/5" hoverScale={false}>
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 text-blue-500">
                                    <Activity className="w-5 h-5" />
                                    <h3 className="font-mono text-xs uppercase tracking-widest font-bold text-white">Grid Telemetry</h3>
                                </div>

                                <div className="space-y-2">
                                    <div className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Total Commits (Last 365 Days)</div>
                                    <div className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-baseline gap-2">
                                        {loading ? "..." : calendarData?.totalContributions}
                                        <span className="text-xs font-mono font-bold text-green-500 uppercase tracking-widest">+Sync</span>
                                    </div>
                                </div>

                                <p className="text-gray-400 text-xs md:text-sm leading-relaxed opacity-80">
                                    This visualizer maps Chamika's version control telemetry. Every box represents a day, and its height models daily commits. Zoom, spin, or hover over buildings to read records.
                                </p>
                            </div>

                            {/* Color Legend */}
                            <div className="pt-6 border-t border-white/5 space-y-3">
                                <div className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Density scale</div>
                                <div className="flex items-center gap-1.5 font-mono text-[9px] text-gray-400">
                                    <span>Low</span>
                                    <span className="w-3.5 h-3.5 rounded bg-[#161b22] border border-white/5" title="0 commits" />
                                    <span className="w-3.5 h-3.5 rounded bg-[#0e4429]" title="1-2 commits" />
                                    <span className="w-3.5 h-3.5 rounded bg-[#006d32]" title="3-4 commits" />
                                    <span className="w-3.5 h-3.5 rounded bg-[#26a641]" title="5-6 commits" />
                                    <span className="w-3.5 h-3.5 rounded bg-[#39d353]" title="7+ commits" />
                                    <span>High</span>
                                </div>
                            </div>
                        </GlassCard>
                    </div>

                    {/* Right Interactive 3D WebGL Canvas Panel */}
                    <div className="lg:col-span-3 h-[450px] lg:h-[500px] xl:h-[550px] rounded-[2rem] overflow-hidden border border-white/10 relative bg-neutral-950/80">
                        {loading && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-4">
                                <div className="w-10 h-10 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                                <span className="font-mono text-xs text-blue-400 uppercase tracking-widest animate-pulse">Syncing City Matrix...</span>
                            </div>
                        )}

                        {isClient && !loading && days.length > 0 && (
                            <Canvas 
                                camera={{ position: [0, 6, 8], fov: 32 }}
                                shadows
                                className="w-full h-full relative cursor-grab active:cursor-grabbing"
                            >
                                <CityScene 
                                    days={days} 
                                    onHoverDay={handleHoverDay} 
                                    autoRotate={autoRotate}
                                    animationProgress={animationProgress}
                                />
                            </Canvas>
                        )}

                        {/* Interactive HUD guidelines */}
                        <div className="absolute bottom-4 left-6 pointer-events-none font-mono text-[9px] text-gray-500 uppercase tracking-wider flex items-center gap-2">
                            <ZoomIn className="w-3.5 h-3.5 text-blue-400" /> Click + Drag: Rotate | Scroll: Zoom | Right-Click: Pan
                        </div>

                        {/* Floating Tooltip HTML Overlay */}
                        <AnimatePresence>
                            {hoveredDay && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    style={{ 
                                        position: 'fixed', 
                                        left: tooltipPos.x + 15, 
                                        top: tooltipPos.y - 65, 
                                        pointerEvents: 'none' 
                                    }}
                                    className="z-50 min-w-[120px] bg-black/90 border border-blue-500/30 rounded-xl px-3 py-2 shadow-2xl backdrop-blur-md font-mono"
                                >
                                    <div className="text-[8px] text-gray-500 uppercase tracking-wider mb-0.5">
                                        {new Date(hoveredDay.date).toLocaleDateString([], { 
                                            month: 'short', 
                                            day: 'numeric', 
                                            year: 'numeric' 
                                        })}
                                    </div>
                                    <div className="text-white text-xs font-bold flex items-center gap-1.5">
                                        <GitCommit className="w-3.5 h-3.5 text-blue-500" />
                                        <span>{hoveredDay.contributionCount} commits</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

            </div>
        </section>
    );
}
