'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Lenis from 'lenis';

// Reveals its words one by one, each rising out of its own clipped line, the first time
// it scrolls into view. Text stays in the DOM as plain words, so it reads fine without JS.
export function SplitWords({
    text,
    accent,
    className = '',
    as: Tag = 'span',
}: {
    text: string;
    accent?: string;
    className?: string;
    as?: 'span' | 'h1' | 'h2' | 'p';
}) {
    const ref = useRef<HTMLElement>(null);
    const [shown, setShown] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) {
                    setShown(true);
                    io.disconnect();
                }
            },
            { threshold: 0.2 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    const words = text.split(' ');
    const tail = accent ? accent.split(' ') : [];
    let i = 0;
    const word = (w: string, hot: boolean) => (
        <span key={i} className="split-w">
            <span style={{ ['--i' as string]: i++ }} className={hot ? 'split-hot' : undefined}>
                {w}
            </span>
        </span>
    );

    return (
        <Tag ref={ref as never} className={`${className} ${shown ? 'split-in' : ''}`}>
            {words.map((w) => [word(w, false), ' '])}
            {tail.map((w, k) => [word(w, true), k < tail.length - 1 ? ' ' : null])}
        </Tag>
    );
}

// Fades and lifts its children in when they scroll into view.
export function Rise({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const [shown, setShown] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) {
                    setShown(true);
                    io.disconnect();
                }
            },
            { threshold: 0.15 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);
    return (
        <div ref={ref} className={`rise ${shown ? 'rise-in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
            {children}
        </div>
    );
}

// Eased wheel scrolling for the page it is mounted on. Native scrolling on touch.
export function SmoothScroll() {
    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
        let raf = 0;
        const loop = (t: number) => {
            lenis.raf(t);
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        return () => {
            cancelAnimationFrame(raf);
            lenis.destroy();
        };
    }, []);
    return null;
}
