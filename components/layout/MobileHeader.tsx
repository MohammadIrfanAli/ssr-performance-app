'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { NAV_LINKS } from '@/lib/nav';

export default function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const closeDrawer = () => setIsOpen(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      <button
        id="mobile-nav-toggle"
        onClick={() => setIsOpen(true)}
        aria-label="Open navigation menu"
        className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-slate-800 transition-colors gap-1.5"
      >
        <span className="block w-5 h-0.5 bg-slate-300 rounded-full" />
        <span className="block w-5 h-0.5 bg-slate-300 rounded-full" />
        <span className="block w-5 h-0.5 bg-slate-300 rounded-full" />
      </button>

      <div
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      <aside
        aria-label="Mobile navigation"
        className={`fixed top-0 right-0 min-h-screen h-full w-72 bg-slate-900 border-l border-slate-800 z-50 flex flex-col md:hidden
          transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-slate-800 shrink-0">
          <span className="text-xl md:text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            SSR App
          </span>
          <button
            id="mobile-nav-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation menu"
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-slate-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-4 pt-6 flex-1">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={closeDrawer}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {label}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
