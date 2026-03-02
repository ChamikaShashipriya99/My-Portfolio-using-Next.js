'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const skills = [
    'React', 'Next.js', 'TypeScript', 'Three.js',
    'Tailwind', 'Node.js', 'Framer Motion', 'PostgreSQL',
    'Docker', 'AWS', 'GraphQL', 'Python'
];

function SkillWord({ word, position }: { word: string, position: THREE.Vector3 }) {
    const textRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (textRef.current) {
            textRef.current.quaternion.copy(state.camera.quaternion);
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <group position={position} ref={textRef}>
                <Text
                    fontSize={0.4}
                    color="white"
                    font="/fonts/Inter-Bold.woff" // Assuming font exists or using default
                    anchorX="center"
                    anchorY="middle"
                >
                    {word}
                </Text>
            </group>
        </Float>
    );
}

export default function SkillsSphere() {
    const groupRef = useRef<THREE.Group>(null);

    const points = useMemo(() => {
        const p = [];
        const count = skills.length;
        for (let i = 0; i < count; i++) {
            const phi = Math.acos(-1 + (2 * i) / count);
            const theta = Math.sqrt(count * Math.PI) * phi;
            p.push(new THREE.Vector3().setFromSphericalCoords(4, phi, theta));
        }
        return p;
    }, []);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.005;
        }
    });

    return (
        <group ref={groupRef}>
            <Sphere args={[3.5, 32, 32]}>
                <meshPhongMaterial color="#1d4ed8" wireframe opacity={0.1} transparent />
            </Sphere>
            {skills.map((skill, i) => (
                <SkillWord key={skill} word={skill} position={points[i]} />
            ))}
        </group>
    );
}
