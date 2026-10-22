'use client';

import dynamic from 'next/dynamic';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Eyebrow } from '@/components/UI';
import { Rise, SmoothScroll, SplitWords } from '@/components/Motion';
import { projects } from '@/data/projects';

const HorizonHole = dynamic(() => import('@/components/HorizonHole'), { ssr: false });

const EMAIL = 'MohabTohamyAbdallah@gmail.com';

export default function HomePage() {
  const live = projects.filter((p) => p.kind === 'Live product');
  const more = projects.filter((p) => p.kind !== 'Live product');

  return (
    <>
      <SmoothScroll />
      <HorizonHole />

      <div className="relative z-10">
        {/* Hero: the black hole fills the screen; the words sit under it */}
        <section className="min-h-[calc(100svh-4rem)] flex flex-col justify-end items-center text-center px-6 pb-16 md:pb-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--fg-muted)] mb-5">
            Full-stack engineer · Riyadh
          </p>
          <SplitWords
            as="h1"
            text="I take ideas all the way to"
            accent="production."
            className="font-fraunces font-light text-[44px] sm:text-6xl md:text-7xl lg:text-[104px] leading-[0.98] tracking-[-0.02em] text-[var(--fg)] max-w-5xl text-balance"
          />
          <Rise delay={500} className="mt-6">
            <p className="text-[var(--fg-muted)] text-base md:text-lg leading-relaxed max-w-xl mx-auto">
              From the first screen to the server it runs on. Two products live, and a
              national platform for a Saudi ministry by day.
            </p>
          </Rise>
        </section>

        {/* Live products */}
        <section className="px-6 py-28 md:py-40">
          <div className="max-w-6xl mx-auto">
            <Rise>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--hot)] mb-8">Live now</p>
            </Rise>
            <ul className="border-t border-[var(--hairline-strong)]">
              {live.map((p) => (
                <li key={p.id} className="border-b border-[var(--hairline-strong)]">
                  <Link
                    href={`/projects#${p.id}`}
                    className="group grid md:grid-cols-12 gap-x-6 gap-y-2 py-8 md:py-10 items-baseline"
                  >
                    <SplitWords
                      text={p.title}
                      className="md:col-span-6 font-fraunces font-light text-6xl md:text-8xl leading-none text-[var(--fg)] group-hover:text-[var(--hot)] transition-colors duration-300"
                    />
                    <span className="md:col-span-4 text-[var(--fg-muted)] leading-relaxed">{p.tagline}</span>
                    <span className="md:col-span-2 md:text-end font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--hot)]">
                      live · {p.link?.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* The rest of the work */}
        <section className="px-6 pb-28 md:pb-40">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-baseline justify-between mb-8">
              <Eyebrow>Also</Eyebrow>
              <Link href="/projects" className="link-arrow text-sm">
                All work
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <ul className="border-t border-[var(--hairline)]">
              {more.map((p, i) => (
                <li key={p.id} className="border-b border-[var(--hairline)]">
                  <Rise delay={i * 80}>
                    <Link
                      href={p.id === '3d' ? '/three-lab' : `/projects#${p.id}`}
                      className="group grid md:grid-cols-12 gap-2 md:gap-6 py-6 items-baseline"
                    >
                      <span className="md:col-span-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--fg-dim)]">
                        {p.kind}
                      </span>
                      <span className="md:col-span-5 font-fraunces text-3xl md:text-4xl text-[var(--fg)] group-hover:text-[var(--hot)] transition-colors leading-tight">
                        {p.title}
                      </span>
                      <span className="md:col-span-5 text-sm text-[var(--fg-muted)] leading-relaxed">{p.tagline}</span>
                    </Link>
                  </Rise>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* How I work */}
        <section className="px-6 py-28 md:py-40">
          <div className="max-w-5xl mx-auto">
            <Rise>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--hot)] mb-8">How I work</p>
            </Rise>
            <SplitWords
              as="p"
              text="One engineer and a team of AI agents."
              accent="Tests and my review decide what ships."
              className="font-fraunces font-light text-4xl md:text-6xl leading-[1.06] text-[var(--fg)]"
            />
            <Rise delay={300} className="mt-10 flex flex-wrap items-center gap-3">
              {['Rules', 'Plan', 'Build', 'Check', 'Sign off'].map((s) => (
                <span key={s} className="font-mono text-xs uppercase tracking-[0.12em] px-4 py-2 rounded-full border border-[var(--hairline-strong)] text-[var(--fg-muted)]">
                  {s}
                </span>
              ))}
              <Link href="/how-i-work" className="link-arrow ms-2">
                See the setup
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Rise>
          </div>
        </section>

        {/* Contact */}
        <section className="px-6 py-32 md:py-44 text-center">
          <Rise>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--fg-muted)] mb-6">
              Hiring, or building something?
            </p>
          </Rise>
          <a
            href={`mailto:${EMAIL}`}
            className="font-fraunces font-light text-3xl sm:text-5xl lg:text-7xl text-[var(--fg)] hover:text-[var(--hot)] transition-colors break-all"
          >
            {EMAIL}
          </a>
        </section>
      </div>
    </>
  );
}
