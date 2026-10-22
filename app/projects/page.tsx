'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { Eyebrow } from '@/components/UI';
import { projects } from '@/data/projects';

export default function ProjectsPage() {
    return (
        <div className="px-6 pt-24 md:pt-32 pb-16">
            <div className="max-w-6xl mx-auto">
                <Eyebrow className="mb-6">Work</Eyebrow>
                <h1 className="font-display text-5xl md:text-7xl text-[var(--fg)] leading-[0.98] mb-8 max-w-3xl">
                    Fewer projects, told properly.
                </h1>

                {/* Jump list */}
                <nav className="flex flex-wrap gap-x-6 gap-y-2 mb-20 text-sm" aria-label="Projects on this page">
                    {projects.map((p) => (
                        <a key={p.id} href={`#${p.id}`} className="text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors">
                            {p.title}
                        </a>
                    ))}
                </nav>

                <div className="space-y-px">
                    {projects.map((p) => (
                        <motion.article
                            key={p.id}
                            id={p.id}
                            initial={{ opacity: 0.4, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ duration: 0.4 }}
                            className="scroll-mt-24 border-t border-[var(--hairline)] py-16 grid md:grid-cols-12 gap-10"
                        >
                            {/* Left: what it is */}
                            <header className="md:col-span-5">
                                <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--fg-dim)] mb-4">
                                    {p.kind}
                                </p>
                                <h2 className="font-display text-4xl md:text-5xl text-[var(--fg)] leading-tight mb-5">
                                    {p.title}
                                </h2>
                                <p className="text-lg text-[var(--fg-muted)] leading-relaxed mb-5">
                                    {p.summary}
                                </p>
                                <p className="text-sm text-[var(--fg-dim)] leading-relaxed mb-6">
                                    {p.role}
                                </p>
                                {p.link &&
                                    (p.link.href.startsWith('http') ? (
                                        <a href={p.link.href} target="_blank" rel="noopener noreferrer" className="link-arrow">
                                            {p.link.label}
                                            <ArrowUpRight className="w-4 h-4" />
                                        </a>
                                    ) : (
                                        <Link href={p.link.href} className="link-arrow">
                                            {p.link.label}
                                            <ArrowUpRight className="w-4 h-4" />
                                        </Link>
                                    ))}
                                <p className="font-mono text-xs text-[var(--fg-dim)] leading-relaxed mt-8">
                                    {p.stack.join('  ·  ')}
                                </p>
                            </header>

                            {/* Right: the parts worth explaining */}
                            {p.points.length > 0 && (
                                <div className="md:col-span-7 grid sm:grid-cols-2 gap-x-8 gap-y-10 content-start">
                                    {p.points.map((pt) => (
                                        <div key={pt.title} className="border-s border-[var(--hairline)] ps-5">
                                            <h3 className="text-[var(--fg)] font-medium mb-2 leading-snug">
                                                {pt.title}
                                            </h3>
                                            <p className="text-sm text-[var(--fg-muted)] leading-relaxed">
                                                {pt.body}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.article>
                    ))}
                </div>
            </div>
        </div>
    );
}
