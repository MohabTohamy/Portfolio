'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Section, SectionTitle, Card } from '@/components/UI';
import { BoxSelect, Layers as LayersIcon } from 'lucide-react';

export default function ThreeLabPage() {
    return (
        <div className="min-h-screen py-16">
            <Section>
                <SectionTitle subtitle="3D visualization and engineering simulations">
                    3D Engineering Lab
                </SectionTitle>

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

// Rotating Cube Component
function RotatingCube() {
    return (
        <mesh rotation={[0.5, 0.5, 0]}>
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
