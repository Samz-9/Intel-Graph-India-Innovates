'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Network, ShieldAlert, FlaskConical } from 'lucide-react';

const FEATURES = [
  {
    icon: Network,
    title: 'Knowledge Graph',
    desc: 'Interactive node-edge graph mapping trade alliances, tensions, and geopolitical connections between India, USA, China and Russia.',
    color: 'text-cyan-400',
    border: 'group-hover:border-cyan-500/50',
    glow: 'group-hover:shadow-[0_0_25px_rgba(6,182,212,0.15)]',
    bg: 'bg-cyan-500/10',
  },
  {
    icon: ShieldAlert,
    title: 'Risk Intelligence',
    desc: 'Composite risk scoring using real news sentiment, conflict signals, and World Bank inflation data. Color-coded Low / Medium / High.',
    color: 'text-amber-400',
    border: 'group-hover:border-amber-500/50',
    glow: 'group-hover:shadow-[0_0_25px_rgba(245,158,11,0.15)]',
    bg: 'bg-amber-500/10',
  },
  {
    icon: FlaskConical,
    title: 'What-If Simulation',
    desc: 'Adjust oil price shocks and run the Cabinet of Five AI agents to model cascading effects on inflation, trade, energy, and public sentiment.',
    color: 'text-purple-400',
    border: 'group-hover:border-purple-500/50',
    glow: 'group-hover:shadow-[0_0_25px_rgba(168,85,247,0.15)]',
    bg: 'bg-purple-500/10',
  },
];

const PILLARS = [
  'Real-time news extraction via AI',
  'GDP & inflation from World Bank data',
  'Five specialist AI analytical agents',
  'Interactive geopolitical graph visualization',
];

export function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" ref={ref} className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-20"
        >
          <div className="inline-block text-[10px] font-mono text-cyan-500 tracking-widest uppercase mb-4 border border-cyan-500/20 px-3 py-1 rounded-full bg-cyan-500/10">
            Platform Overview
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-100 leading-tight mb-5">
            Intelligence at the{' '}
            <span className="bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
              style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Speed of AI
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            We combine real economic data, live news analysis, and a multi-agent AI system to give policymakers a single, clear geopolitical picture.
          </p>
        </motion.div>

        {/* Capabilities list */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap justify-center gap-3 mb-20"
        >
          {PILLARS.map((p) => (
            <span key={p} className="flex items-center gap-2 text-sm text-slate-400 px-4 py-2 rounded-full border border-white/10 bg-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              {p}
            </span>
          ))}
        </motion.div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.12 }}
                className={`group relative p-6 rounded-2xl border border-white/10 bg-white/3 backdrop-blur-sm transition-all duration-300 cursor-default ${f.border} ${f.glow} hover:-translate-y-1`}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${f.bg} mb-5`}>
                  <Icon size={22} className={f.color} />
                </div>
                <h3 className="text-lg font-bold text-slate-100 mb-3">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>

                {/* Bottom accent line */}
                <div className={`absolute bottom-0 left-6 right-6 h-px bg-linear-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-30 transition-opacity ${f.color}`} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
