'use client';

import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { Eyebrow } from '@/components/UI';
import { experiences, stack } from '@/data/experience';

export default function AboutPage() {
    return (
        <>
            {/* Intro */}
            <section className="px-6 pt-24 pb-20 md:pt-32">
                <div className="max-w-3xl mx-auto">
                    <Eyebrow className="mb-6">About</Eyebrow>
                    <h1 className="font-display text-5xl md:text-7xl text-[var(--fg)] leading-[0.98] mb-12">
                        Hi, I’m Mohab.
                    </h1>
                    <div className="space-y-5 text-lg text-[var(--fg-muted)] leading-relaxed">
                        <p>
                            I build products and I run them. Clinix keeps private clinics in Egypt
                            running. Eterna sells beauty products online in Arabic and English. By day
                            I work on a national platform for the Saudi Ministry of Municipalities and
                            Housing.
                        </p>
                        <p>
                            I studied mechatronics engineering, and I started in software by writing
                            tools for survey engineers. That is still how I think: find the slow,
                            manual part of someone’s day and make it go away.
                        </p>
                        <p>
                            I ship what I build. Tests run on every push, the APIs run on Railway, the
                            web apps on Vercel, and my domains on Cloudflare. When something breaks at
                            night, I am the one who fixes it.
                        </p>
                        <p className="text-[var(--fg)]">
                            I live in Riyadh and I am open to relocating to Austria.
                        </p>
                    </div>
                </div>
            </section>

            <div className="max-w-6xl mx-auto px-6">
                <div className="divider" />
            </div>

            {/* Experience */}
            <section className="px-6 py-24">
                <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-12">
                    <div className="md:col-span-4">
                        <Eyebrow>Jobs</Eyebrow>
                    </div>
                    <ul className="md:col-span-8 border-t border-[var(--hairline)]">
                        {experiences.map((exp) => (
                            <li key={exp.id} className="border-b border-[var(--hairline)] py-7 grid sm:grid-cols-12 gap-2 sm:gap-6">
                                <p className="sm:col-span-3 font-mono text-xs uppercase tracking-wider text-[var(--fg-dim)] pt-1">
                                    {exp.period}
                                </p>
                                <div className="sm:col-span-9">
                                    <h2 className="font-display text-2xl text-[var(--fg)] leading-tight">
                                        {exp.title}
                                    </h2>
                                    <p className="text-sm text-[var(--fg-muted)] mb-3">{exp.company}</p>
                                    <p className="text-[var(--fg-muted)] leading-relaxed">{exp.line}</p>
                                </div>
                            </li>
                        ))}
                        <li className="border-b border-[var(--hairline)] py-7 grid sm:grid-cols-12 gap-2 sm:gap-6">
                            <p className="sm:col-span-3 font-mono text-xs uppercase tracking-wider text-[var(--fg-dim)] pt-1">
                                2018 – 2022
                            </p>
                            <div className="sm:col-span-9">
                                <h2 className="font-display text-2xl text-[var(--fg)] leading-tight">
                                    B.Sc. Mechatronics Engineering
                                </h2>
                                <p className="text-sm text-[var(--fg-muted)] mb-3">Minya University</p>
                                <p className="text-[var(--fg-muted)] leading-relaxed">
                                    Graduation project: an IoT system that monitors a factory floor. Graded
                                    Excellent.
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>
            </section>

            <div className="max-w-6xl mx-auto px-6">
                <div className="divider" />
            </div>

            {/* Stack */}
            <section className="px-6 py-24">
                <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-12">
                    <div className="md:col-span-4">
                        <Eyebrow>What I use</Eyebrow>
                    </div>
                    <dl className="md:col-span-8 border-t border-[var(--hairline)]">
                        {stack.map((s) => (
                            <div key={s.use} className="border-b border-[var(--hairline)] py-4 grid sm:grid-cols-12 gap-1 sm:gap-6">
                                <dt className="sm:col-span-3 text-sm text-[var(--fg-dim)]">{s.use}</dt>
                                <dd className="sm:col-span-9 text-[var(--fg)]">{s.tools.join(' · ')}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </section>

            <div className="max-w-6xl mx-auto px-6">
                <div className="divider" />
            </div>

            {/* Languages + next */}
            <section className="px-6 py-24">
                <div className="max-w-3xl mx-auto">
                    <p className="text-[var(--fg-muted)] mb-12">
                        Arabic, native · English, fluent · German, A2.
                    </p>
                    <Link href="/contact" className="link-arrow text-lg">
                        Get in touch
                        <ArrowUpRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </>
    );
}
