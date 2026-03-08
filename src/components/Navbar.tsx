'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'News', href: '#news' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Contact', href: '#contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/90 backdrop-blur-xl border-b border-cyan-500/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center group-hover:bg-cyan-500/30 transition-colors">
            <Globe size={16} className="text-cyan-400" />
          </div>
          <span className="font-bold text-slate-100 text-sm tracking-wide hidden sm:block">
            INTEL<span className="text-cyan-400">GRAPH</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="px-4 py-2 text-sm text-slate-400 hover:text-cyan-300 transition-colors rounded-lg hover:bg-white/5"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/dashboard"
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 hover:border-cyan-400 transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          >
            Launch Dashboard →
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-slate-400" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden bg-slate-950/95 border-t border-white/10 px-6 py-4 flex flex-col gap-2"
        >
          {NAV_LINKS.map((link) => (
            <Link key={link.label} href={link.href} onClick={() => setMobileOpen(false)}
              className="py-2 text-sm text-slate-400 hover:text-cyan-300 transition-colors">
              {link.label}
            </Link>
          ))}
          <Link href="/dashboard" onClick={() => setMobileOpen(false)}
            className="mt-2 py-2 text-sm font-semibold text-center rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300">
            Launch Dashboard
          </Link>
        </motion.div>
      )}
    </motion.nav>
  );
}
