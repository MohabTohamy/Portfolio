'use client';

import { Suspense, useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { ArrowLeft, ArrowUpRight, Play, Square } from 'lucide-react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import Link from 'next/link';
import Lenis from 'lenis';
import { Eyebrow } from '@/components/UI';

// ─── Shared scene state ───────────────────────────────────────────────────────
// Module-level refs — bypass React state churn for the 3D scene.
const scrollProgressRef = { current: 0 };
const impactTimeRef     = { current: -1 };  // when sun "lands" (clock seconds)
const hasImpactedRef    = { current: false };

// ─── Spacetime fabric shaders ─────────────────────────────────────────────────

const FABRIC_VERT = /* glsl */ `
  uniform float uTime;
  uniform float uImpactTime;     // when the sun landed (-1 = not yet)
  uniform vec3  uMasses[4];      // (x, strength, z) per mass

  varying float vDepth;
  varying vec3  vPos;
  varying vec2  vXZ;      // flat-space coordinate: the grid is drawn here, so lines follow the curve

  // Static gravitational well at a mass position
  float well(vec3 m, vec2 wp) {
    float d = length(wp - vec2(m.x, m.z));
    return m.y * exp(-d * d * 0.045);
  }

  // Expanding ripple wave emanating from impact point (origin) over time
  float ripple(vec2 wp, float impactTime, float now) {
    if (impactTime < 0.0) return 0.0;
    float age = now - impactTime;
    float d = length(wp);
    float waveFront = age * 5.5;            // wave speed
    float distFromFront = d - waveFront;
    float pulse = exp(-distFromFront * distFromFront * 0.45);
    float decay = exp(-age * 0.55);
    // Three rolling waves spawned just after impact for a "concert" feel
    float pulse2 = exp(-(d - max(0.0, age - 1.4) * 5.5) * (d - max(0.0, age - 1.4) * 5.5) * 0.5) * exp(-(age - 1.4) * 0.55) * step(1.4, age);
    float pulse3 = exp(-(d - max(0.0, age - 2.8) * 5.5) * (d - max(0.0, age - 2.8) * 5.5) * 0.5) * exp(-(age - 2.8) * 0.55) * step(2.8, age);
    return (pulse * decay + pulse2 * 0.7 + pulse3 * 0.45) * 1.2;
  }

  void main() {
    vec3 pos = position;
    // The plane is built in local XY and turned flat by -90° about X, so world (x, z) is local (x, -y)
    // and local +z points up. Wells are measured in world coordinates, then pushed down along local z.
    vec2 wp = vec2(pos.x, -pos.y);

    // Wells from all 4 masses
    float depth =
        well(uMasses[0], wp)
      + well(uMasses[1], wp)
      + well(uMasses[2], wp)
      + well(uMasses[3], wp);

    // Impact ripples
    depth += ripple(wp, uImpactTime, uTime);

    // Always-on ambient gravitational waves
    depth += sin(length(wp) * 0.45 - uTime * 0.5) * 0.05;

    vXZ = wp;
    pos.z -= depth;
    vDepth = depth;
    vPos = pos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const FABRIC_FRAG = /* glsl */ `
  precision highp float;

  uniform vec3  uColorFar;
  uniform vec3  uColorDeep;
  uniform vec3  uAccent;
  uniform float uOrbitR[3];

  varying float vDepth;
  varying vec3  vPos;
  varying vec2  vXZ;

  // Anti-aliased grid line at a given cell size: square cells, no triangle diagonals.
  float gridLine(vec2 p, float cell) {
    vec2 g  = p / cell;
    vec2 fw = fwidth(g);
    vec2 a  = abs(fract(g - 0.5) - 0.5) / fw;
    float line = 1.0 - min(min(a.x, a.y), 1.0);
    // fade lines out where they get denser than a pixel, instead of shimmering
    return line * (1.0 - smoothstep(0.25, 0.75, max(fw.x, fw.y)));
  }

  void main() {
    float r = length(vXZ);
    float minor = gridLine(vXZ, 0.8);
    float major = gridLine(vXZ, 4.0);

    // the planets' paths, drawn into the fabric itself
    float orbit = 0.0;
    float fr = fwidth(r) * 1.4;
    for (int i = 0; i < 3; i++) {
      orbit = max(orbit, 1.0 - smoothstep(0.0, fr, abs(r - uOrbitR[i])));
    }

    vec3 col = mix(uColorFar, uColorDeep, smoothstep(0.0, 3.0, vDepth));
    col *= 0.75 + smoothstep(0.0, 2.5, vDepth) * 0.8;
    col = mix(col, uAccent, orbit * 0.8);

    float distFade = 1.0 - smoothstep(11.0, 19.0, r);
    float alpha = (minor * 0.38 + major * 0.55 + orbit * 0.45) * distFade;
    // a faint skin inside the wells, so the curvature reads as a surface and not just lines
    alpha += smoothstep(0.3, 3.5, vDepth) * 0.07 * distFade;
    gl_FragColor = vec4(col, alpha);
  }
`;

// ─── Planets: one shader, three worlds, lit from wherever the sun is ─────────

const PLANET_VERT = /* glsl */ `
  varying vec3 vN;
  varying vec3 vW;
  varying vec3 vObj;
  void main() {
    vObj = position;
    vec4 w = modelMatrix * vec4(position, 1.0);
    vW = w.xyz;
    vN = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;

const NOISE3 = /* glsl */ `
  float h3(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
  float n3(vec3 p) {
    vec3 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(h3(i), h3(i + vec3(1,0,0)), f.x), mix(h3(i + vec3(0,1,0)), h3(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(h3(i + vec3(0,0,1)), h3(i + vec3(1,0,1)), f.x), mix(h3(i + vec3(0,1,1)), h3(i + vec3(1,1,1)), f.x), f.y),
      f.z);
  }
  float fbm3(vec3 p) { float s = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { s += a * n3(p); p *= 2.02; a *= 0.5; } return s; }
`;

const PLANET_FRAG = /* glsl */ `
  precision highp float;
  uniform vec3  uSun;
  uniform float uKind;   // 0 ocean world · 1 rust world · 2 gas giant
  uniform float uTime;
  varying vec3 vN;
  varying vec3 vW;
  varying vec3 vObj;
  ${NOISE3}
  void main() {
    vec3 n = normalize(vN);
    vec3 L = normalize(uSun - vW);
    vec3 V = normalize(cameraPosition - vW);
    float ndl  = dot(n, L);
    float diff = smoothstep(-0.12, 0.7, ndl);
    vec3 s = normalize(vObj);
    vec3 p = s * 2.4;
    vec3 base;
    float spec = 0.0;

    if (uKind < 0.5) {
      float h = fbm3(p * 1.25 + 3.0);
      vec3 ocean = vec3(0.03, 0.12, 0.30), shallow = vec3(0.05, 0.28, 0.48);
      vec3 land = vec3(0.20, 0.34, 0.14), dry = vec3(0.52, 0.43, 0.27);
      base = mix(ocean, shallow, smoothstep(0.40, 0.50, h));
      float isLand = smoothstep(0.50, 0.53, h);
      base = mix(base, mix(land, dry, smoothstep(0.58, 0.70, h)), isLand);
      base = mix(base, vec3(0.92, 0.95, 1.0), smoothstep(0.78, 0.86, abs(s.y)));
      float cloud = fbm3(p * 2.1 + vec3(uTime * 0.04, 0.0, uTime * 0.02));
      base = mix(base, vec3(1.0), smoothstep(0.55, 0.78, cloud) * 0.85);
      vec3 H = normalize(L + V);
      spec = pow(max(dot(n, H), 0.0), 60.0) * (1.0 - isLand) * 0.6;
    } else if (uKind < 1.5) {
      float h = fbm3(p * 1.7 + 11.0);
      base = mix(vec3(0.38, 0.13, 0.06), vec3(0.80, 0.40, 0.20), h);
      base = mix(base, vec3(0.24, 0.08, 0.05), smoothstep(0.58, 0.70, fbm3(p * 4.5)) * 0.7);
      base = mix(base, vec3(0.95, 0.90, 0.85), smoothstep(0.88, 0.94, s.y));
    } else {
      float band = s.y * 10.0 + fbm3(p * vec3(1.2, 5.0, 1.2) + vec3(uTime * 0.03, 0.0, 0.0)) * 2.2;
      base = mix(vec3(0.84, 0.69, 0.46), vec3(0.58, 0.40, 0.24), 0.5 + 0.5 * sin(band));
      base = mix(base, vec3(0.93, 0.87, 0.72), (0.5 + 0.5 * sin(band * 2.7 + 1.3)) * 0.35);
    }

    vec3 col = base * (0.035 + diff * 1.15) + vec3(spec);
    // atmosphere: a thin rim, brightest on the sunlit limb
    float fres = pow(1.0 - max(dot(n, V), 0.0), 3.0);
    vec3 atm = uKind < 0.5 ? vec3(0.35, 0.62, 1.0) : (uKind < 1.5 ? vec3(1.0, 0.55, 0.35) : vec3(1.0, 0.86, 0.62));
    col += atm * fres * (0.08 + smoothstep(-0.25, 0.6, ndl)) * 0.9;
    gl_FragColor = vec4(col, 1.0);
  }
`;

// Rings for the gas giant: banded, see-through, darker on the side away from the sun.
const RING_VERT = /* glsl */ `
  varying float vR;
  varying vec3 vW;
  void main() {
    vR = length(position.xy);
    vec4 w = modelMatrix * vec4(position, 1.0);
    vW = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;

const RING_FRAG = /* glsl */ `
  precision highp float;
  uniform float uInner;
  uniform float uOuter;
  uniform vec3  uSun;
  uniform vec3  uCenter;
  varying float vR;
  varying vec3  vW;
  float h(float x) { return fract(sin(x * 91.7) * 43758.5453); }
  void main() {
    float t = (vR - uInner) / (uOuter - uInner);
    float bands = 0.55 + 0.45 * sin(t * 22.0) * sin(t * 7.0 + 1.0);
    float gap = smoothstep(0.58, 0.60, t) * (1.0 - smoothstep(0.64, 0.66, t));
    float a = smoothstep(0.0, 0.06, t) * (1.0 - smoothstep(0.92, 1.0, t)) * bands * (1.0 - gap * 0.9);
    vec3 toSun = normalize(uSun - uCenter);
    float lit = 0.35 + 0.65 * smoothstep(-0.6, 0.4, dot(normalize(vW - uCenter), toSun));
    vec3 col = mix(vec3(0.72, 0.60, 0.44), vec3(0.95, 0.88, 0.74), h(floor(t * 40.0))) * lit;
    gl_FragColor = vec4(col, a * 0.75);
  }
`;

// The sun's corona: a soft radial glow painted once into a texture.
function makeCoronaTexture() {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const x = c.getContext('2d')!;
    const g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0.0, 'rgba(255,220,160,1)');
    g.addColorStop(0.18, 'rgba(255,150,60,0.55)');
    g.addColorStop(0.45, 'rgba(255,110,40,0.14)');
    g.addColorStop(1.0, 'rgba(255,90,30,0)');
    x.fillStyle = g;
    x.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
}

// ─── Plasma sun shader (multi-octave noise for surface granulation) ──────────

const SUN_VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const SUN_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  varying vec3 vNormal;
  uniform float uTime;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * vnoise(p);
      p *= 2.1;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 p = vUv * 6.0;
    float n = fbm(p + vec2(uTime * 0.13, uTime * 0.07));
    n = mix(n, fbm(p * 2.0 - uTime * 0.05), 0.4);

    vec3 cool = vec3(0.62, 0.16, 0.02);   // sunspots
    vec3 mid  = vec3(1.00, 0.52, 0.10);   // base orange
    vec3 hot  = vec3(1.00, 0.95, 0.50);   // bright flares

    vec3 col = mix(cool, mid, smoothstep(0.28, 0.58, n));
    col = mix(col, hot, smoothstep(0.66, 0.92, n));

    // Subtle limb darkening at edges (real suns dim toward the rim)
    float limb = pow(1.0 - max(0.0, vNormal.z), 1.6) * 0.25;
    col = max(col - vec3(limb), vec3(0.0));

    gl_FragColor = vec4(col * 1.3, 1.0);
  }
`;

interface Mass {
    pos: THREE.Vector2;
    baseStrength: number;
    radius: number;
    orbitRadius: number;
    orbitSpeed: number;
    phase: number;
    kind: number;   // planet shader: 0 ocean world · 1 rust world · 2 gas giant
}

// Same falloff as the fabric's vertex shader, so a planet can sit exactly in its own well.
const wellDepth = (strength: number, dx: number, dz: number) => strength * Math.exp(-(dx * dx + dz * dz) * 0.045);

// ─── easing helpers ───────────────────────────────────────────────────────────

const easeOutCubic   = (x: number) => 1 - Math.pow(1 - x, 3);

// ─── Scene ────────────────────────────────────────────────────────────────────

function SpacetimeScene() {
    const massesRef = useRef<Mass[]>([
        // Sun (mass 0): plasma shader
        { pos: new THREE.Vector2(0, 0),  baseStrength: 3.6,  radius: 0.95, orbitRadius: 0, orbitSpeed: 0,    phase: 0,   kind: -1 },
        // Ocean world, with clouds
        { pos: new THREE.Vector2(5, 0),  baseStrength: 0.85, radius: 0.42, orbitRadius: 5, orbitSpeed: 0.40, phase: 0,   kind: 0 },
        // Rust world
        { pos: new THREE.Vector2(-4, 3), baseStrength: 0.7,  radius: 0.34, orbitRadius: 7, orbitSpeed: 0.25, phase: 2.1, kind: 1 },
        // Ringed gas giant
        { pos: new THREE.Vector2(2, -5), baseStrength: 1.0,  radius: 0.62, orbitRadius: 9, orbitSpeed: 0.15, phase: 4.2, kind: 2 },
    ]);

    const fabricMatRef = useRef<THREE.ShaderMaterial>(null);
    const sunMatRef    = useRef<THREE.ShaderMaterial>(null);
    const bodyRefs     = useRef<(THREE.Group | null)[]>([]);
    const spinRefs     = useRef<(THREE.Mesh | null)[]>([]);
    const coronaRef    = useRef<THREE.Sprite>(null);

    const sunUniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
    const sunPos = useMemo(() => new THREE.Vector3(0, 8, 0), []);
    const corona = useMemo(() => makeCoronaTexture(), []);
    // one uniform set per planet; they all share the live sun position
    const planetUniforms = useMemo(
        () => massesRef.current.map((m) => ({ uSun: { value: sunPos }, uKind: { value: m.kind }, uTime: { value: 0 } })),
        [sunPos]
    );
    const giant = massesRef.current[3];
    const ringUniforms = useMemo(
        () => ({
            uInner: { value: giant.radius * 1.35 },
            uOuter: { value: giant.radius * 2.3 },
            uSun: { value: sunPos },
            uCenter: { value: new THREE.Vector3() },
        }),
        [giant.radius, sunPos]
    );

    const uniforms = useMemo(
        () => ({
            uTime:       { value: 0 },
            uImpactTime: { value: -1 },
            uMasses:     {
                value: [
                    new THREE.Vector3(0, 0, 0),
                    new THREE.Vector3(0, 0, 0),
                    new THREE.Vector3(0, 0, 0),
                    new THREE.Vector3(0, 0, 0),
                ],
            },
            uColorFar:  { value: new THREE.Color('#cfd8e0') },  // cool grey grid (flat space)
            uColorDeep: { value: new THREE.Color('#FFA040') },  // warm orange near deep wells
            uAccent:    { value: new THREE.Color('#E8704F') },  // orbit paths
            uOrbitR:    { value: [5, 7, 9] },
        }),
        []
    );

    useFrame(({ clock }) => {
        const t = clock.elapsedTime;
        const p = scrollProgressRef.current;
        const masses = massesRef.current;

        // ── Sun: damped trampoline bounce ─────────────────────────────────
        // Keyframed motion: BIG drop → high rebound → smaller drop → small
        // rebound → settles FLYING HIGH above the fabric.
        // Strength tracks position: deep when sun is low, light when sun is up.
        // smoothstep interpolation between keyframes = no velocity jumps.
        const sunPath = [
            // Sun NEVER goes below y=1.2 (always above the wireframe).
            // The "drops" mean: sun comes close to fabric AND the well deepens
            // dramatically below it — strength does the heavy lifting.
            { p: 0.00, y: 8.0, s: 0.0 },  // sky, no well
            { p: 0.18, y: 1.3, s: 5.5 },  // BIG drop — sun close to fabric, deepest well below
            { p: 0.36, y: 4.0, s: 1.0 },  // bounce HIGH — well shallows
            { p: 0.55, y: 1.8, s: 3.8 },  // smaller drop, medium-deep well
            { p: 0.72, y: 3.5, s: 1.6 },  // small bounce
            { p: 1.00, y: 2.5, s: 4.2 },  // FINAL: sun hovers above, deep well funnels down
        ];

        let sunY = sunPath[0].y;
        let sunStrength = sunPath[0].s;
        for (let i = 0; i < sunPath.length - 1; i++) {
            if (p <= sunPath[i + 1].p) {
                const a = sunPath[i], b = sunPath[i + 1];
                const tt = (p - a.p) / (b.p - a.p);
                const eased = tt * tt * (3 - 2 * tt); // smoothstep
                sunY = THREE.MathUtils.lerp(a.y, b.y, eased);
                sunStrength = THREE.MathUtils.lerp(a.s, b.s, eased);
                break;
            }
        }
        if (p >= 1) {
            sunY = sunPath[sunPath.length - 1].y;
            sunStrength = sunPath[sunPath.length - 1].s;
        }

        masses[0].baseStrength = sunStrength;

        // Fire impact ripple at the bottom of the first big drop
        if (!hasImpactedRef.current && p > 0.16) {
            hasImpactedRef.current = true;
            impactTimeRef.current = t;
            uniforms.uImpactTime.value = t;
        }
        if (hasImpactedRef.current && p < 0.04) {
            hasImpactedRef.current = false;
            uniforms.uImpactTime.value = -1;
        }

        const sunBody = bodyRefs.current[0];
        if (sunBody) {
            sunBody.position.set(0, sunY, 0);
            const impactPulse = hasImpactedRef.current
                ? 1 + Math.exp(-(t - impactTimeRef.current) * 3.5) * 0.18
                : 1;
            sunBody.scale.setScalar(impactPulse);
        }

        sunPos.set(0, sunY, 0);

        if (coronaRef.current) {
            coronaRef.current.position.set(0, sunY, 0);
            const glowVis = THREE.MathUtils.clamp(sunStrength / 5 + 0.45, 0, 1);
            coronaRef.current.scale.setScalar((5.2 + Math.sin(t * 1.2) * 0.25) * glowVis);
        }

        uniforms.uMasses.value[0].set(0, masses[0].baseStrength, 0);

        // ── Planets: orbit at depression edge on the fabric (like screenshot)
        // Activation ramps in as scroll progresses; final orbital radius is
        // close to nominal base (not clustered tight, not pushed far out).
        const planetActivation = easeOutCubic(THREE.MathUtils.clamp((p - 0.5) / 0.5, 0, 1));
        const radiusFactor = THREE.MathUtils.lerp(1.6, 0.95, easeOutCubic(p)); // 1.6x → 0.95x

        for (let i = 1; i < masses.length; i++) {
            const m = masses[i];
            const breath = Math.sin(p * Math.PI * 1.5 + i * 1.2) * 0.18;
            const r = m.orbitRadius * (radiusFactor + breath);
            uniforms.uOrbitR.value[i - 1] = r;

            m.pos.x = Math.cos(t * m.orbitSpeed + m.phase) * r;
            m.pos.y = Math.sin(t * m.orbitSpeed + m.phase) * r;
            uniforms.uMasses.value[i].set(m.pos.x, m.baseStrength * planetActivation, m.pos.y);
        }

        // Each planet rests in the dent it makes, like a ball on a stretched sheet.
        for (let i = 1; i < masses.length; i++) {
            const m = masses[i];
            let depth = 0;
            for (let j = 0; j < masses.length; j++) {
                const mv = uniforms.uMasses.value[j];
                depth += wellDepth(mv.y, m.pos.x - mv.x, m.pos.y - mv.z);
            }
            const body = bodyRefs.current[i];
            if (body) {
                body.position.set(m.pos.x, -depth + m.radius * 0.85 * planetActivation, m.pos.y);
                body.scale.setScalar(planetActivation);
            }
            const spin = spinRefs.current[i];
            if (spin) spin.rotation.y = t * (0.25 + i * 0.08);
            planetUniforms[i].uTime.value = t;
            if (i === 3 && body) ringUniforms.uCenter.value.copy(body.position);
        }

        uniforms.uTime.value = t;
        if (sunMatRef.current) sunMatRef.current.uniforms.uTime.value = t;
    });

    return (
        <>
            <Stars radius={80} depth={50} count={2200} factor={3.5} saturation={0} fade speed={0.2} />

            {/* Spacetime fabric: a solid sheet with the grid drawn in the shader, not a wireframe */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <planeGeometry args={[40, 40, 220, 220]} />
                <shaderMaterial
                    ref={fabricMatRef}
                    vertexShader={FABRIC_VERT}
                    fragmentShader={FABRIC_FRAG}
                    uniforms={uniforms}
                    transparent
                    depthWrite={false}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Sun corona */}
            <sprite ref={coronaRef} scale={5}>
                <spriteMaterial map={corona} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
            </sprite>

            {/* Sun and planets */}
            {massesRef.current.map((m, i) => (
                <group key={i} ref={(el) => { bodyRefs.current[i] = el; }}>
                    <mesh ref={(el) => { spinRefs.current[i] = el; }} rotation={[0.2 * i, 0, 0.15 * i]}>
                        <sphereGeometry args={[m.radius, 64, 64]} />
                        {i === 0 ? (
                            <shaderMaterial
                                ref={sunMatRef}
                                vertexShader={SUN_VERT}
                                fragmentShader={SUN_FRAG}
                                uniforms={sunUniforms}
                                toneMapped={false}
                            />
                        ) : (
                            <shaderMaterial
                                vertexShader={PLANET_VERT}
                                fragmentShader={PLANET_FRAG}
                                uniforms={planetUniforms[i]}
                            />
                        )}
                    </mesh>
                    {m.kind === 2 && (
                        <mesh rotation={[-Math.PI / 2 + 0.45, 0.2, 0]}>
                            <ringGeometry args={[m.radius * 1.35, m.radius * 2.3, 160, 1]} />
                            <shaderMaterial
                                vertexShader={RING_VERT}
                                fragmentShader={RING_FRAG}
                                uniforms={ringUniforms}
                                transparent
                                depthWrite={false}
                                side={THREE.DoubleSide}
                            />
                        </mesh>
                    )}
                </group>
            ))}
        </>
    );
}

// ─── Cinematic camera (continuous, scroll-driven) ─────────────────────────────

function ScrollCamera() {
    const { camera } = useThree();
    const lookTarget = useMemo(() => new THREE.Vector3(0, 0, 0), []);

    useFrame(() => {
        const p = scrollProgressRef.current;

        // SINGLE continuous path — no phase boundaries to jump between.
        // Final pose matches the classic "spacetime curvature" 3/4 reference:
        // low side angle looking down into the depression.
        const easedP = 0.5 - 0.5 * Math.cos(p * Math.PI);

        // Slight horizontal sweep — small angle change, ends slightly off-axis
        const angle = THREE.MathUtils.lerp(0.1, 0.35, easedP);
        // Gentle pull-back
        const radius = THREE.MathUtils.lerp(11, 14, easedP);
        // Drop low to the fabric for the dramatic 3/4 view at the end
        const height = THREE.MathUtils.lerp(9, 3.5, easedP);

        camera.position.set(
            Math.sin(angle) * radius,
            height,
            Math.cos(angle) * radius
        );

        // Look DOWN into the well at the end (negative y)
        const lookY = THREE.MathUtils.lerp(0.5, -1.5, easedP);
        lookTarget.set(0, lookY, 0);
        camera.lookAt(lookTarget);
    });

    return null;
}

// ─── DepthCard — zoom-in entrance ─────────────────────────────────────────────

function DepthCard({ children, align = 'right' }: { children: React.ReactNode; align?: 'left' | 'right' | 'center' }) {
    const justify =
        align === 'left'   ? 'justify-start' :
        align === 'center' ? 'justify-center' :
                              'justify-end';

    // h-[150vh] — taller sections give more scroll pixels per progress unit,
    // making every animation feel ~50% longer / slower / more cinematic.
    return (
        <div className={`h-[150vh] flex items-center px-6 md:px-16 ${justify}`}>
            <motion.div
                initial={{ opacity: 0, scale: 0.85, filter: 'blur(8px)', y: 40 }}
                whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-sm pointer-events-auto"
            >
                {children}
            </motion.div>
        </div>
    );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ThreeLabClassicPage() {
    const [isPlaying, setIsPlaying] = useState(false);
    const lenisRef = useRef<Lenis | null>(null);
    const autoScrollAnimRef = useRef<number | null>(null);

    // ── Initialize Lenis + scroll-progress tracking ─────────────────────────
    // Read progress directly from window.scrollY (Lenis updates this natively
    // when smooth-scrolling). Decouples scene animation from Lenis's event API.
    useEffect(() => {
        const updateProgress = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            scrollProgressRef.current = max > 0
                ? Math.min(1, Math.max(0, window.scrollY / max))
                : 0;
        };
        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 1.0,
            touchMultiplier: 1.5,
        });
        lenisRef.current = lenis;

        let rafId = 0;
        const raf = (time: number) => {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
            lenisRef.current = null;
            window.removeEventListener('scroll', updateProgress);
        };
    }, []);

    // ── Auto-scroll via Lenis.scrollTo ──────────────────────────────────────
    const stopAutoScroll = () => {
        // Lenis exposes .stop() which interrupts an in-flight scrollTo
        lenisRef.current?.stop();
        lenisRef.current?.start();
        if (autoScrollAnimRef.current) {
            clearTimeout(autoScrollAnimRef.current);
            autoScrollAnimRef.current = null;
        }
        setIsPlaying(false);
    };

    const toggleAutoScroll = () => {
        const lenis = lenisRef.current;
        if (!lenis) return;

        if (isPlaying) {
            stopAutoScroll();
            return;
        }

        // If at bottom, restart from top
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (window.scrollY >= max - 4) {
            lenis.scrollTo(0, { immediate: true });
        }

        const duration = 12; // seconds — brisk but cinematic
        setIsPlaying(true);

        // Start scrolling toward bottom
        lenis.scrollTo(max, {
            duration,
            easing: (t) => 0.5 - 0.5 * Math.cos(t * Math.PI), // ease-in-out
            onComplete: () => {
                autoScrollAnimRef.current = null;
                setIsPlaying(false);
            },
        });

        // Backup timeout in case onComplete doesn't fire
        autoScrollAnimRef.current = window.setTimeout(() => {
            setIsPlaying(false);
            autoScrollAnimRef.current = null;
        }, (duration + 1) * 1000);
    };

    useEffect(() => () => stopAutoScroll(), []);

    return (
        <div className="min-h-screen relative bg-[var(--bg)]">
            {/* Top bar */}
            <div className="fixed top-16 left-0 right-0 z-40 px-6 flex items-center justify-between bg-[var(--bg)]/80 backdrop-blur-md border-b border-[var(--hairline)] h-12">
                <Link
                    href="/three-lab"
                    className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--fg)]/60 hover:text-[var(--fg)] transition-colors"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    3D Lab
                </Link>
                <p className="hidden md:block text-xs uppercase tracking-[0.18em] text-[var(--fg)]/50">
                    04 / 04 — Spacetime
                </p>
                <button
                    onClick={toggleAutoScroll}
                    className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--fg)]/60 hover:text-[var(--fg)] transition-colors"
                >
                    {isPlaying ? (
                        <>
                            <Square className="w-3 h-3 fill-[var(--accent)] text-[var(--accent)]" />
                            <span className="text-[var(--accent)]">Stop</span>
                        </>
                    ) : (
                        <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            Auto-scroll
                        </>
                    )}
                </button>
            </div>

            {/* Hero */}
            <section className="min-h-screen flex items-center px-6 pt-28">
                <div className="max-w-3xl mx-auto">
                    <Eyebrow className="mb-6">Scroll-driven 3D · spacetime curvature</Eyebrow>
                    <h1 className="font-display text-5xl md:text-7xl text-[var(--fg)] leading-[0.98] mb-8">
                        Mass tells space how to curve.
                    </h1>
                    <p className="text-lg text-[var(--fg-muted)] leading-relaxed max-w-xl mb-12">
                        Einstein’s general relativity, rendered in real time. Watch the sun
                        fall, hit the fabric, send out ripples — planets orbit and breathe.
                        Hit auto-scroll to play it as a film.
                    </p>
                    <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[var(--fg)]/40 animate-pulse">
                        <span>Scroll</span>
                        <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
                            <path d="M5 0v14M1 9l4 5 4-5" stroke="currentColor" strokeWidth="1.2" />
                        </svg>
                    </div>
                </div>
            </section>

            {/* Scroll-driven scene */}
            <div className="relative">
                <div className="sticky top-0 h-screen w-full z-0">
                    <Canvas
                        camera={{ position: [0, 11, 8], fov: 55 }}
                        dpr={[1, 1.5]}
                        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
                        onCreated={({ gl }) => { gl.setClearColor(new THREE.Color('#08070A')); }}
                    >
                        <Suspense fallback={null}>
                            <SpacetimeScene />
                            <ScrollCamera />
                            <EffectComposer multisampling={0}>
                                <Bloom intensity={0.4} luminanceThreshold={0.4} luminanceSmoothing={0.4} />
                                <Vignette eskil={false} offset={0.18} darkness={0.7} />
                            </EffectComposer>
                        </Suspense>
                    </Canvas>
                </div>

                {/* Cards. Pulled up over the sticky canvas so the scene lasts exactly as long as
                    the cards do; otherwise it scrolls off early and leaves a black gap at the end. */}
                <div className="relative z-10 pointer-events-none -mt-[100vh]">

                    <DepthCard align="right">
                        <div className="rounded-xl border border-[var(--hairline)] p-6 bg-[var(--bg)]/45 backdrop-blur-md">
                            <p className="font-mono text-xs text-[var(--fg-dim)] uppercase tracking-wider mb-3">
                                01 — descent
                            </p>
                            <h3 className="font-display text-3xl text-[var(--fg)] mb-3 leading-tight">
                                Heavy body, falling.
                            </h3>
                            <p className="text-sm text-[var(--fg-muted)] leading-relaxed">
                                The sun starts eight units above the fabric and descends with an
                                ease-out bounce. Its gravitational strength ramps in lockstep —
                                strong before contact, devastating on impact.
                            </p>
                        </div>
                    </DepthCard>

                    <DepthCard align="left">
                        <div className="rounded-xl border border-[var(--hairline)] p-6 bg-[var(--bg)]/45 backdrop-blur-md">
                            <p className="font-mono text-xs text-[var(--fg-dim)] uppercase tracking-wider mb-3">
                                02 — impact
                            </p>
                            <h3 className="font-display text-3xl text-[var(--fg)] mb-3 leading-tight">
                                Three rolling waves.
                            </h3>
                            <p className="text-sm text-[var(--fg-muted)] leading-relaxed mb-4">
                                When the sun hits, the vertex shader spawns three Gaussian ripples
                                that race outward at 5.5 units/sec. Each one decays exponentially.
                                The fabric remembers the moment.
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {['gaussian ripples', 'glsl', 'vertex displacement'].map((t) => (
                                    <span key={t} className="font-mono text-[10px] px-2 py-0.5 border border-[var(--hairline-strong)] rounded-full text-[var(--fg-muted)]">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </DepthCard>

                    <DepthCard align="center">
                        <Link href="/three-lab/particle-ring" className="group block">
                            <div className="rounded-xl border border-[var(--hairline)] p-8 bg-[var(--bg)]/45 backdrop-blur-md hover:border-[var(--accent)] transition-colors">
                                <p className="font-mono text-xs text-[var(--fg-dim)] uppercase tracking-wider mb-3">
                                    aside · 02 / 04
                                </p>
                                <h3 className="font-display text-3xl text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors mb-3 leading-tight">
                                    Particle Ring
                                </h3>
                                <p className="text-sm text-[var(--fg-muted)] leading-relaxed mb-5">
                                    Six thousand GPU particles, three rings, four orbiting planets —
                                    displaced by your cursor through a custom GLSL shader.
                                </p>
                                <span className="inline-flex items-center gap-2 text-sm text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">
                                    Open
                                    <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                                </span>
                            </div>
                        </Link>
                    </DepthCard>

                    <DepthCard align="right">
                        <div className="rounded-xl border border-[var(--hairline)] p-6 bg-[var(--bg)]/45 backdrop-blur-md">
                            <p className="font-mono text-xs text-[var(--fg-dim)] uppercase tracking-wider mb-3">
                                03 — orbit
                            </p>
                            <h3 className="font-display text-3xl text-[var(--fg)] mb-3 leading-tight">
                                Three planets, breathing.
                            </h3>
                            <p className="text-sm text-[var(--fg-muted)] leading-relaxed mb-4">
                                The orbiting bodies spiral inward as the sun stabilizes — their
                                radii pulse with phase-offset sine waves. Each one carves its own
                                moving well across the fabric.
                            </p>
                            <div className="space-y-2 text-xs font-mono">
                                {[
                                    { label: 'fabric segments', val: '220 × 220' },
                                    { label: 'masses tracked',  val: '4' },
                                    { label: 'falloff',         val: 'exp(−d² · 0.045)' },
                                    { label: 'wave speed',      val: '5.5 u/sec' },
                                ].map((r) => (
                                    <div key={r.label} className="flex justify-between">
                                        <span className="text-[var(--fg-dim)]">{r.label}</span>
                                        <span className="text-[var(--fg)]/60">{r.val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </DepthCard>

                    <DepthCard align="center">
                        <Link href="/three-lab/futuristic-dashboard" className="group block">
                            <div className="rounded-xl border border-[var(--hairline)] p-8 bg-[var(--bg)]/45 backdrop-blur-md hover:border-[var(--accent)] transition-colors">
                                <p className="font-mono text-xs text-[var(--fg-dim)] uppercase tracking-wider mb-3">
                                    aside · 03 / 04
                                </p>
                                <h3 className="font-display text-3xl text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors mb-3 leading-tight">
                                    Holographic Field
                                </h3>
                                <p className="text-sm text-[var(--fg-muted)] leading-relaxed mb-5">
                                    Distortion shaders, floating geometry, environment maps.
                                    Hover spheres, click cubes — every primitive has a state.
                                </p>
                                <span className="inline-flex items-center gap-2 text-sm text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">
                                    Open
                                    <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                                </span>
                            </div>
                        </Link>
                    </DepthCard>

                    <div className="h-[150vh] flex items-center justify-center px-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.45, filter: 'blur(18px)', y: 60 }}
                            whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
                            viewport={{ once: false, amount: 0.3 }}
                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                            className="max-w-2xl pointer-events-auto text-center"
                        >
                            <Eyebrow className="mb-6">Settled</Eyebrow>
                            <h3 className="font-display text-4xl md:text-5xl text-[var(--fg)] mb-6 leading-tight">
                                The system stabilizes.
                            </h3>
                            <p className="text-[var(--fg-muted)] leading-relaxed mb-8">
                                The sun rests in its well. Planets orbit on stable paths. The
                                fabric continues to ripple — gravitational waves never stop.
                                Built with Three.js, R3F, custom GLSL, Lenis, and Framer Motion.
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {['three.js', 'r3f', 'glsl', 'lenis', 'framer-motion'].map((t) => (
                                    <span key={t} className="font-mono text-xs px-3 py-1 border border-[var(--hairline-strong)] rounded-full text-[var(--fg-muted)]">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
