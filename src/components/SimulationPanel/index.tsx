// 'use client';
// import { useState } from 'react';
// import { motion } from 'framer-motion';
// import { Play, Loader2, SlidersHorizontal } from 'lucide-react';
// import { orchestrate, OrchestratorResult } from '@/agents/orchestrator';
// import { AgentInsights } from '@/components/AgentInsights';

// interface SimulationPanelProps {
//   onSimulate: (oilChange: number, newRisk: number, newInflation: number) => void;
//   currentRiskScore: number;
//   currentInflation: number;
// }

// export function SimulationPanel({ onSimulate, currentRiskScore, currentInflation }: SimulationPanelProps) {
//   const [oilChange, setOilChange] = useState(0);
//   const [isRunning, setIsRunning] = useState(false);
//   const [result, setResult] = useState<OrchestratorResult | null>(null);

//   const projectedInflation = currentInflation + (oilChange / 20) * 2;
//   const projectedRisk = Math.min(100, Math.max(0, currentRiskScore + (oilChange / 20) * 10));

//   const handleSimulate = () => {
//     setIsRunning(true);
//     setResult(null);
//     setTimeout(() => {
//       const res = orchestrate({
//         oilPriceChange: oilChange,
//         currentRiskScore: projectedRisk,
//         currentInflation: projectedInflation,
//       });
//       setResult(res);
//       onSimulate(oilChange, projectedRisk, projectedInflation);
//       setIsRunning(false);
//     }, 1200);
//   };

//   return (
//     <div className="flex flex-col gap-6">
//       {/* Input Panel */}
//       <div className="glass-panel">
//         <div className="flex items-center gap-2 mb-6">
//           <SlidersHorizontal size={18} className="text-accentBlue" />
//           <h3 className="text-lg font-semibold">What-If Simulation</h3>
//         </div>

//         <label className="block mb-6">
//           <div className="flex justify-between mb-3">
//             <span className="text-sm font-medium text-[#cdd9e5]">Global Oil Price Shock</span>
//             <span className={`text-lg font-bold ${oilChange > 0 ? 'text-statusWarning' : oilChange < 0 ? 'text-statusSuccess' : 'text-[#8b949e]'}`}>
//               {oilChange > 0 ? '+' : ''}{oilChange}%
//             </span>
//           </div>
//           <input
//             type="range"
//             min="-20"
//             max="40"
//             step="5"
//             value={oilChange}
//             onChange={(e) => setOilChange(Number(e.target.value))}
//             className="w-full bg-transparent appearance-none focus:outline-none custom-slider"
//           />
//           <div className="flex justify-between text-[11px] text-[#8b949e] mt-2">
//             <span>-20% (Price Drop)</span>
//             <span>Baseline</span>
//             <span>+40% (Shock)</span>
//           </div>
//         </label>

//         {/* Projected Effects Preview */}
//         <div className="grid grid-cols-2 gap-3 mb-6">
//           <div className="p-3 bg-black/20 rounded-xl border border-white/5">
//             <div className="text-[11px] text-[#8b949e] mb-1">Projected Inflation (India)</div>
//             <div className={`text-xl font-bold ${projectedInflation > currentInflation ? 'text-statusWarning' : 'text-statusSuccess'}`}>
//               {projectedInflation.toFixed(1)}%
//             </div>
//             <div className="text-[11px] text-[#8b949e]">
//               {oilChange !== 0 ? `${oilChange > 0 ? '+' : ''}${((oilChange / 20) * 2).toFixed(1)}% change` : 'No change'}
//             </div>
//           </div>
//           <div className="p-3 bg-black/20 rounded-xl border border-white/5">
//             <div className="text-[11px] text-[#8b949e] mb-1">Projected Risk Score</div>
//             <div className={`text-xl font-bold ${projectedRisk > 60 ? 'text-statusDanger' : projectedRisk > 30 ? 'text-statusWarning' : 'text-statusSuccess'}`}>
//               {Math.round(projectedRisk)}
//             </div>
//             <div className="text-[11px] text-[#8b949e]">
//               {oilChange !== 0 ? `${oilChange > 0 ? '+' : ''}${((oilChange / 20) * 10).toFixed(0)} pts` : 'No change'}
//             </div>
//           </div>
//         </div>

//         <button
//           onClick={handleSimulate}
//           disabled={isRunning}
//           className="w-full flex items-center justify-center gap-2 bg-accentBlue text-black font-semibold py-3 rounded-xl transition-all hover:bg-[#79c0ff] hover:shadow-[0_0_15px_rgba(88,166,255,0.4)] disabled:opacity-50 disabled:cursor-wait"
//         >
//           {isRunning ? (
//             <><Loader2 size={16} className="animate-spin" />Running Cabinet of Five Agents...</>
//           ) : (
//             <><Play size={16} />Run Simulation</>
//           )}
//         </button>
//       </div>

//       {/* Agent Insights Output */}
//       <AgentInsights result={result} />
//     </div>
//   );
// }






'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { Play, Loader2, AlertTriangle, Shield, Flame } from 'lucide-react';
import { orchestrate, OrchestratorResult } from '@/agents/orchestrator';
import { AgentInsights } from '@/components/AgentInsights';

interface SimulationPanelProps {
  onSimulate: (oilChange: number, newRisk: number, newInflation: number) => void;
  currentRiskScore: number;
  currentInflation: number;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function useTicker(target: number, decimals = 1) {
  const spring = useSpring(target, { stiffness: 120, damping: 20 });
  useEffect(() => { spring.set(target); }, [target]);
  return useTransform(spring, v => v.toFixed(decimals));
}

/* ── Arc Gauge ── */
function ArcGauge({ value, color }: { value: number; color: string }) {
  const r = 40, cx = 52, cy = 52;
  const pct = clamp(value / 100, 0, 1);
  return (
    <svg width={104} height={62} viewBox="0 0 104 62" style={{ overflow: 'visible' }}>
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={6} strokeLinecap="round" />
      <motion.path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none" stroke={color} strokeWidth={6} strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 7px ${color})` }}
        initial={{ pathLength: 0 }} animate={{ pathLength: pct }}
        transition={{ duration: 0.9, ease: 'easeOut' }} />
      <text x={cx} y={cy - 6} textAnchor="middle" fill={color}
        style={{ fontSize: 21, fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>
        {Math.round(value)}
      </text>
      <text x={cx} y={cy + 13} textAnchor="middle" fill="rgba(255,255,255,0.25)"
        style={{ fontSize: 10, fontFamily: 'Inter, sans-serif' }}>
        / 100
      </text>
    </svg>
  );
}

/* ── Threat Bar ── */
function ThreatBar({ risk }: { risk: number }) {
  const level = risk > 70 ? 'Critical' : risk > 50 ? 'Elevated' : risk > 30 ? 'Moderate' : 'Stable';
  const color = risk > 70 ? '#f87171' : risk > 50 ? '#60a5fa' : risk > 30 ? '#93c5fd' : '#34d399';
  const Icon = risk > 50 ? Flame : risk > 30 ? AlertTriangle : Shield;
  const bars = 14;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 14px',
      background: `linear-gradient(90deg, ${color}15, transparent)`,
      border: `1px solid ${color}28`,
      borderLeft: `3px solid ${color}`,
      borderRadius: '0 8px 8px 0',
    }}>
      <Icon size={12} color={color} />
      <div style={{ display: 'flex', gap: 3, flex: 1, alignItems: 'flex-end', height: 16 }}>
        {Array.from({ length: bars }).map((_, i) => {
          const active = i < Math.round((risk / 100) * bars);
          return (
            <motion.div key={i}
              initial={{ scaleY: 0.1 }} animate={{ scaleY: active ? 1 : 0.12 }}
              transition={{ delay: i * 0.035, duration: 0.22 }}
              style={{
                flex: 1, height: active ? 14 : 4, borderRadius: 2,
                background: active ? color : 'rgba(255,255,255,0.07)',
                boxShadow: active ? `0 0 5px ${color}90` : 'none',
                transformOrigin: 'bottom',
              }}
            />
          );
        })}
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, color, minWidth: 56, textAlign: 'right' }}>
        {level}
      </span>
    </div>
  );
}

/* ══════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════ */
export function SimulationPanel({ onSimulate, currentRiskScore, currentInflation }: SimulationPanelProps) {
  const [oilChange, setOilChange] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<OrchestratorResult | null>(null);
  const [hasRun, setHasRun] = useState(false);
  const [, forceUpdate] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const projInflation = currentInflation + (oilChange / 20) * 2;
  const projRisk = clamp(currentRiskScore + (oilChange / 20) * 10, 0, 100);
  const inflTicker = useTicker(projInflation, 1);

  const shockColor =
    oilChange > 20 ? '#f87171' :
    oilChange > 0  ? '#60a5fa' :
    oilChange < 0  ? '#34d399' : '#475569';

  const riskColor = projRisk > 60 ? '#f87171' : projRisk > 30 ? '#60a5fa' : '#34d399';

  useEffect(() => {
    const id = setInterval(() => forceUpdate(n => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(96,165,250,0.07)';
    ctx.lineWidth = 0.5;
    const step = 32;
    for (let x = 0; x < canvas.width; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }
  }, []);

  const handleSimulate = () => {
    setIsRunning(true);
    setResult(null);
    setTimeout(() => {
      const res = orchestrate({ oilPriceChange: oilChange, currentRiskScore: projRisk, currentInflation: projInflation });
      setResult(res);
      onSimulate(oilChange, projRisk, projInflation);
      setIsRunning(false);
      setHasRun(true);
    }, 1400);
  };

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .sim-wrap {
          font-family: 'Inter', sans-serif;
          display: flex; flex-direction: column; gap: 16px;
        }

        .sim-card {
          position: relative; overflow: hidden;
          background: #080d14;
          border: 1px solid rgba(96,165,250,0.18);
          border-radius: 14px;
          box-shadow:
            0 0 0 1px rgba(96,165,250,0.05) inset,
            0 0 60px rgba(59,130,246,0.09),
            0 32px 64px rgba(0,0,0,0.8);
        }

        /* scanlines — very subtle */
        .sim-card::after {
          content: '';
          position: absolute; inset: 0; pointer-events: none; z-index: 100;
          background: repeating-linear-gradient(
            0deg, transparent, transparent 3px,
            rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px
          );
        }

        /* corner brackets */
        .cb { position: absolute; width: 16px; height: 16px; z-index: 20; }
        .cb-tl { top: -1px; left: -1px;  border-top: 2px solid #3b82f6; border-left:  2px solid #3b82f6; border-radius: 4px 0 0 0; }
        .cb-tr { top: -1px; right: -1px; border-top: 2px solid #3b82f6; border-right: 2px solid #3b82f6; border-radius: 0 4px 0 0; }
        .cb-bl { bottom: -1px; left: -1px;  border-bottom: 2px solid #3b82f6; border-left:  2px solid #3b82f6; border-radius: 0 0 0 4px; }
        .cb-br { bottom: -1px; right: -1px; border-bottom: 2px solid #3b82f6; border-right: 2px solid #3b82f6; border-radius: 0 0 4px 0; }

        .top-bar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 20px;
          background: linear-gradient(90deg, rgba(59,130,246,0.1), rgba(59,130,246,0.02));
          border-bottom: 1px solid rgba(96,165,250,0.12);
          position: relative; z-index: 10;
        }

        .card-body { padding: 22px 20px; position: relative; z-index: 10; }

        .sec-label {
          font-size: 10px; font-weight: 600; letter-spacing: 1.5px;
          color: rgba(96,165,250,0.55);
          text-transform: uppercase; margin-bottom: 12px;
        }

        .divider {
          height: 1px; margin: 20px 0;
          background: linear-gradient(90deg, rgba(96,165,250,0.2), transparent);
        }

        /* Slider */
        .oil-slider {
          -webkit-appearance: none; appearance: none;
          width: 100%; height: 26px; background: transparent;
          outline: none; cursor: pointer; position: relative; z-index: 5;
        }
        .oil-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px; height: 18px;
          background: #3b82f6;
          border: 2px solid rgba(255,255,255,0.25); border-radius: 50%;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.22), 0 0 14px rgba(59,130,246,0.6);
          cursor: grab; transition: box-shadow 0.2s, transform 0.15s;
        }
        .oil-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 0 0 6px rgba(59,130,246,0.15), 0 0 22px rgba(59,130,246,0.8);
        }
        .oil-slider::-moz-range-thumb {
          width: 18px; height: 18px; background: #3b82f6;
          border: 2px solid rgba(255,255,255,0.25); border-radius: 50%; cursor: grab;
        }

        /* Metric card */
        .met-card {
          padding: 16px 14px;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px; position: relative; overflow: hidden;
        }
        .met-label { font-size: 10px; font-weight: 500; letter-spacing: 0.8px; color: rgba(255,255,255,0.38); margin-bottom: 6px; }
        .met-value { font-size: 30px; font-weight: 700; line-height: 1; }
        .met-delta { margin-top: 8px; font-size: 11px; font-weight: 500; }

        /* Run button */
        .run-btn {
          width: 100%; padding: 15px;
          background: linear-gradient(135deg, rgba(59,130,246,0.18), rgba(37,99,235,0.1));
          border: 1px solid rgba(96,165,250,0.35);
          border-radius: 10px; cursor: pointer; position: relative; overflow: hidden;
          font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600;
          letter-spacing: 0.5px; color: #93c5fd;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: border-color 0.3s, box-shadow 0.3s, background 0.3s;
        }
        .run-btn:not(:disabled):hover {
          border-color: #60a5fa;
          background: linear-gradient(135deg, rgba(59,130,246,0.28), rgba(37,99,235,0.18));
          box-shadow: 0 0 28px rgba(59,130,246,0.22), inset 0 0 28px rgba(59,130,246,0.07);
        }
        .run-btn:disabled { opacity: 0.45; cursor: wait; }
        .run-btn::before {
          content: ''; position: absolute; top: 0; left: -120%; width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(96,165,250,0.1), transparent);
          animation: sweep 2.4s linear infinite;
        }
        @keyframes sweep { to { left: 200%; } }
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.15; } }
        .blink { animation: blink 1s step-end infinite; }
      `}</style>

      <div className="sim-wrap">
        <div className="sim-card">
          {/* bg grid canvas */}
          <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} />

          {/* corner brackets */}
          <div className="cb cb-tl" /><div className="cb cb-tr" />
          <div className="cb cb-bl" /><div className="cb cb-br" />

          {/* ── TOP BAR ── */}
          <div className="top-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <motion.div
                animate={{ opacity: isRunning ? [1, 0.15, 1] : 1 }}
                transition={{ repeat: Infinity, duration: 0.6, ease: 'linear' }}
                style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 10px #3b82f6' }}
              />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#93c5fd', letterSpacing: 0.3 }}>
                Simulation — Cabinet of Five
              </span>
            </div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <span style={{ fontSize: 10, color: 'rgba(96,165,250,0.4)' }}>Oil · Macro · Risk</span>
              <span suppressHydrationWarning style={{ fontSize: 11, color: 'rgba(96,165,250,0.65)', fontVariantNumeric: 'tabular-nums' }}>
                {timeStr}
              </span>
            </div>
          </div>

          {/* ── BODY ── */}
          <div className="card-body">

            {/* OIL SHOCK */}
            <div className="sec-label">Oil Price Shock</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)' }}>Global Supply Delta</span>
              <motion.span
                key={oilChange}
                initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.15 }}
                style={{
                  fontSize: 34, fontWeight: 700, letterSpacing: -1,
                  color: shockColor, textShadow: `0 0 18px ${shockColor}80`,
                }}
              >
                {oilChange > 0 ? '+' : ''}{oilChange}%
              </motion.span>
            </div>

            {/* Slider */}
            <div style={{ position: 'relative', marginBottom: 8 }}>
              <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', transform: 'translateY(-50%)', height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 2 }}>
                {/* zero-line marker */}
                <div style={{ position: 'absolute', left: '33.33%', top: -5, width: 1, height: 13, background: 'rgba(255,255,255,0.18)' }} />
                {/* live fill */}
                <div style={{
                  position: 'absolute',
                  left: oilChange >= 0 ? '33.33%' : `${((oilChange + 20) / 60) * 100}%`,
                  width: `${(Math.abs(oilChange) / 60) * 100}%`,
                  height: '100%', borderRadius: 2,
                  background: shockColor,
                  boxShadow: `0 0 8px ${shockColor}`,
                  transition: 'background 0.3s, box-shadow 0.3s',
                }} />
              </div>
              <input type="range" min="-20" max="40" step="5" value={oilChange}
                onChange={e => setOilChange(Number(e.target.value))}
                className="oil-slider" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(255,255,255,0.22)', marginBottom: 18 }}>
              <span>−20% Drop</span>
              <span style={{ color: 'rgba(255,255,255,0.38)' }}>● Baseline</span>
              <span>+40% Shock</span>
            </div>

            {/* THREAT BAR */}
            <ThreatBar risk={projRisk} />

            <div className="divider" />

            {/* PROJECTED READOUTS */}
            <div className="sec-label">Projected State</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>

              {/* Inflation card */}
              <div className="met-card" style={{ borderTop: `2px solid ${projInflation > currentInflation ? '#f87171' : '#34d399'}` }}>
                <div style={{
                  position: 'absolute', top: 0, right: 0, width: '55%', height: '100%',
                  background: `radial-gradient(ellipse at top right, ${projInflation > currentInflation ? '#f87171' : '#34d399'}10, transparent 70%)`,
                  pointerEvents: 'none',
                }} />
                <div className="met-label">Inflation · India</div>
                <motion.div className="met-value" style={{
                  color: projInflation > 7 ? '#f87171' : '#34d399',
                  textShadow: `0 0 16px ${projInflation > 7 ? '#f87171' : '#34d399'}55`,
                }}>
                  {inflTicker}
                </motion.div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)', marginTop: 3 }}>% CPI</div>
                {oilChange !== 0 && (
                  <div className="met-delta" style={{ color: projInflation > currentInflation ? '#f87171' : '#34d399' }}>
                    {projInflation > currentInflation ? '▲' : '▼'} {Math.abs((oilChange / 20) * 2).toFixed(1)}% delta
                  </div>
                )}
              </div>

              {/* Risk card */}
              <div className="met-card" style={{ borderTop: `2px solid ${riskColor}` }}>
                <div style={{
                  position: 'absolute', top: 0, right: 0, width: '55%', height: '100%',
                  background: `radial-gradient(ellipse at top right, ${riskColor}10, transparent 70%)`,
                  pointerEvents: 'none',
                }} />
                <div className="met-label">Composite Risk</div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <ArcGauge value={projRisk} color={riskColor} />
                </div>
                {oilChange !== 0 && (
                  <div className="met-delta" style={{ textAlign: 'center', color: projRisk > currentRiskScore ? '#f87171' : '#34d399' }}>
                    {projRisk > currentRiskScore ? '▲' : '▼'} {Math.abs((oilChange / 20) * 10).toFixed(0)} pts
                  </div>
                )}
              </div>
            </div>

            {/* RUN BUTTON */}
            <motion.button className="run-btn" onClick={handleSimulate} disabled={isRunning}
              whileTap={!isRunning ? { scale: 0.985 } : {}}>
              <AnimatePresence mode="wait">
                {isRunning ? (
                  <motion.span key="r" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Loader2 size={15} style={{ animation: 'spin 0.7s linear infinite' }} />
                    Agents Deliberating...
                  </motion.span>
                ) : (
                  <motion.span key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Play size={15} />
                    Run Simulation
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Footer meta */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 10, color: 'rgba(96,165,250,0.3)' }}>
              <span>Cabinet · 5 Agents</span>
              <span className={isRunning ? 'blink' : ''}>{isRunning ? '● Processing' : '○ Ready'}</span>
            </div>
          </div>
        </div>

        {/* Agent Insights */}
        <AgentInsights result={result} />
      </div>
    </>
  );
}