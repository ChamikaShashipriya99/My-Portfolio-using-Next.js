'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import Galaxy from './Galaxy';

export default function SceneCanvas() {
    return (
        <div className="fixed inset-0 -z-10 bg-black">
            <Canvas
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 2]} // Performance optimization
            >
                <PerspectiveCamera makeDefault position={[0, 5, 12]} fov={75} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />

                <Suspense fallback={null}>
                    <Galaxy />
                </Suspense>

                <fog attach="fog" args={['#000', 5, 30]} />
            </Canvas>
        </div>
    );
}
