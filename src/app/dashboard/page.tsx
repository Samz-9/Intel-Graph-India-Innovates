'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { RiskCard } from '@/components/RiskCard';
import { NewsFeed } from '@/components/NewsFeed';

// Dynamically import ReactFlow-based graph to avoid SSR issues
const GraphViewInteractive = dynamic(
  () => import('@/components/GraphView').then((m) => m.GraphViewInteractive),
  { ssr: false, loading: () => <div className="glass-panel flex items-center justify-center h-full"><span className="text-[#8b949e] text-sm animate-pulse">Loading Knowledge Graph...</span></div> }
);

export default function DashboardPage() {
  const [riskScore] = useState(45);

  return (
    <div className="flex flex-col gap-6">
      {/* Top stats bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-4 gap-4"
      >
        {[
          { label: 'Countries Monitored', value: '4', sub: 'India, USA, China, Russia' },
          { label: 'Graph Edges', value: '8', sub: 'Geopolitical connections' },
          { label: 'News Analyzed', value: '26', sub: 'AI extracted today' },
          { label: 'Alerts Active', value: '2', sub: 'Requires attention' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="glass-panel py-4!"
          >
            <div className="text-2xl font-bold text-accentBlue">{stat.value}</div>
            <div className="text-xs font-semibold text-foreground mt-0.5">{stat.label}</div>
            <div className="text-[11px] text-[#8b949e] mt-0.5">{stat.sub}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main content: Graph + Right column */}
      <div className="grid grid-cols-[1fr_340px] gap-6" style={{ minHeight: '520px' }}>
        <GraphViewInteractive />
        <div className="flex flex-col gap-4">
          <RiskCard score={riskScore} />
          <div className="flex-1 min-h-0 overflow-hidden">
            <NewsFeed />
          </div>
        </div>
      </div>
    </div>
  );
}
