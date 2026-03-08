'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart2, Globe2, Zap } from 'lucide-react';

const WORDS = ['Intelligence.', 'Geopolitics.', 'Risk.', 'Simulation.'];

function AnimatedBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-semibold tracking-widest uppercase mb-8"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
      India Innovates 2026 · Hackathon MVP
    </motion.div>
  );
}

export function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center px-6 pt-16">
      <div className="max-w-5xl mx-auto text-center">
        <AnimatedBadge />

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight text-slate-100 mb-6"
        >
          Mini Global{' '}
          <span
            className="block bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
            style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            Intelligence Graph
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Real-time geopolitical and economic risk intelligence for{' '}
          <span className="text-slate-200 font-medium">India, USA, China & Russia</span>{' '}
          — powered by AI extraction, knowledge graphs, and rule-based simulation.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-16"
        >
          <Link
            href="/dashboard"
            className="group flex items-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-sm hover:bg-cyan-400 transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] active:scale-95"
          >
            Explore Dashboard
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="#news"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/20 bg-white/5 text-slate-200 font-semibold text-sm hover:bg-white/10 hover:border-white/30 transition-all backdrop-blur-sm"
          >
            <Globe2 size={16} />
            View Global News
          </Link>
          <Link
            href="/simulation"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-purple-500/40 bg-purple-500/10 text-purple-300 font-semibold text-sm hover:bg-purple-500/20 hover:border-purple-400/60 transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
          >
            <Zap size={16} />
            Try Simulation
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
          className="flex flex-wrap justify-center gap-8 text-center"
        >
          {[
            { value: '4', label: 'Countries Monitored', icon: Globe2 },
            { value: '26+', label: 'News Articles / Day', icon: BarChart2 },
            { value: '5', label: 'AI Analysis Agents', icon: Zap },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <div className="text-3xl font-black text-cyan-400">{stat.value}</div>
              <div className="text-xs text-slate-500 mt-1 font-medium">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="text-[10px] text-slate-600 uppercase tracking-widest">Scroll to explore</div>
          <div className="w-px h-12 bg-linear-to-b from-cyan-500/50 to-transparent animate-pulse" />
        </motion.div>
      </div>
    </section>
  );
}
