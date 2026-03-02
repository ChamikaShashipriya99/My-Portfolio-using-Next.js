'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform float time;
  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float d = length(p);
    vec3 color = vec3(0.1, 0.2, 0.5) / d;
    gl_FragColor = vec4(color * (0.5 + 0.5 * sin(time)), 1.0);
  }
`;

export default function Galaxy() {
    const count = 5000;
    const points = useRef<THREE.Points>(null);

    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const radius = Math.random() * 10;
            const spin = radius * 5;
            const angle = Math.random() * Math.PI * 2;

            pos[i * 3 + 0] = Math.cos(angle + spin) * radius;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
            pos[i * 3 + 2] = Math.sin(angle + spin) * radius;
        }
        return pos;
    }, []);

    useFrame((state) => {
        if (!points.current) return;
        const time = state.clock.getElapsedTime();
        points.current.rotation.y = time * 0.05;

        // Mouse interaction
        const targetX = state.pointer.x * 0.2;
        const targetY = -state.pointer.y * 0.2;
        points.current.rotation.x += (targetY - points.current.rotation.x) * 0.05;
        points.current.rotation.z += (targetX - points.current.rotation.z) * 0.05;
    });

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.015}
                color="#3b82f6"
                transparent
                opacity={0.6}
                blending={THREE.AdditiveBlending}
                sizeAttenuation
            />
        </points>
    );
}
