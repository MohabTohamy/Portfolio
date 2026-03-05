'use client';

import { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Section, SectionTitle, Card } from '@/components/UI';
import { BoxSelect, Layers as LayersIcon, ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function ThreeLabPage() {
    const canvasRef = useRef<HTMLDivElement>(null);
    const section1Ref = useRef<HTMLDivElement>(null);
    const section2Ref = useRef<HTMLDivElement>(null);
    const section3Ref = useRef<HTMLDivElement>(null);
    const section4Ref = useRef<HTMLDivElement>(null);

    return (
        <div className="min-h-screen">
            {/* Hero Section with Scroll Indicator */}
            <Section className="min-h-screen flex items-center justify-center relative">
                <div className="text-center">
                    <SectionTitle subtitle="Scroll-based 3D visualization and engineering simulations">
                        3D Engineering Lab
                    </SectionTitle>
                    <p className="text-foreground/60 text-lg mb-8 max-w-2xl mx-auto">
                        Experience interactive 3D engineering visualizations with scroll-triggered animations
                    </p>
                    <div className="flex flex-col items-center gap-2 animate-bounce">
                        <span className="text-sm text-foreground/50">Scroll to explore</span>
                        <ChevronDown className="w-6 h-6 text-primary" />
                    </div>
                </div>
            </Section>

            {/* Scroll-Driven 3D Experience */}
            <div className="relative">
                {/* Fixed Canvas */}
                <div ref={canvasRef} className="sticky top-0 h-screen w-full">
                    <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
                        <Suspense fallback={null}>
                            <ambientLight intensity={0.5} />
                            <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1} />
                            <pointLight position={[-10, -10, -10]} intensity={0.5} />
                            <ScrollScene 
                                section1Ref={section1Ref}
                                section2Ref={section2Ref}
                                section3Ref={section3Ref}
                                section4Ref={section4Ref}
                            />
                        </Suspense>
                    </Canvas>
                </div>

                {/* Scroll Content Sections */}
                <div className="relative pointer-events-none">
                    {/* Section 1: Introduction */}
                    <div ref={section1Ref} className="h-screen flex items-center justify-end px-8 md:px-16">
                        <div className="max-w-md pointer-events-auto">
                            <Card className="bg-background/90 backdrop-blur-lg border-2 border-primary/30">
                                <div className="flex items-center gap-2 mb-4">
                                    <BoxSelect className="w-6 h-6 text-primary" />
                                    <h3 className="text-2xl font-bold text-foreground">
                                        Interactive 3D Objects
                                    </h3>
                                </div>
                                <p className="text-foreground/80 leading-relaxed">
                                    Explore engineering concepts through interactive 3D visualizations. 
                                    Watch as objects transform and animate based on your scroll position.
                                </p>
                            </Card>
                        </div>
                    </div>

                    {/* Section 2: Rotation */}
                    <div ref={section2Ref} className="h-screen flex items-center justify-start px-8 md:px-16">
                        <div className="max-w-md pointer-events-auto">
                            <Card className="bg-background/90 backdrop-blur-lg border-2 border-accent/30">
                                <h3 className="text-2xl font-bold text-foreground mb-4">
                                    Dynamic Transformations
                                </h3>
                                <p className="text-foreground/80 leading-relaxed mb-4">
                                    The cube rotates and scales as you scroll, demonstrating 
                                    real-time 3D transformations and animations.
                                </p>
                                <div className="flex gap-2 flex-wrap">
                                    <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                                        Rotation
                                    </span>
                                    <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm">
                                        Scaling
                                    </span>
                                    <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                                        Position
                                    </span>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Section 3: Pavement Layers */}
                    <div ref={section3Ref} className="h-screen flex items-center justify-end px-8 md:px-16">
                        <div className="max-w-md pointer-events-auto">
                            <Card className="bg-background/90 backdrop-blur-lg border-2 border-primary/30">
                                <div className="flex items-center gap-2 mb-4">
                                    <LayersIcon className="w-6 h-6 text-accent" />
                                    <h3 className="text-2xl font-bold text-foreground">
                                        Pavement Structure
                                    </h3>
                                </div>
                                <p className="text-foreground/80 leading-relaxed mb-4">
                                    Watch as the pavement layers appear one by one, revealing 
                                    the complex structure of modern road engineering.
                                </p>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-gray-800 rounded"></div>
                                        <span className="text-sm text-foreground/70">Asphalt Layer</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-yellow-700 rounded"></div>
                                        <span className="text-sm text-foreground/70">Base Layer</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-amber-600 rounded"></div>
                                        <span className="text-sm text-foreground/70">Subbase Layer</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-orange-900 rounded"></div>
                                        <span className="text-sm text-foreground/70">Subgrade</span>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Section 4: Final View */}
                    <div ref={section4Ref} className="h-screen flex items-center justify-center px-8">
                        <div className="max-w-2xl pointer-events-auto text-center">
                            <Card className="bg-background/90 backdrop-blur-lg border-2 border-accent/30">
                                <h3 className="text-3xl font-bold text-foreground mb-4">
                                    Engineering Visualization
                                </h3>
                                <p className="text-foreground/80 leading-relaxed mb-6">
                                    This is just the beginning. Imagine complex structural analysis, 
                                    real-time simulations, and interactive engineering tools powered 
                                    by cutting-edge 3D technology.
                                </p>
                                <div className="flex flex-wrap gap-3 justify-center">
                                    <span className="px-4 py-2 bg-primary/20 text-primary rounded-lg text-sm font-medium">
                                        Three.js
                                    </span>
                                    <span className="px-4 py-2 bg-accent/20 text-accent rounded-lg text-sm font-medium">
                                        GSAP ScrollTrigger
                                    </span>
                                    <span className="px-4 py-2 bg-primary/20 text-primary rounded-lg text-sm font-medium">
                                        React Three Fiber
                                    </span>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Static Content Below */}
            <Section className="bg-card/30">
                <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
                    Traditional 3D Viewers
                </h3>
                
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Rotating Cube Demo */}
                    <Card>
                        <div className="flex items-center gap-2 mb-4">
                            <BoxSelect className="w-5 h-5 text-primary" />
                            <h3 className="text-xl font-semibold text-foreground">
                                Rotating Object
                            </h3>
                        </div>
                        <p className="text-foreground/70 mb-4 text-sm">
                            Interactive 3D object with orbit controls. Drag to rotate, scroll to
                            zoom.
                        </p>
                        <div className="h-96 bg-linear-to-br from-background to-card rounded-lg overflow-hidden">
                            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                                <Suspense fallback={null}>
                                    <ambientLight intensity={0.5} />
                                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                                    <pointLight position={[-10, -10, -10]} />
                                    <RotatingCube />
                                    <OrbitControls />
                                </Suspense>
                            </Canvas>
                        </div>
                    </Card>

                    {/* Pavement Layers */}
                    <Card>
                        <div className="flex items-center gap-2 mb-4">
                            <LayersIcon className="w-5 h-5 text-accent" />
                            <h3 className="text-xl font-semibold text-foreground">
                                Pavement Structure
                            </h3>
                        </div>
                        <p className="text-foreground/70 mb-4 text-sm">
                            3D representation of pavement layers: asphalt, base, subbase, and
                            subgrade.
                        </p>
                        <div className="h-96 bg-linear-to-br from-background to-card rounded-lg overflow-hidden">
                            <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
                                <Suspense fallback={null}>
                                    <ambientLight intensity={0.5} />
                                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                                    <PavementLayers />
                                    <OrbitControls />
                                </Suspense>
                            </Canvas>
                        </div>
                    </Card>
                </div>

                {/* Layer Information */}
                <div className="grid md:grid-cols-4 gap-6 mt-6">
                    <Card>
                        <div className="w-full h-4 bg-gray-800 rounded mb-3" />
                        <h4 className="font-semibold text-foreground mb-1">Asphalt Layer</h4>
                        <p className="text-sm text-foreground/70">
                            Surface layer, typically 5-10 cm thick
                        </p>
                    </Card>
                    <Card>
                        <div className="w-full h-4 bg-yellow-700 rounded mb-3" />
                        <h4 className="font-semibold text-foreground mb-1">Base Layer</h4>
                        <p className="text-sm text-foreground/70">
                            Crushed stone, 15-30 cm thick
                        </p>
                    </Card>
                    <Card>
                        <div className="w-full h-4 bg-amber-600 rounded mb-3" />
                        <h4 className="font-semibold text-foreground mb-1">Subbase Layer</h4>
                        <p className="text-sm text-foreground/70">
                            Granular material, 20-40 cm thick
                        </p>
                    </Card>
                    <Card>
                        <div className="w-full h-4 bg-orange-900 rounded mb-3" />
                        <h4 className="font-semibold text-foreground mb-1">Subgrade</h4>
                        <p className="text-sm text-foreground/70">
                            Natural soil foundation
                        </p>
                    </Card>
                </div>

                {/* Future Features */}
                <Card className="mt-6 bg-linear-to-br from-primary/10 to-accent/10">
                    <h3 className="text-xl font-semibold text-foreground mb-4">
                        Coming Soon
                    </h3>
                    <ul className="space-y-2 text-foreground/70">
                        <li className="flex items-start gap-2">
                            <span className="text-primary">◆</span>
                            <span>FWD deflection basin visualization in 3D</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-accent">◆</span>
                            <span>Interactive stress distribution analysis</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary">◆</span>
                            <span>3D product design models and CAD exports</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-accent">◆</span>
                            <span>Real-time engineering simulations</span>
                        </li>
                    </ul>
                </Card>
            </Section>
        </div>
    );
}

// Scroll-Triggered Scene Component
interface ScrollSceneProps {
    section1Ref: React.RefObject<HTMLDivElement | null>;
    section2Ref: React.RefObject<HTMLDivElement | null>;
    section3Ref: React.RefObject<HTMLDivElement | null>;
    section4Ref: React.RefObject<HTMLDivElement | null>;
}

function ScrollScene({ section1Ref, section2Ref, section3Ref, section4Ref }: ScrollSceneProps) {
    const cubeRef = useRef<THREE.Mesh>(null);
    const layersGroupRef = useRef<THREE.Group>(null);
    const { camera } = useThree();

    useEffect(() => {
        if (!cubeRef.current || !layersGroupRef.current) return;

        const cube = cubeRef.current;
        const layers = layersGroupRef.current;

        // Initially hide layers
        layers.visible = false;

        // Section 1: Cube appears and spins
        if (section1Ref.current) {
            gsap.fromTo(
                cube.rotation,
                { x: 0, y: 0, z: 0 },
                {
                    x: Math.PI * 0.5,
                    y: Math.PI * 0.5,
                    z: 0,
                    scrollTrigger: {
                        trigger: section1Ref.current,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1,
                    },
                }
            );

            gsap.fromTo(
                cube.scale,
                { x: 0.1, y: 0.1, z: 0.1 },
                {
                    x: 1, y: 1, z: 1,
                    scrollTrigger: {
                        trigger: section1Ref.current,
                        start: 'top center',
                        end: 'center center',
                        scrub: 1,
                    },
                }
            );
        }

        // Section 2: Cube continues spinning and moves
        if (section2Ref.current) {
            gsap.to(cube.rotation, {
                x: Math.PI * 2,
                y: Math.PI * 2,
                z: Math.PI * 0.5,
                scrollTrigger: {
                    trigger: section2Ref.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1,
                },
            });

            gsap.to(cube.position, {
                x: 2,
                y: 1,
                scrollTrigger: {
                    trigger: section2Ref.current,
                    start: 'top center',
                    end: 'bottom center',
                    scrub: 1,
                },
            });

            gsap.to(cube.scale, {
                x: 1.5,
                y: 1.5,
                z: 1.5,
                scrollTrigger: {
                    trigger: section2Ref.current,
                    start: 'top center',
                    end: 'center center',
                    scrub: 1,
                },
            });
        }

        // Section 3: Transition to pavement layers
        if (section3Ref.current) {
            gsap.to(cube.scale, {
                x: 0.1,
                y: 0.1,
                z: 0.1,
                scrollTrigger: {
                    trigger: section3Ref.current,
                    start: 'top center',
                    end: 'top top',
                    scrub: 1,
                },
            });

            gsap.to(cube.position, {
                x: 0,
                y: 0,
                scrollTrigger: {
                    trigger: section3Ref.current,
                    start: 'top center',
                    end: 'top top',
                    scrub: 1,
                },
            });

            // Show layers and animate them
            ScrollTrigger.create({
                trigger: section3Ref.current,
                start: 'top center',
                onEnter: () => {
                    layers.visible = true;
                    // Animate each layer appearing
                    layers.children.forEach((layer, index) => {
                        gsap.fromTo(
                            layer.position,
                            { y: (layer.position as THREE.Vector3).y - 5 },
                            {
                                y: (layer.position as THREE.Vector3).y,
                                duration: 0.8,
                                delay: index * 0.2,
                                ease: 'power2.out',
                            }
                        );
                        gsap.fromTo(
                            layer.scale,
                            { x: 0.1, y: 0.1, z: 0.1 },
                            {
                                x: 1, y: 1, z: 1,
                                duration: 0.8,
                                delay: index * 0.2,
                                ease: 'back.out(1.7)',
                            }
                        );
                    });
                },
            });

            gsap.to(layers.rotation, {
                y: Math.PI * 2,
                scrollTrigger: {
                    trigger: section3Ref.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1,
                },
            });
        }

        // Section 4: Final camera movement
        if (section4Ref.current) {
            gsap.to(camera.position, {
                z: 12,
                y: 5,
                scrollTrigger: {
                    trigger: section4Ref.current,
                    start: 'top center',
                    end: 'center center',
                    scrub: 1,
                },
            });

            gsap.to(layers.rotation, {
                x: -Math.PI * 0.3,
                y: Math.PI * 2.5,
                scrollTrigger: {
                    trigger: section4Ref.current,
                    start: 'top center',
                    end: 'bottom center',
                    scrub: 1,
                },
            });
        }

        // Cleanup
        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, [section1Ref, section2Ref, section3Ref, section4Ref, camera]);

    return (
        <>
            {/* Animated Cube */}
            <mesh ref={cubeRef}>
                <boxGeometry args={[2, 2, 2]} />
                <meshStandardMaterial
                    color="#2563EB"
                    metalness={0.6}
                    roughness={0.2}
                />
            </mesh>

            {/* Pavement Layers */}
            <group ref={layersGroupRef}>
                <PavementLayers />
            </group>

            {/* Grid Helper */}
            <gridHelper args={[20, 20, '#334155', '#1e293b']} position={[0, -3, 0]} />
        </>
    );
}

// Rotating Cube Component (for static viewer)
function RotatingCube() {
    const meshRef = useRef<THREE.Mesh>(null);
    
    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.5;
            meshRef.current.rotation.y += delta * 0.7;
        }
    });

    return (
        <mesh ref={meshRef} rotation={[0.5, 0.5, 0]}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial
                color="#2563EB"
                metalness={0.5}
                roughness={0.2}
            />
        </mesh>
    );
}

// Pavement Layers Component
function PavementLayers() {
    const layers = [
        { color: '#1f2937', position: [0, 1.5, 0], height: 0.3, name: 'Asphalt' },
        { color: '#a16207', position: [0, 0.9, 0], height: 0.6, name: 'Base' },
        { color: '#d97706', position: [0, 0, 0], height: 0.9, name: 'Subbase' },
        { color: '#9a3412', position: [0, -1.2, 0], height: 1.2, name: 'Subgrade' },
    ];

    return (
        <group>
            {layers.map((layer, index) => (
                <mesh key={index} position={layer.position as [number, number, number]}>
                    <boxGeometry args={[4, layer.height, 4]} />
                    <meshStandardMaterial color={layer.color} />
                </mesh>
            ))}
        </group>
    );
}
