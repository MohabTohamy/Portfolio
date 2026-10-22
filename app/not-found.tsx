import Link from 'next/link';

export default function NotFound() {
    return (
        <section className="px-6 pt-32 pb-40">
            <div className="max-w-3xl mx-auto">
                <p className="eyebrow mb-6">404 · lost in space</p>
                <h1 className="font-display text-5xl md:text-7xl text-[var(--fg)] leading-[0.98] mb-8">
                    Nothing at these coordinates.
                </h1>
                <p className="text-lg text-[var(--fg-muted)] leading-relaxed mb-10 max-w-xl">
                    The page may have moved when the site was rebuilt.
                </p>
                <div className="flex flex-wrap gap-6">
                    <Link href="/" className="link-arrow">Back home</Link>
                    <Link href="/projects" className="link-arrow">See the work</Link>
                </div>
            </div>
        </section>
    );
}
