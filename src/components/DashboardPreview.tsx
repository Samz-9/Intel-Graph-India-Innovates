'use client';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, TrendingUp } from 'lucide-react';

const COUNTRIES = [
  { name: 'India', flag: '🇮🇳', risk: 45, gdp: '+7.2%', riskLabel: 'Medium', color: 'text-amber-400', bar: 'bg-amber-400' },
  { name: 'USA', flag: '🇺🇸', risk: 28, gdp: '+2.0%', riskLabel: 'Low', color: 'text-emerald-400', bar: 'bg-emerald-400' },
  { name: 'China', flag: '🇨🇳', risk: 62, gdp: '+5.0%', riskLabel: 'Medium', color: 'text-amber-400', bar: 'bg-amber-400' },
  { name: 'Russia', flag: '🇷🇺', risk: 74, gdp: '+1.8%', riskLabel: 'High', color: 'text-red-400', bar: 'bg-red-400' },
];

export function DashboardPreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="dashboard-preview" ref={ref} className="relative py-32 px-6">
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-indigo-950/20 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <div className="text-[10px] font-mono text-purple-400 tracking-widest uppercase mb-4 border border-purple-500/20 px-3 py-1 rounded-full bg-purple-500/10 inline-block">
            Dashboard Preview
          </div>
          <h2 className="text-4xl font-black text-slate-100 mb-4">
            See the Full Picture
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            All four countries. All signals. One unified intelligence view.
          </p>
        </motion.div>

        {/* Mock dashboard panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.15 }}
          className="relative rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-xl overflow-hidden shadow-[0_0_80px_rgba(6,182,212,0.05)]"
        >
          {/* Fake titlebar */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-white/7 bg-white/2">
            <span className="w-3 h-3 rounded-full bg-red-500/60" />
            <span className="w-3 h-3 rounded-full bg-amber-500/60" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/60" />
            <span className="ml-3 text-xs text-slate-600 font-mono">india-intel-graph / dashboard</span>
          </div>

          <div className="p-6">
            {/* Mini stat strip */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[{ label: 'Countries', v: '4' }, { label: 'Graph Edges', v: '8' }, { label: 'News Today', v: '26' }, { label: 'Active Alerts', v: '2' }].map((s) => (
                <div key={s.label} className="text-center p-3 rounded-xl bg-white/3 border-white/6">
                  <div className="text-2xl font-black text-cyan-400">{s.v}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Country risk cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {COUNTRIES.map((c, i) => (
                <motion.div
                  key={c.name}
                  initial={{ opacity: 0, y: 15 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.25 + i * 0.08 }}
                  className="p-4 rounded-xl border border-white/8 bg-white/3"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{c.flag}</span>
                    <span className={`text-xs font-semibold ${c.color}`}>{c.riskLabel}</span>
                  </div>
                  <div className="text-base font-bold text-slate-100 mb-1">{c.name}</div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
                    <TrendingUp size={11} className="text-emerald-400" />
                    GDP {c.gdp}
                  </div>
                  {/* Risk bar */}
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full ${c.bar} rounded-full`} style={{ width: `${c.risk}%` }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-600 mt-1">
                    <span>Risk</span>
                    <span>{c.risk}/100</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-cyan-500/20 to-purple-500/20 border border-white/10 text-slate-200 font-semibold text-sm hover:border-cyan-500/40 hover:from-cyan-500/30 hover:to-purple-500/30 transition-all"
          >
            Open Full Dashboard
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
