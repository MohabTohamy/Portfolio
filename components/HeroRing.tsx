'use client';

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// A quiet cousin of the particle ring in the 3D Lab, sized for the back of the home hero.
// Points only, no post-processing: it has to cost nothing on a phone.

const COUNT = 2400;

// Seeded, so the ring is the same shape on every render and every visit.
function seeded(seed: number) {
    return () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
}

const REDUCED = '(prefers-reduced-motion: reduce)';
function subscribeReduced(cb: () => void) {
    const mq = window.matchMedia(REDUCED);
    mq.addEventListener('change', cb);
    return () => mq.removeEventListener('change', cb);
}

function Ring({ still }: { still: boolean }) {
    const ref = useRef<THREE.Points>(null);

    const positions = useMemo(() => {
        const rand = seeded(7);
        const p = new Float32Array(COUNT * 3);
        for (let i = 0; i < COUNT; i++) {
            const band = i % 3;
            const a = (i / COUNT) * Math.PI * 2 * 7 + band;
            const r = 3.2 + band * 0.9 + (rand() - 0.5) * 0.35;
            p[i * 3] = Math.cos(a) * r;
            p[i * 3 + 1] = (rand() - 0.5) * 0.3 + Math.sin(a * 2) * 0.25;
            p[i * 3 + 2] = Math.sin(a) * r;
        }
        return p;
    }, []);

    useFrame((state, delta) => {
        if (!ref.current || still) return;
        ref.current.rotation.y += delta * 0.06;
        ref.current.rotation.x = 0.55 + state.pointer.y * 0.08;
        ref.current.rotation.z = state.pointer.x * 0.08;
    });

    return (
        <points ref={ref} rotation={[0.55, 0, 0]}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            </bufferGeometry>
            <pointsMaterial
                size={0.035}
                color="#E8704F"
                transparent
                opacity={0.75}
                depthWrite={false}
                sizeAttenuation
            />
        </points>
    );
}

export default function HeroRing() {
    const still = useSyncExternalStore(
        subscribeReduced,
        () => window.matchMedia(REDUCED).matches,
        () => false,
    );
    const [visible, setVisible] = useState(true);
    const host = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Stop drawing once the hero scrolls away.
        const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
        if (host.current) io.observe(host.current);

        return () => io.disconnect();
    }, []);

    return (
        <div ref={host} className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <Canvas
                camera={{ position: [0, 0, 9], fov: 45 }}
                dpr={[1, 1.5]}
                frameloop={visible && !still ? 'always' : 'demand'}
                gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
            >
                <Ring still={still} />
            </Canvas>
        </div>
    );
}
