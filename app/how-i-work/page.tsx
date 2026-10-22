'use client';

import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { Eyebrow } from '@/components/UI';

// The order is the order work actually flows: rules in, a plan, the agents, the checks, me.
const flow = [
    { step: 'Rules', body: 'Each project has written rules and skills: how code is laid out, what is never allowed, how to test. Every agent reads them first.' },
    { step: 'Plan', body: 'A planning agent splits the task into pieces small enough to check.' },
    { step: 'Build', body: 'Other agents write the front end, the API and the database changes, in parallel where they can.' },
    { step: 'Check', body: 'Agents review each other’s work, scripts run every scenario, and a report lists each problem with its root cause.' },
    { step: 'Sign off', body: 'I read the report and approve fixes one by one, as a checklist. Nothing ships without that.' },
];

const parts = [
    {
        title: 'Memory that travels',
        body: 'Project memory is committed to each repository, so any agent on any machine picks up exactly where the last one stopped, and spends fewer tokens getting there. Decisions, traps and the state of every feature are written down as the work happens.',
    },
    {
        title: 'A memory server I can reach from anywhere',
        body: 'A self-hosted RAG server on a VPS holds context shared across agents and projects. I can reach it from any machine, or from my phone.',
    },
    {
        title: 'No stopping when a quota runs out',
        body: 'When one model’s quota is used up, work moves on its own to the next paid model, and after that to free models, with extra checks on their output.',
    },
    {
        title: 'Design before code',
        body: 'For a new screen I explore 7 to 20 interactive design directions first, then build the one that is chosen. The login screen of Clinix came out of this.',
    },
];

export default function HowIWorkPage() {
    return (
        <div className="px-6 pt-24 md:pt-32 pb-16">
            <div className="max-w-6xl mx-auto">
                <Eyebrow className="mb-6">How I work</Eyebrow>
                <h1 className="font-display text-5xl md:text-7xl text-[var(--fg)] leading-[0.98] mb-8 max-w-4xl">
                    One engineer, a team of agents, and a lot of checking.
                </h1>
                <p className="text-lg text-[var(--fg-muted)] leading-relaxed max-w-2xl mb-24">
                    I build with Claude Code every day, across the front end, the back end and
                    the database. The agents are fast. The setup around them is what makes the
                    result safe to put in front of paying customers.
                </p>

                {/* The flow */}
                <section className="mb-24">
                    <Eyebrow className="mb-10">From task to release</Eyebrow>
                    <ol className="grid md:grid-cols-5 gap-px bg-[var(--hairline)] border border-[var(--hairline)] rounded-md overflow-hidden">
                        {flow.map((f, i) => (
                            <li key={f.step} className="bg-[var(--bg)] p-6">
                                <p className="font-mono text-xs text-[var(--accent)] tabular-nums mb-4">
                                    {String(i + 1).padStart(2, '0')}
                                </p>
                                <h2 className="font-display text-2xl text-[var(--fg)] mb-3">{f.step}</h2>
                                <p className="text-sm text-[var(--fg-muted)] leading-relaxed">{f.body}</p>
                            </li>
                        ))}
                    </ol>
                </section>

                {/* The parts */}
                <section className="grid md:grid-cols-2 gap-x-12 gap-y-14 mb-24">
                    {parts.map((p) => (
                        <div key={p.title} className="border-s border-[var(--hairline)] ps-6">
                            <h2 className="font-display text-3xl text-[var(--fg)] mb-3 leading-tight">{p.title}</h2>
                            <p className="text-[var(--fg-muted)] leading-relaxed">{p.body}</p>
                        </div>
                    ))}
                </section>

                {/* A real catch */}
                <section className="border-t border-[var(--hairline)] pt-16 grid md:grid-cols-12 gap-10">
                    <div className="md:col-span-4">
                        <Eyebrow>What it caught</Eyebrow>
                    </div>
                    <div className="md:col-span-8">
                        <p className="font-display text-3xl md:text-4xl text-[var(--fg)] leading-tight mb-6">
                            Both live products were rate-limiting the proxy, not the visitor.
                        </p>
                        <p className="text-[var(--fg-muted)] leading-relaxed mb-8 max-w-2xl">
                            Behind a hosting proxy, every request looked like it came from the same
                            address. One busy minute would have locked every customer out at once, and an
                            attacker could not be told apart from them. The audit found it in Eterna and
                            in Clinix. Both now read the real client address from the trusted proxy.
                        </p>
                        <Link href="/projects" className="link-arrow">
                            See the products
                            <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
