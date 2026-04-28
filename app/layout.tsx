import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { ClientMonitoring } from "@/components/shared/ClientMonitoring";
import MobileHeader from "@/components/layout/MobileHeader";
import { NAV_LINKS } from "@/lib/nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SSR Performance App",
  description: "Next.js application built to demonstrate SSR, performance optimization, and system design practices.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <head>
        <link rel="preconnect" href="https://picsum.photos" />
        <link rel="dns-prefetch" href="https://picsum.photos" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-50 min-h-screen flex flex-col`}
      >
        <ClientMonitoring />

        <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
          <nav className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
            <Link
              href="/"
              className="text-xl md:text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent shrink-0"
            >
              SSR App
            </Link>

            <div className="hidden md:flex items-center gap-5 lg:gap-6 text-sm font-medium">
              {NAV_LINKS.map(({ href, label }) => (
                <Link key={href} href={href} className="text-base font-medium hover:text-blue-400 transition-colors">
                  {label}
                </Link>
              ))}
            </div>

            <MobileHeader />
          </nav>
        </header>

        <main className="flex-1 container mx-auto px-3 sm:px-4 py-5 sm:py-8">
          {children}
        </main>

        <footer className="border-t border-slate-800 py-6 sm:py-8 bg-slate-950">
          <div className="container mx-auto px-4 text-center text-xs sm:text-sm text-slate-300">
            &copy; 2026 SSR Performance App. Built for excellence.
          </div>
        </footer>
      </body>
    </html>
  );
}
