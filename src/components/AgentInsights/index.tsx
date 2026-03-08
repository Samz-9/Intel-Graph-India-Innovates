'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { OrchestratorResult } from '@/agents/orchestrator';
import { Bot, AlertTriangle, Info, Zap } from 'lucide-react';

interface AgentInsightsProps {
  result: OrchestratorResult | null;
}

const severityStyles = {
  info: { border: 'border-accentBlue/40', bg: 'bg-accentBlue/5', icon: <Info size={14} className="text-accentBlue" /> },
  warning: { border: 'border-statusWarning/40', bg: 'bg-statusWarning/5', icon: <AlertTriangle size={14} className="text-statusWarning" /> },
  critical: { border: 'border-statusDanger/40', bg: 'bg-statusDanger/5', icon: <Zap size={14} className="text-statusDanger" /> },
};

export function AgentInsights({ result }: AgentInsightsProps) {
  if (!result) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Executive Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`glass-panel border ${
          result.overallSeverity === 'critical' ? 'border-statusDanger/50' :
          result.overallSeverity === 'warning' ? 'border-statusWarning/50' : 'border-statusSuccess/50'
        }`}
      >
        <div className="flex items-center gap-2 mb-3">
          <Bot size={16} className="text-accentBlue" />
          <span className="font-bold text-sm tracking-wide">Orchestrator — Executive Summary</span>
        </div>
        <p className="text-sm text-[#cdd9e5] leading-relaxed">{result.executiveSummary}</p>
      </motion.div>

      {/* Individual Agent Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <AnimatePresence>
          {result.insights.map((insight, i) => {
            const style = severityStyles[insight.severity];
            return (
              <motion.div
                key={insight.agent}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`glass-panel border ${style.border} ${style.bg}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {style.icon}
                  <span className="font-semibold text-sm">{insight.agent}</span>
                </div>
                <div className="text-[11px] text-[#8b949e] mb-2 font-mono">{insight.domain}</div>
                <p className="text-sm text-[#cdd9e5] leading-relaxed">{insight.insight}</p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
