'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button, Eyebrow } from '@/components/UI';
import { projects } from '@/data/projects';

const HeroRing = dynamic(() => import('@/components/HeroRing'), { ssr: false });

const EMAIL = 'MohabTohamyAbdallah@gmail.com';

export default function HomePage() {
  const live = projects.filter((p) => p.kind === 'Live product');
  const more = projects.filter((p) => p.kind !== 'Live product');

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-24 pb-24 md:pt-36 md:pb-32">
        <div className="absolute inset-y-0 -end-[30%] w-[90%] md:-end-[10%] md:w-[60%] opacity-70">
          <HeroRing />
        </div>
        <div className="relative max-w-6xl mx-auto">
          <Eyebrow className="mb-8">
            Full-stack engineer · Riyadh · open to relocating to Austria
          </Eyebrow>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="font-display text-5xl md:text-7xl lg:text-[88px] text-[var(--fg)] leading-[0.98] mb-8 max-w-4xl"
          >
            I build software people pay for.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="text-lg md:text-xl text-[var(--fg-muted)] max-w-2xl leading-relaxed mb-12"
          >
            Two products of my own that people use every day. A national platform for
            a Saudi ministry by day. 3D on the web for fun.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="grid sm:grid-cols-2 gap-3 max-w-3xl"
          >
            {live.map((p) => (
              <Link
                key={p.id}
                href={`/projects#${p.id}`}
                className="group block border border-[var(--hairline-strong)] rounded-md p-5 bg-[var(--bg)]/70 backdrop-blur-sm hover:border-[var(--accent)] transition-colors"
              >
                <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#7FB38A] mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7FB38A]" />
                  live · {p.link?.label}
                </span>
                <span className="flex items-baseline justify-between gap-3">
                  <span className="font-display text-3xl text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">
                    {p.title}
                  </span>
                  <ArrowRight className="w-4 h-4 shrink-0 text-[var(--fg-dim)] group-hover:text-[var(--accent)] transition-colors" />
                </span>
                <span className="block text-sm text-[var(--fg-muted)] leading-relaxed mt-2">
                  {p.tagline}
                </span>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6">
        <div className="divider" />
      </div>

      {/* The rest of the work */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-baseline justify-between mb-12">
            <Eyebrow>Also</Eyebrow>
            <Link href="/projects" className="link-arrow text-sm">
              All work
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <ul className="border-t border-[var(--hairline)]">
            {more.map((p) => (
              <li key={p.id} className="border-b border-[var(--hairline)]">
                <Link
                  href={p.id === '3d' ? '/three-lab' : `/projects#${p.id}`}
                  className="group grid md:grid-cols-12 gap-2 md:gap-4 py-7 items-baseline hover:bg-[var(--bg-elevated)]/40 -mx-4 px-4 rounded-md transition-colors"
                >
                  <span className="md:col-span-2 font-mono text-xs uppercase tracking-[0.14em] text-[var(--fg-dim)]">
                    {p.kind}
                  </span>
                  <span className="md:col-span-4 font-display text-2xl md:text-3xl text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors leading-tight">
                    {p.title}
                  </span>
                  <span className="md:col-span-6 text-sm text-[var(--fg-muted)] leading-relaxed">
                    {p.tagline}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6">
        <div className="divider" />
      </div>

      {/* How I work, short */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <Eyebrow>How I work</Eyebrow>
          </div>
          <div className="md:col-span-8">
            <p className="font-display text-3xl md:text-4xl text-[var(--fg)] leading-tight mb-6">
              I work with a team of AI agents. They write most of the code. Tests,
              reports and my review decide what ships.
            </p>
            <p className="text-[var(--fg-muted)] leading-relaxed mb-8 max-w-2xl">
              That is how one person built and runs two live products alongside a
              full-time job. The setup took real work: rules, memory that follows me
              between machines, and checks that catch what the agents get wrong.
            </p>
            <Button href="/how-i-work" variant="ghost">
              See the setup
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="px-6 py-32 border-t border-[var(--hairline)]">
        <div className="max-w-6xl mx-auto text-center">
          <Eyebrow className="mb-6">Hiring, or building something?</Eyebrow>
          <a
            href={`mailto:${EMAIL}`}
            className="font-display text-3xl sm:text-5xl lg:text-7xl text-[var(--fg)] hover:text-[var(--accent)] transition-colors inline-flex items-baseline gap-3 break-all"
          >
            {EMAIL}
            <ArrowUpRight className="w-6 h-6 sm:w-10 sm:h-10 lg:w-14 lg:h-14 shrink-0" />
          </a>
        </div>
      </section>
    </>
  );
}
