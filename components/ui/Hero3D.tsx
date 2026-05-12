'use client';

import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedBlob() {
    return (
        <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
            <Sphere args={[1.2, 64, 64]} scale={1.2}>
                <MeshDistortMaterial
                    color="#2563eb"
                    attach="material"
                    distort={0.5}
                    speed={2}
                    roughness={0.2}
                    metalness={0.8}
                    wireframe={true}
                />
            </Sphere>
        </Float>
    );
}

function Particles({ count = 300 }) {
    const mesh = useRef<THREE.InstancedMesh>(null);
    const dummy = React.useMemo(() => new THREE.Object3D(), []);

    const particles = React.useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 15;
            const y = (Math.random() - 0.5) * 15;
            const z = (Math.random() - 0.5) * 15;
            const factor = Math.random() * 0.5 + 0.5;
            const speed = Math.random() * 0.01 + 0.005;
            temp.push({ x, y, z, factor, speed });
        }
        return temp;
    }, [count]);

    useFrame(() => {
        if (!mesh.current) return;
        particles.forEach((particle, i) => {
            const t = performance.now() * particle.speed;
            particle.y += Math.sin(t * 0.1) * 0.02;
            particle.x += Math.cos(t * 0.1) * 0.02;
            
            dummy.position.set(particle.x, particle.y, particle.z);
            dummy.scale.setScalar(particle.factor);
            dummy.updateMatrix();
            mesh.current!.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
            <dodecahedronGeometry args={[0.02, 0]} />
            <meshBasicMaterial color="#60a5fa" transparent opacity={0.5} />
        </instancedMesh>
    );
}

function Rig() {
    const mouse = useRef({ x: 0, y: 0 });
    
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useFrame((state) => {
        state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, mouse.current.x * 2, 0.05);
        state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, mouse.current.y * 2, 0.05);
        state.camera.lookAt(0, 0, 0);
    });
    return null;
}

export default function Hero3D() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-80 mix-blend-screen">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                
                <AnimatedBlob />
                <Particles count={400} />
                <Rig />
            </Canvas>
        </div>
    );
}
