'use client';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ExternalLink } from 'lucide-react';

const NEWS = [
  { id: 1, headline: 'India and USA announce landmark semiconductor cooperation agreement', country: 'India · USA', sentiment: 'positive', time: '2h ago' },
  { id: 2, headline: 'LAC tensions: India-China border standoff enters critical phase', country: 'India · China', sentiment: 'negative', time: '5h ago' },
  { id: 3, headline: 'Russia redirects 40% oil exports to Asian markets amid Western sanctions', country: 'Russia', sentiment: 'neutral', time: '8h ago' },
  { id: 4, headline: 'US tightens tech export controls, China vows retaliation', country: 'USA · China', sentiment: 'negative', time: '11h ago' },
  { id: 5, headline: 'India GDP surges 7.2% in Q3; beats consensus by 110 bps', country: 'India', sentiment: 'positive', time: '1d ago' },
  { id: 6, headline: 'India-Russia rupee-ruble settlement hits record $8B in FY25', country: 'India · Russia', sentiment: 'neutral', time: '1d ago' },
];

const sentimentConfig = {
  positive: { dot: 'bg-emerald-400', text: 'text-emerald-400', label: 'Positive', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  negative: { dot: 'bg-red-400', text: 'text-red-400', label: 'Negative', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  neutral: { dot: 'bg-slate-400', text: 'text-slate-400', label: 'Neutral', bg: 'bg-slate-500/10', border: 'border-slate-500/20' },
};

export function NewsPreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="news" ref={ref} className="relative py-32 px-6">
      {/* Section divider */}
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-cyan-500/30 to-transparent" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
        >
          <div>
            <div className="text-[10px] font-mono text-cyan-500 tracking-widest uppercase mb-3 border border-cyan-500/20 px-3 py-1 rounded-full bg-cyan-500/10 inline-block">
              Live Intel Feed
            </div>
            <h2 className="text-4xl font-black text-slate-100">Global Headlines</h2>
            <p className="text-slate-400 mt-2 text-sm">AI-extracted geopolitical signals from 26+ sources</p>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors shrink-0"
          >
            View All News <ExternalLink size={13} />
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {NEWS.map((item, i) => {
            const cfg = sentimentConfig[item.sentiment as keyof typeof sentimentConfig];
            return (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.06 * i }}
                className="group relative p-5 rounded-xl border border-white/8 bg-white/3 backdrop-blur-sm hover:bg-white/6 hover:border-white/15 transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.border} ${cfg.text}`}>
                    {cfg.label}
                  </div>
                  <span className="text-[11px] text-slate-600 shrink-0">{item.time}</span>
                </div>
                <h3 className="text-sm font-medium text-slate-200 leading-snug mb-3 group-hover:text-white transition-colors">{item.headline}</h3>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                  <span className="text-[11px] text-slate-500">{item.country}</span>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
