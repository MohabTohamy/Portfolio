'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import { pointsInner, pointsOuter } from '@/lib/particleUtils';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import * as THREE from 'three';

const ParticleRingPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Animated Background */}
      <div 
        className="absolute inset-0 bg-slate-900 transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
        }}
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse delay-75" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500 rounded-full blur-3xl animate-pulse delay-150" />
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{
          position: [10, -7.5, -5],
        }}
        style={{ height: '100vh' }}
      >
        <OrbitControls maxDistance={20} minDistance={10} />
        <directionalLight intensity={1} />
        <pointLight position={[-30, 0, -30]} intensity={10.0} />
        <PointCircle />
      </Canvas>

      {/* Title Overlay */}
      <h1 className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-slate-200 font-medium text-2xl md:text-5xl pointer-events-none">
        Drag & Zoom
      </h1>

      {/* Back Button */}
      <Link
        href="/three-lab"
        className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-sm text-slate-200 rounded-lg transition-all border border-cyan-500/30 hover:border-cyan-500/60"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Lab</span>
      </Link>

      {/* Info Card */}
      <div className="absolute bottom-8 left-8 max-w-sm p-6 bg-slate-800/80 backdrop-blur-sm border border-cyan-500/30 rounded-xl">
        <h3 className="text-lg font-bold text-cyan-400 mb-2">Particle Ring</h3>
        <p className="text-slate-300 text-sm">
          An interactive particle system forming concentric rings. Use your mouse to orbit 
          and zoom. Watch as particles rotate in mesmerizing patterns.
        </p>
        <div className="flex gap-2 mt-4">
          <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs">
            Three.js
          </span>
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
            Particle System
          </span>
        </div>
      </div>
    </div>
  );
};

const PointCircle = () => {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (ref.current?.rotation) {
      ref.current.rotation.z = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group ref={ref}>
      {pointsInner.map((point) => (
        <Point key={point.idx} position={point.position} color={point.color} />
      ))}
      {pointsOuter.map((point) => (
        <Point key={point.idx} position={point.position} color={point.color} />
      ))}
    </group>
  );
};

interface PointProps {
  position: [number, number, number];
  color: string;
}

const Point = ({ position, color }: PointProps) => {
  return (
    <Sphere position={position} args={[0.1, 10, 10]}>
      <meshStandardMaterial
        emissive={color}
        emissiveIntensity={0.5}
        roughness={0.5}
        color={color}
      />
    </Sphere>
  );
};

export default ParticleRingPage;
