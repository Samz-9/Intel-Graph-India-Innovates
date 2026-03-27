'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic'; 
import { NewsFeed } from '@/components/NewsFeed';

const GraphViewWorld = dynamic(
  () => import('@/components/GraphView').then((m) => m.GraphViewWorld),
  {
    ssr: false,
    loading: () => (
      <div className="graph-loading-panel flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="grid grid-cols-3 gap-1">
            {[...Array(9)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-cyan-400"
                animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.12 }}
              />
            ))}
          </div>
          <span className="text-cyan-400/60 text-xs tracking-[0.2em] uppercase font-mono">
            Initializing Knowledge Graph
          </span>
        </div>
      </div>
    ),
  }
);

function AnimatedCounter({ target, duration = 1200 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <>{count}</>;
}

const STATS = [
  {
    label: 'Countries Monitored',
    value: 4,
    sub: 'India · USA · China · Russia',
    icon: '◈',
    color: 'cyan',
    gradient: 'from-cyan-500/20 to-cyan-500/0',
    border: 'border-cyan-500/30',
    glow: 'shadow-cyan-500/20',
    textColor: 'text-cyan-400',
    details: [
      { label: 'India', value: 'Primary Focus', bar: 100 },
      { label: 'USA', value: 'Allied', bar: 85 },
      { label: 'China', value: 'Adversary', bar: 72 },
      { label: 'Russia', value: 'Monitored', bar: 60 },
    ],
    tooltip: 'Real-time geopolitical monitoring across 4 major powers.',
  },
  {
    label: 'Graph Edges',
    value: 15,
    sub: 'Geopolitical connections',
    icon: '⬡',
    color: 'violet',
    gradient: 'from-violet-500/20 to-violet-500/0',
    border: 'border-violet-500/30',
    glow: 'shadow-violet-500/20',
    textColor: 'text-violet-400',
    details: [
      { label: 'Trade Links', value: '5 edges', bar: 75 },
      { label: 'Alliance', value: '3 edges', bar: 50 },
      { label: 'Tension', value: '3 edges', bar: 50 },
      { label: 'Sanction', value: '1 edge', bar: 25 },
      { label: 'Partnership', value: '2 edge', bar: 40 },
    ],
    tooltip: 'Knowledge graph edges represent active geopolitical relationships.',
  },
  {
    label: 'News Analyzed',
    value: 26,
    sub: 'AI extracted today',
    icon: '◎',
    color: 'emerald',
    gradient: 'from-emerald-500/20 to-emerald-500/0',
    border: 'border-emerald-500/30',
    glow: 'shadow-emerald-500/20',
    textColor: 'text-emerald-400',
    details: [
      { label: 'High Priority', value: '6 articles', bar: 92 },
      { label: 'India Focus', value: '11 articles', bar: 85 },
      { label: 'Sentiment –', value: '9 negative', bar: 65 },
      { label: 'Last Sync', value: '2 min ago', bar: 100 },
    ],
    tooltip: 'AI agents parsed and classified 26 geopolitical articles today.',
  },
  {
    label: 'Alerts Active',
    value: 2,
    sub: 'Requires attention',
    icon: '⚠',
    color: 'amber',
    gradient: 'from-amber-500/20 to-amber-500/0',
    border: 'border-amber-500/30',
    glow: 'shadow-amber-500/20',
    textColor: 'text-amber-400',
    pulse: true,
    details: [
      { label: 'India–China Border', value: 'CRITICAL', bar: 95 },
      { label: 'US Tariff Hike', value: 'HIGH', bar: 70 },
      { label: 'Escalation Risk', value: '68%', bar: 68 },
      { label: 'Triggered', value: '18 min ago', bar: 40 },
    ],
    tooltip: 'Active threat alerts requiring analyst review.',
  },
];

function StatCard({ stat, index }: { stat: typeof STATS[0]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className={`
        relative overflow-hidden rounded-xl border ${stat.border}
        bg-[#0a0f1a]/80 backdrop-blur-md
        shadow-lg ${stat.glow}
        cursor-default group
        transition-all duration-500
        ${hovered ? 'shadow-xl scale-[1.02] -translate-y-0.5' : ''}
      `}
      style={{ padding: '18px 20px', minHeight: hovered ? '172px' : '100px', transition: 'min-height 0.4s cubic-bezier(0.23,1,0.32,1)' }}
    >
      {/* Gradient wash */}
      <div className={`absolute inset-0 bg-linear-to-br ${stat.gradient} pointer-events-none transition-opacity duration-300 ${hovered ? 'opacity-90' : 'opacity-60'}`} />

      {/* Scan line effect */}
      <motion.div
        className="absolute inset-x-0 h-px bg-white/10 pointer-events-none"
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: index * 0.7 }}
      />

      {/* Corner accent */}
      <div className={`absolute top-0 right-0 w-8 h-8 pointer-events-none`}>
        <div className={`absolute top-0 right-0 w-full h-px ${stat.textColor.replace('text', 'bg')} opacity-50`} />
        <div className={`absolute top-0 right-0 h-full w-px ${stat.textColor.replace('text', 'bg')} opacity-50`} />
      </div>

      {/* Main row */}
      <div className="relative z-10 flex items-start gap-3">
        <div className={`text-xl mt-0.5 ${stat.textColor} opacity-70 font-mono`}>{stat.icon}</div>
        <div className="flex-1 min-w-0">
          <div className={`text-3xl font-black tracking-tight ${stat.textColor} font-mono`}>
            <AnimatedCounter target={stat.value} duration={900 + index * 150} />
          </div>
          <div className="text-xs font-semibold text-white/80 mt-1 tracking-wide">{stat.label}</div>
          <div className="text-[10px] text-white/35 mt-0.5 font-mono truncate">{stat.sub}</div>
        </div>

        {stat.pulse && (
          <div className="flex items-center gap-1.5 mt-1">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
            </span>
          </div>
        )}
      </div>

      {/* Hover Detail Panel */}
      <motion.div
        initial={false}
        animate={hovered ? { opacity: 1, y: 0, height: 'auto' } : { opacity: 0, y: -6, height: 0 }}
        transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 overflow-hidden"
      >
        {/* Divider */}
        <div className={`mt-3 mb-2.5 h-px w-full ${stat.textColor.replace('text', 'bg')} opacity-20`} />

        {/* Tooltip line */}
        {stat.tooltip && (
          <p className="text-[9px] font-mono text-white/30 mb-2 leading-relaxed tracking-wide">
            {stat.tooltip}
          </p>
        )}

        {/* Detail rows with mini bar */}
        <div className="flex flex-col gap-1.5">
          {(stat.details ?? []).map((d, di) => (
            <div key={di} className="flex items-center gap-2">
              <span className="text-[9px] font-mono text-white/40 w-[80px] shrink-0 truncate">{d.label}</span>
              <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${stat.textColor.replace('text', 'bg')} opacity-70`}
                  initial={{ width: 0 }}
                  animate={hovered ? { width: `${d.bar}%` } : { width: 0 }}
                  transition={{ duration: 0.5, delay: di * 0.06, ease: [0.23, 1, 0.32, 1] }}
                />
              </div>
              <span className={`text-[9px] font-mono font-semibold ${stat.textColor} opacity-80 w-[56px] text-right shrink-0`}>
                {d.value}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function HeaderBar() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const update = () => setTime(new Date().toUTCString().slice(17, 25) + ' UTC');
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between mb-2"
    >
      <div className="flex items-center gap-3">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
        </div>
        <span className="text-[11px] font-mono text-white/30 tracking-[0.15em] uppercase">
          Geopolitical Intelligence Dashboard · v1.0
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-[11px] font-mono text-white/25 tracking-widest">{time}</span>
        <div className="flex items-center gap-1.5">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-emerald-400"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-[10px] font-mono text-emerald-400/70 tracking-wider">LIVE</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() { 

  return (
    <div
      className="flex flex-col gap-5 h-screen overflow-hidden p-5"
      style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(6,182,212,0.08) 0%, transparent 60%), #060c18',
        fontFamily: "'IBM Plex Mono', 'Fira Code', monospace",
      }}
    >
      {/* Subtle grid background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(6,182,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Header */}
      <HeaderBar />

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        {STATS.map((stat, i) => (
          <StatCard key={stat.label} stat={stat} index={i} />
        ))}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 -my-1">
        <div className="flex-1 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
        <span className="text-[10px] font-mono text-white/20 tracking-[0.2em] uppercase">Intelligence Graph · Feed</span>
        <div className="flex-1 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Main content */}
      <div
        className="grid gap-5 flex-1 min-h-0"
        style={{ gridTemplateColumns: '1fr 340px' }}
      >
        {/* Graph Panel */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="relative flex flex-col rounded-2xl overflow-hidden min-h-0"
          style={{
            border: '1px solid rgba(6,182,212,0.15)',
            background: 'linear-gradient(135deg, rgba(6,182,212,0.04) 0%, rgba(10,15,26,0.95) 60%)',
            boxShadow: '0 0 0 1px rgba(6,182,212,0.05), inset 0 1px 0 rgba(6,182,212,0.1), 0 20px 60px rgba(0,0,0,0.5)',
          }}
        >
          {/* Panel header */}
          <div
            className="flex items-center justify-between px-4 py-2.5 border-b"
            style={{ borderColor: 'rgba(6,182,212,0.12)', background: 'rgba(6,182,212,0.04)' }}
          >
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-cyan-400" />
              <span className="text-[11px] font-mono text-white/50 tracking-[0.15em] uppercase">
                Knowledge Graph · Entity Relations
              </span>
            </div> 
          </div>
          <div className="flex-1 min-h-0 relative">
            <GraphViewWorld />
          </div>
        </motion.div>

        {/* Right Column */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="flex flex-col gap-4 min-h-0"
        >

          {/* News Feed wrapper */}
          <div
            className="flex-1 rounded-2xl flex flex-col overflow-hidden"
            style={{
              border: '1px solid rgba(139,92,246,0.2)',
              background: 'linear-gradient(135deg, rgba(139,92,246,0.05) 0%, rgba(10,15,26,0.95) 70%)',
              boxShadow: '0 0 0 1px rgba(139,92,246,0.05), 0 20px 40px rgba(0,0,0,0.4)',
            }}
          >
            <div
              className="flex items-center justify-between px-4 py-2.5 border-b"
              style={{ borderColor: 'rgba(139,92,246,0.12)', background: 'rgba(139,92,246,0.04)' }}
            >
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 rounded-full bg-violet-400" />
                <span className="text-[11px] font-mono text-white/50 tracking-[0.15em] uppercase">
                  Live Intelligence Feed
                </span>
              </div>
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-[10px] font-mono text-violet-400/70"
              >
                ● STREAMING
              </motion.div>
            </div>
            <div className="flex-1 min-h-0 relative" style={{ position: 'relative' }}>
              <NewsFeed />
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');

        .graph-loading-panel {
          background: linear-gradient(135deg, rgba(6,182,212,0.04), rgba(10,15,26,0.98));
          min-height: 460px;
        }
      `}</style>
    </div>
  );
}