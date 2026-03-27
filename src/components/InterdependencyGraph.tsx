'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Globe, Zap, Activity } from 'lucide-react';

interface Relationship {
  source: string;
  target: string;
  type: string;
  description: string;
  intensity: number;
}

const FALLBACK_RELATIONSHIPS: Relationship[] = [
  { source: 'USA', target: 'China', type: 'Economic Interdependence', description: 'Major consumer-manufacturer axis defining global maritime trade volume.', intensity: 5 },
  { source: 'India', target: 'USA', type: 'Strategic Tech Edge', description: 'Cooperation on critical and emerging technologies through iCET framework.', intensity: 4 },
  { source: 'Russia', target: 'China', type: 'Energy-Security No-Limits', description: 'Deep partnership leveraging Siberian energy reserves for industrial capacity.', intensity: 5 },
  { source: 'India', target: 'Russia', type: 'Legacy Defense & Energy', description: 'Long-standing military ties diversifying into discounted crude oil supply.', intensity: 4 },
  { source: 'India', target: 'China', type: 'Competitive Border Friction', description: 'Tense geopolitical rivalry coupled with deep industrial supply chain reliance.', intensity: 3 },
  { source: 'USA', target: 'Russia', type: 'Strategic Adversary', description: 'Complete decoupling of economic spheres following geopolitical conflict.', intensity: 1 },
];

export function InterdependencyGraph() {
  const [data, setData] = useState<Relationship[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/interdependency')
      .then((res) => res.json())
      .then((json) => {
        setData(json.relationships?.length ? json.relationships : FALLBACK_RELATIONSHIPS);
        setLoading(false);
      })
      .catch(() => {
        setData(FALLBACK_RELATIONSHIPS);
        setLoading(false);
      });
  }, []);

  const countries = ['USA', 'China', 'India', 'Russia'];
  const colors: Record<string, string> = {
    USA: 'from-blue-500/20 to-blue-600/10',
    China: 'from-red-500/20 to-red-600/10',
    India: 'from-orange-500/20 to-orange-600/10',
    Russia: 'from-purple-500/20 to-purple-600/10',
  };

  const borders: Record<string, string> = {
    USA: 'border-blue-500/30',
    China: 'border-red-500/30',
    India: 'border-orange-500/30',
    Russia: 'border-purple-500/30',
  };

  const glows: Record<string, string> = {
    USA: 'shadow-blue-500/20',
    China: 'shadow-red-500/20',
    India: 'shadow-orange-500/20',
    Russia: 'shadow-purple-500/20',
  };

  const textColors: Record<string, string> = {
    USA: 'text-blue-400',
    China: 'text-red-400',
    India: 'text-orange-400',
    Russia: 'text-purple-400',
  };

  if (loading) return (
    <div className="py-24 text-center">
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="inline-block"
      >
        <Network className="w-12 h-12 text-cyan-400 opacity-50" />
      </motion.div>
      <p className="mt-4 text-xs font-mono uppercase tracking-widest text-cyan-400/50">Crunching Geopolitical matrix...</p>
    </div>
  );

  return (
    <section className="relative z-10 py-10 px-6 overflow-hidden border-y border-white/5">
      {/* Decorative Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"   />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-4"
            >
               
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
               Strategic <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Interdependency</span> Matrix
            </h2>
            <p className="text-white/50 text-lg leading-relaxed">
              AI-driven extraction of geopolitical threads between the four major power centers. Hover a nation to view its strategic web.
            </p>
          </div>

          <div className="flex gap-3">
            {countries.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCountry(selectedCountry === c ? null : c)}
                className={`px-4 py-2 rounded-full border transition-all text-xs font-mono uppercase tracking-widest
                  ${selectedCountry === c ? 'bg-white text-black border-white' : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:border-white/20'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="wait">
            {data
              .filter(rel => !selectedCountry || rel.source === selectedCountry || rel.target === selectedCountry)
              .map((rel, idx) => {
                const isSelected = selectedCountry === rel.source || selectedCountry === rel.target;
                const activeColor = isSelected ? colors[selectedCountry!] : colors[rel.source];
                const activeBorder = isSelected ? borders[selectedCountry!] : borders[rel.source];
                const activeGlow = isSelected ? glows[selectedCountry!] : glows[rel.source];
                const activeText = isSelected ? textColors[selectedCountry!] : textColors[rel.source];

                return (
                  <motion.div
                    key={`${rel.source}-${rel.target}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className={`group relative p-6 rounded-2xl border ${activeBorder} bg-gradient-to-br ${activeColor} ${activeGlow} transition-all duration-300 backdrop-blur-sm shadow-xl`}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-2">
                         <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase tracking-wider bg-white/10 ${activeText}`}>
                           {rel.source}
                         </span>
                         <Activity className="w-3 h-3 text-white/20" />
                         <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase tracking-wider bg-white/10 text-white/80`}>
                           {rel.target}
                         </span>
                      </div>
                      <div className="flex -space-x-1">
                        {[...Array(rel.intensity)].map((_, i) => (
                           <Zap key={i} className={`w-3 h-3 ${activeText} fill-current`} />
                        ))}
                      </div>
                    </div>

                    <h3 className="text-white font-bold mb-2 group-hover:translate-x-1 transition-transform">{rel.type}</h3>
                    <p className="text-white/40 text-xs leading-relaxed font-mono italic">
                      {rel.description}
                    </p>

                    {/* Connecting line decorative */}
                    <div className="absolute bottom-4 right-4 opacity-10 group-hover:opacity-30 transition-opacity">
                      <Network className="w-12 h-12 text-white" />
                    </div>
                  </motion.div>
                );
              })}
          </AnimatePresence>
        </div>

        {/* Footnote */}
        <div className="mt-12 flex items-center gap-4 py-4 px-6 rounded-xl bg-white/5 border border-white/5">
           <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/40">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              Live Engine
           </div>
           <div className="h-px flex-1 bg-white/5" />
           <p className="text-[10px] font-mono text-white/50">
             Extracted using Gemini-Flash-Pro via Interdependency Engine v2.0
           </p>
        </div>
      </div>
    </section>
  );
}
