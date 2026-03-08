'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Loader2, SlidersHorizontal } from 'lucide-react';
import { orchestrate, OrchestratorResult } from '@/agents/orchestrator';
import { AgentInsights } from '@/components/AgentInsights';

interface SimulationPanelProps {
  onSimulate: (oilChange: number, newRisk: number, newInflation: number) => void;
  currentRiskScore: number;
  currentInflation: number;
}

export function SimulationPanel({ onSimulate, currentRiskScore, currentInflation }: SimulationPanelProps) {
  const [oilChange, setOilChange] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<OrchestratorResult | null>(null);

  const projectedInflation = currentInflation + (oilChange / 20) * 2;
  const projectedRisk = Math.min(100, Math.max(0, currentRiskScore + (oilChange / 20) * 10));

  const handleSimulate = () => {
    setIsRunning(true);
    setResult(null);
    setTimeout(() => {
      const res = orchestrate({
        oilPriceChange: oilChange,
        currentRiskScore: projectedRisk,
        currentInflation: projectedInflation,
      });
      setResult(res);
      onSimulate(oilChange, projectedRisk, projectedInflation);
      setIsRunning(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Input Panel */}
      <div className="glass-panel">
        <div className="flex items-center gap-2 mb-6">
          <SlidersHorizontal size={18} className="text-accentBlue" />
          <h3 className="text-lg font-semibold">What-If Simulation</h3>
        </div>

        <label className="block mb-6">
          <div className="flex justify-between mb-3">
            <span className="text-sm font-medium text-[#cdd9e5]">Global Oil Price Shock</span>
            <span className={`text-lg font-bold ${oilChange > 0 ? 'text-statusWarning' : oilChange < 0 ? 'text-statusSuccess' : 'text-[#8b949e]'}`}>
              {oilChange > 0 ? '+' : ''}{oilChange}%
            </span>
          </div>
          <input
            type="range"
            min="-20"
            max="40"
            step="5"
            value={oilChange}
            onChange={(e) => setOilChange(Number(e.target.value))}
            className="w-full bg-transparent appearance-none focus:outline-none custom-slider"
          />
          <div className="flex justify-between text-[11px] text-[#8b949e] mt-2">
            <span>-20% (Price Drop)</span>
            <span>Baseline</span>
            <span>+40% (Shock)</span>
          </div>
        </label>

        {/* Projected Effects Preview */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3 bg-black/20 rounded-xl border border-white/5">
            <div className="text-[11px] text-[#8b949e] mb-1">Projected Inflation (India)</div>
            <div className={`text-xl font-bold ${projectedInflation > currentInflation ? 'text-statusWarning' : 'text-statusSuccess'}`}>
              {projectedInflation.toFixed(1)}%
            </div>
            <div className="text-[11px] text-[#8b949e]">
              {oilChange !== 0 ? `${oilChange > 0 ? '+' : ''}${((oilChange / 20) * 2).toFixed(1)}% change` : 'No change'}
            </div>
          </div>
          <div className="p-3 bg-black/20 rounded-xl border border-white/5">
            <div className="text-[11px] text-[#8b949e] mb-1">Projected Risk Score</div>
            <div className={`text-xl font-bold ${projectedRisk > 60 ? 'text-statusDanger' : projectedRisk > 30 ? 'text-statusWarning' : 'text-statusSuccess'}`}>
              {Math.round(projectedRisk)}
            </div>
            <div className="text-[11px] text-[#8b949e]">
              {oilChange !== 0 ? `${oilChange > 0 ? '+' : ''}${((oilChange / 20) * 10).toFixed(0)} pts` : 'No change'}
            </div>
          </div>
        </div>

        <button
          onClick={handleSimulate}
          disabled={isRunning}
          className="w-full flex items-center justify-center gap-2 bg-accentBlue text-black font-semibold py-3 rounded-xl transition-all hover:bg-[#79c0ff] hover:shadow-[0_0_15px_rgba(88,166,255,0.4)] disabled:opacity-50 disabled:cursor-wait"
        >
          {isRunning ? (
            <><Loader2 size={16} className="animate-spin" />Running Cabinet of Five Agents...</>
          ) : (
            <><Play size={16} />Run Simulation</>
          )}
        </button>
      </div>

      {/* Agent Insights Output */}
      <AgentInsights result={result} />
    </div>
  );
}
