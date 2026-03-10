'use client';

import { Suspense, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial, Sphere, Box, Torus, Environment } from '@react-three/drei';
import { Section, SectionTitle } from '@/components/UI';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// Floating Data Sphere
function DataSphere({ position, color }: { position: [number, number, number]; color: string }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
            if (hovered) {
                meshRef.current.scale.lerp(new THREE.Vector3(1.3, 1.3, 1.3), 0.1);
            } else {
                meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
            }
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            <Sphere
                ref={meshRef}
                args={[1, 64, 64]}
                position={position}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <MeshDistortMaterial
                    color={color}
                    attach="material"
                    distort={0.4}
                    speed={2}
                    roughness={0.2}
                    metalness={0.8}
                />
            </Sphere>
        </Float>
    );
}

// Holographic Ring
function HolographicRing({ position, color }: { position: [number, number, number]; color: string }) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
            meshRef.current.rotation.z = state.clock.elapsedTime * 0.3;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
            <Torus ref={meshRef} args={[1.5, 0.1, 16, 100]} position={position}>
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={0.5}
                    metalness={0.9}
                    roughness={0.1}
                    wireframe
                />
            </Torus>
        </Float>
    );
}

// Animated Data Cube
function DataCube({ position }: { position: [number, number, number] }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [active, setActive] = useState(false);

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.x += 0.01;
            meshRef.current.rotation.y += 0.01;
            const scale = active ? 1.5 : 1;
            meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
        }
    });

    return (
        <Float speed={3} rotationIntensity={2} floatIntensity={1.5}>
            <Box
                ref={meshRef}
                args={[1, 1, 1]}
                position={position}
                onClick={() => setActive(!active)}
            >
                <meshStandardMaterial
                    color={active ? '#00ffff' : '#4a90e2'}
                    emissive={active ? '#00ffff' : '#4a90e2'}
                    emissiveIntensity={active ? 0.8 : 0.3}
                    metalness={0.9}
                    roughness={0.1}
                    wireframe={active}
                />
            </Box>
        </Float>
    );
}

// Helper function to generate particle data (outside component to avoid React purity checks)
function generateParticleData(count: number) {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 30;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 30;

        const color = new THREE.Color();
        color.setHSL(Math.random(), 0.8, 0.6);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }

    return { positions, colors, count };
}

// Particles System
function ParticleField() {
    const particlesRef = useRef<THREE.Points>(null);

    const particleData = useMemo(() => generateParticleData(1000), []);

    useFrame(() => {
        if (particlesRef.current) {
            particlesRef.current.rotation.y += 0.0005;
        }
    });

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[particleData.positions, 3]}
                    count={particleData.count}
                />
                <bufferAttribute
                    attach="attributes-color"
                    args={[particleData.colors, 3]}
                    count={particleData.count}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                vertexColors
                transparent
                opacity={0.6}
                sizeAttenuation
            />
        </points>
    );
}

// Pulsing Light Orb
function LightOrb({ position, color }: { position: [number, number, number]; color: string }) {
    const lightRef = useRef<THREE.PointLight>(null);

    useFrame((state) => {
        if (lightRef.current) {
            lightRef.current.intensity = 2 + Math.sin(state.clock.elapsedTime * 2) * 1;
        }
    });

    return (
        <>
            <pointLight ref={lightRef} position={position} color={color} intensity={2} distance={10} />
            <Float speed={2} floatIntensity={2}>
                <Sphere args={[0.2, 32, 32]} position={position}>
                    <meshStandardMaterial
                        color={color}
                        emissive={color}
                        emissiveIntensity={2}
                    />
                </Sphere>
            </Float>
        </>
    );
}

// Main 3D Scene
function DashboardScene() {
    return (
        <>
            {/* Lighting */}
            <ambientLight intensity={0.3} />
            <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1} castShadow />
            <spotLight position={[-10, -10, -10]} angle={0.3} penumbra={1} intensity={0.5} color="#00ffff" />

            {/* Environment */}
            <Environment preset="city" />

            {/* Light Orbs */}
            <LightOrb position={[5, 5, 0]} color="#ff00ff" />
            <LightOrb position={[-5, -5, 0]} color="#00ffff" />
            <LightOrb position={[0, 5, -5]} color="#ffff00" />

            {/* Data Spheres */}
            <DataSphere position={[-4, 2, 0]} color="#4a90e2" />
            <DataSphere position={[4, -2, 0]} color="#e24a90" />
            <DataSphere position={[0, 3, -3]} color="#90e24a" />

            {/* Holographic Rings */}
            <HolographicRing position={[0, 0, 0]} color="#00ffff" />
            <HolographicRing position={[3, 1, -2]} color="#ff00ff" />
            <HolographicRing position={[-3, -1, 2]} color="#ffff00" />

            {/* Data Cubes */}
            <DataCube position={[2, 3, -1]} />
            <DataCube position={[-2, -3, 1]} />
            <DataCube position={[0, -2, -4]} />

            {/* Particle Field */}
            <ParticleField />

            {/* Controls */}
            <OrbitControls
                enableZoom={true}
                enablePan={true}
                enableRotate={true}
                autoRotate
                autoRotateSpeed={0.5}
            />
        </>
    );
}

export default function FuturisticDashboardPage() {
    return (
        <div className="min-h-screen py-16">
            <Section>
                <SectionTitle subtitle="Real-time 3D visualization with Three.js">
                    Futuristic Dashboard
                </SectionTitle>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-8"
                >
                    <div className="glass rounded-xl p-6 mb-6">
                        <h3 className="text-2xl font-bold text-white mb-4">Interactive Features</h3>
                        <div className="grid md:grid-cols-2 gap-4 text-gray-300">
                            <div className="flex items-start gap-3">
                                <span className="text-cyan-400 text-2xl">🎯</span>
                                <div>
                                    <strong className="text-white">Click Data Cubes</strong>
                                    <p className="text-sm">Click the blue cubes to toggle wireframe mode</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-purple-400 text-2xl">🌀</span>
                                <div>
                                    <strong className="text-white">Hover Spheres</strong>
                                    <p className="text-sm">Hover over distorted spheres to see them grow</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-yellow-400 text-2xl">🔄</span>
                                <div>
                                    <strong className="text-white">Auto Rotation</strong>
                                    <p className="text-sm">Scene automatically rotates - drag to control manually</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-green-400 text-2xl">✨</span>
                                <div>
                                    <strong className="text-white">Dynamic Lighting</strong>
                                    <p className="text-sm">Pulsing light orbs create atmospheric effects</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* 3D Canvas */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="glass rounded-xl overflow-hidden"
                    style={{ height: '700px' }}
                >
                    <Canvas
                        camera={{ position: [0, 0, 15], fov: 60 }}
                        shadows
                        gl={{ antialias: true, alpha: true }}
                    >
                        <Suspense fallback={null}>
                            <DashboardScene />
                        </Suspense>
                    </Canvas>
                </motion.div>

                {/* Tech Stack */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-8 glass rounded-xl p-6"
                >
                    <h3 className="text-xl font-bold text-white mb-4">Built With</h3>
                    <div className="flex flex-wrap gap-3">
                        {['React Three Fiber', 'Three.js', 'React Three Drei', 'TypeScript', 'Framer Motion', 'WebGL'].map((tech) => (
                            <span
                                key={tech}
                                className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-gray-300 font-medium hover:bg-white/10 transition-colors"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </motion.div>
            </Section>
        </div>
    );
}
