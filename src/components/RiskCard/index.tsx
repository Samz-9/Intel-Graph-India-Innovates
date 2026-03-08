'use client';
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { getRiskLevel } from '@/lib/riskEngine';

interface RiskCardProps {
  score: number;
}

export function RiskCard({ score }: RiskCardProps) {
  const risk = getRiskLevel(score);

  const Icon = score > 60 ? AlertTriangle : score > 30 ? TrendingUp : Minus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel flex flex-col items-center justify-center text-center gap-3"
    >
      <div className="text-xs text-[#8b949e] uppercase tracking-widest">India Risk Score</div>
      <motion.div
        key={score}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className={`text-7xl font-bold tabular-nums ${risk.color}`}
      >
        {Math.round(score)}
      </motion.div>
      <div className={`flex items-center gap-2 px-4 py-1 rounded-full border text-sm font-semibold ${risk.bg} ${risk.color} ${risk.border}`}>
        <Icon size={14} />
        {risk.label} Risk
      </div>
      <div className="text-xs text-[#8b949e] mt-1">Composite Geopolitical Index</div>

      {/* Visual gauge bar */}
      <div className="w-full mt-2">
        <div className="flex justify-between text-[10px] text-[#8b949e] mb-1">
          <span>0 LOW</span>
          <span>50 MED</span>
          <span>HIGH 100</span>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              score > 60 ? 'bg-statusDanger' : score > 30 ? 'bg-statusWarning' : 'bg-statusSuccess'
            }`}
          />
        </div>
      </div>
    </motion.div>
  );
}
