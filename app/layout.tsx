import type { Metadata } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import IntroGate from "@/components/IntroGate";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mohab Tohamy — full-stack engineer",
  description:
    "I build software people pay for: Clinix, a clinic system, and Eterna, an online store. React, .NET and PostgreSQL, with 3D on the web.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Runs before first paint: visitors who already saw the intro this session never see it flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "try{if(sessionStorage.getItem('portfolio_intro_seen')==='1')document.documentElement.classList.add('intro-seen')}catch(e){}",
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} antialiased min-h-screen grain`}
      >
        <IntroGate />
        <Navigation />
        <main className="pt-16">{children}</main>
        <footer className="border-t border-[var(--hairline)] mt-24 py-10">
          <div className="max-w-6xl mx-auto px-6 flex flex-wrap gap-6 justify-between items-center text-sm text-[var(--fg-muted)]">
            <span>© {new Date().getFullYear()} Mohab Tohamy</span>
            <span className="hidden sm:inline">Riyadh · open to Austria</span>
            <a
              href="mailto:MohabTohamyAbdallah@gmail.com"
              className="link-arrow"
            >
              say hi
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
            </a>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
