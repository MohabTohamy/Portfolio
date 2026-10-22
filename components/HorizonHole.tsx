'use client';

import { useEffect, useRef } from 'react';

// A black hole ray-traced in a fragment shader, sitting behind the whole home page.
// Light rays are bent step by step around the hole, so the far side of the disk shows up
// arched over the top. Scroll raises the camera over the disk; the mouse tilts it.

const VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';

const FRAG = /* glsl */ `
precision highp float;
uniform vec2  uRes;
uniform float uTime;
uniform vec2  uMouse;
uniform float uScroll;
uniform float uNarrow;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1., 0.)), f.x), mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), f.x), f.y);
}
float fbm(vec2 p){ float s = 0., a = .5; for (int i = 0; i < 4; i++){ s += a * noise(p); p *= 2.03; a *= .5; } return s; }
vec3 stars(vec3 d){
  vec2 uv = vec2(atan(d.z, d.x), asin(clamp(d.y, -1., 1.))) * 70.;
  vec2 id = floor(uv); float h = hash(id); vec2 f = fract(uv) - .5;
  return vec3(step(.982, h) * smoothstep(.2, 0., length(f)) * (h - .982) * 55.);
}

void main(){
  float s = uScroll;
  // the hole drifts aside for the middle of the page, and back to centre at the end
  vec2 c = vec2(.5 + sin(s * 3.14159) * (uNarrow > .5 ? .08 : .22), uNarrow > .5 ? .64 : .58);
  vec2 uv = (gl_FragCoord.xy - c * uRes) / uRes.y * (uNarrow > .5 ? 1.35 : 1.);

  float incl = mix(.07, .62, s) + (uMouse.y - .5) * .18;
  float yaw  = (uMouse.x - .5) * .6 + uTime * .015;
  float dist = mix(26., 17., s);
  vec3 ro = vec3(sin(yaw) * cos(incl), sin(incl), -cos(yaw) * cos(incl)) * dist;
  vec3 fw = normalize(-ro), rt = normalize(cross(vec3(0., 1., 0.), fw)), up = cross(fw, rt);
  vec3 rd = normalize(fw * 2.2 + rt * uv.x + up * uv.y);

  vec3 p = ro, v = rd; vec3 h = cross(p, v); float h2 = dot(h, h);
  vec3 col = vec3(0.); float alpha = 0., hit = 0., esc = 0., nx = 0.;
  for (int i = 0; i < 110; i++){
    float r2 = dot(p, p); float r = sqrt(r2);
    float dt = clamp(.07 * r, .035, .9);
    vec3 pp = p;
    v += -1.5 * h2 * p / (r2 * r2 * r) * dt;   // Schwarzschild bending
    p += v * dt;
    if (dot(p, p) < 1.){ hit = 1.; break; }
    if (pp.y * p.y < 0.){
      float t = pp.y / (pp.y - p.y); vec3 q = mix(pp, p, t); float rr = length(q.xz); nx += 1.;
      if (rr > 2.3 && rr < 9.){
        float ang = atan(q.z, q.x);
        float n = fbm(vec2(rr * 1.7, ang * 3. + uTime * 1.4 / rr));
        float edge = smoothstep(2.3, 2.8, rr) * smoothstep(9., 4.5, rr);
        float temp = 1. - smoothstep(2.3, 8., rr);
        vec3 dv = normalize(vec3(-q.z, 0., q.x)); float dop = 1. + .6 * dot(dv, -normalize(v));
        // light that already looped the hole is kept faint: a glow, not a hard line
        float wgt = nx < 1.5 ? 1. : .18;
        float dens = edge * (.3 + n) * dop * wgt;
        vec3 dc = mix(vec3(.9, .22, .04), vec3(1., .72, .42), temp);
        dc = mix(dc, vec3(1., .96, .88), smoothstep(.75, 1., temp));
        col += (1. - alpha) * dc * dens * 1.7; alpha += (1. - alpha) * clamp(dens * .85, 0., 1.);
      }
    }
    if (r2 > 1600.){ esc = 1.; break; }
  }
  if (esc < .5) hit = 1.;            // still circling when the steps ran out: shadow, not sky
  if (hit < .5) col += (1. - alpha) * stars(normalize(v));
  col = pow(col, vec3(.9)) + vec3(1., .5, .2) * .05 * exp(-length(uv) * 2.2);
  gl_FragColor = vec4(col, 1.);
}
`;

export default function HorizonHole() {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const gl = canvas.getContext('webgl', { antialias: false, powerPreference: 'high-performance' });
        if (!gl) return; // no WebGL: the page still reads fine on its black background

        const compile = (type: number, src: string) => {
            const s = gl.createShader(type)!;
            gl.shaderSource(s, src);
            gl.compileShader(s);
            return s;
        };
        const prog = gl.createProgram()!;
        gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
        gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
        gl.useProgram(prog);
        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(prog, 'p');
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        const u = (n: string) => gl.getUniformLocation(prog, n);
        const uRes = u('uRes'), uTime = u('uTime'), uMouse = u('uMouse'), uScroll = u('uScroll'), uNarrow = u('uNarrow');

        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let narrow = false;
        const fit = () => {
            narrow = window.innerWidth < 768;
            // ray marching is per pixel: render under-resolution and let the browser scale it up
            const scale = Math.min(window.devicePixelRatio || 1, 2) * (narrow ? 0.5 : 0.6);
            canvas.width = Math.round(canvas.clientWidth * scale);
            canvas.height = Math.round(canvas.clientHeight * scale);
            gl.viewport(0, 0, canvas.width, canvas.height);
        };
        fit();
        window.addEventListener('resize', fit);

        const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
        const onMove = (e: PointerEvent) => {
            mouse.tx = e.clientX / window.innerWidth;
            mouse.ty = 1 - e.clientY / window.innerHeight;
        };
        window.addEventListener('pointermove', onMove);

        let scroll = 0;
        const progress = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        };

        const draw = (t: number) => {
            gl.uniform2f(uRes, canvas.width, canvas.height);
            gl.uniform1f(uTime, t);
            gl.uniform2f(uMouse, mouse.x, mouse.y);
            gl.uniform1f(uScroll, scroll);
            gl.uniform1f(uNarrow, narrow ? 1 : 0);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
        };

        let raf = 0;
        const loop = (now: number) => {
            mouse.x += (mouse.tx - mouse.x) * 0.05;
            mouse.y += (mouse.ty - mouse.y) * 0.05;
            scroll += (progress() - scroll) * 0.08;
            // fade the hole back once the hero has gone, so the sections read over it
            canvas.style.opacity = String(1 - Math.min(window.scrollY / window.innerHeight, 1) * 0.62);
            draw(now / 1000);
            raf = requestAnimationFrame(loop);
        };

        const start = () => {
            cancelAnimationFrame(raf);
            if (reduce) {
                scroll = progress();
                draw(6);
            } else {
                raf = requestAnimationFrame(loop);
            }
        };
        const onVisibility = () => (document.hidden ? cancelAnimationFrame(raf) : start());
        document.addEventListener('visibilitychange', onVisibility);
        if (reduce) window.addEventListener('scroll', start, { passive: true });
        start();

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', fit);
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('scroll', start);
            document.removeEventListener('visibilitychange', onVisibility);
        };
    }, []);

    return <canvas ref={ref} className="fixed inset-0 w-full h-full z-0 pointer-events-none" aria-hidden="true" />;
}
