'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { Play, Loader2, AlertTriangle, Shield, Flame, Zap } from 'lucide-react';
import { OrchestratorResult } from '@/agents/orchestrator';
import { AgentInsights } from '@/components/AgentInsights';

interface SimulationPanelProps {
  onSimulate: (oilChange: number, newRisk: number, newInflation: number) => void;
  currentRiskScore: number;
  currentInflation: number;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function useTicker(target: number, decimals = 1) {
  const spring = useSpring(target, { stiffness: 120, damping: 20 });
  useEffect(() => { spring.set(target); }, [target, spring]);
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
        style={{ fontSize: 21, fontWeight: 700, fontFamily: 'IBM Plex Mono, monospace' }}>
        {Math.round(value)}
      </text>
      <text x={cx} y={cy + 13} textAnchor="middle" fill="rgba(255,255,255,0.25)"
        style={{ fontSize: 10, fontFamily: 'IBM Plex Mono, monospace' }}>/ 100</text>
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
              }} />
          );
        })}
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, color, minWidth: 56, textAlign: 'right' }}>{level}</span>
    </div>
  );
}

/* ── Slider config ── */
interface SliderConfig {
  key: string;
  label: string;
  sublabel: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  default: number;
  baselineAt: number; // value that counts as "neutral"
  negLabel: string;
  posLabel: string;
  accentPos: string; // color when positive/bad
  accentNeg: string; // color when negative/good
  accentNeutral: string;
  icon: string;
}

const SLIDERS: SliderConfig[] = [
  {
    key: 'oil',
    label: 'Oil Price Shock',
    sublabel: 'Global Supply Delta',
    unit: '%',
    min: -20, max: 40, step: 5, default: 0, baselineAt: 0,
    negLabel: '−20% Drop', posLabel: '+40% Shock',
    accentPos: '#f87171', accentNeg: '#34d399', accentNeutral: '#475569',
    icon: '⛽',
  },
  {
    key: 'rate',
    label: 'Interest Rate Δ',
    sublabel: 'Central Bank Policy',
    unit: ' bps',
    min: -100, max: 200, step: 25, default: 0, baselineAt: 0,
    negLabel: '−100 bps Cut', posLabel: '+200 bps Hike',
    accentPos: '#60a5fa', accentNeg: '#34d399', accentNeutral: '#475569',
    icon: '🏦',
  },
  {
    key: 'geopolitical',
    label: 'Geopolitical Tension',
    sublabel: 'Conflict Risk Index',
    unit: '/100',
    min: 0, max: 100, step: 5, default: 30, baselineAt: 30,
    negLabel: 'Stable (0)', posLabel: 'War Risk (100)',
    accentPos: '#f59e0b', accentNeg: '#34d399', accentNeutral: '#64748b',
    icon: '⚔️',
  },
  {
    key: 'currency',
    label: 'Currency Depreciation',
    sublabel: 'INR vs USD (YoY)',
    unit: '%',
    min: -5, max: 20, step: 1, default: 0, baselineAt: 0,
    negLabel: '−5% (Appreciation)', posLabel: '+20% (Crash)',
    accentPos: '#a78bfa', accentNeg: '#34d399', accentNeutral: '#475569',
    icon: '₹',
  },
];

function getSliderColor(cfg: SliderConfig, val: number): string {
  const delta = val - cfg.baselineAt;
  if (Math.abs(delta) < cfg.step * 0.5) return cfg.accentNeutral;
  return delta > 0 ? cfg.accentPos : cfg.accentNeg;
}

/* ── Single Slider Card ── */
function SliderCard({
  cfg, value, onChange,
}: { cfg: SliderConfig; value: number; onChange: (v: number) => void }) {
  const color = getSliderColor(cfg, value);
  const range = cfg.max - cfg.min;
  const pct = ((value - cfg.min) / range) * 100;
  const basePct = ((cfg.baselineAt - cfg.min) / range) * 100;
  const fillLeft = Math.min(pct, basePct);
  const fillWidth = Math.abs(pct - basePct);
  const displayVal = `${value > cfg.baselineAt && cfg.min < 0 ? '+' : ''}${value}${cfg.unit}`;

  return (
    <div style={{
      background: 'rgba(255,255,255,0.025)',
      border: `1px solid ${color}28`,
      borderTop: `2px solid ${color}88`,
      borderRadius: 10,
      padding: '14px 14px 12px',
      display: 'flex', flexDirection: 'column', gap: 8,
      position: 'relative', overflow: 'hidden',
      transition: 'border-color 0.3s',
    }}>
      {/* bg glow */}
      <div style={{
        position: 'absolute', top: 0, right: 0, width: '60%', height: '100%',
        background: `radial-gradient(ellipse at top right, ${color}0d, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <span style={{ fontSize: 13 }}>{cfg.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1.2, color: `${color}bb`, textTransform: 'uppercase' }}>
              {cfg.label}
            </span>
          </div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: 0.5 }}>{cfg.sublabel}</div>
        </div>
        <motion.div
          key={value}
          initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.13 }}
          style={{
            fontSize: 22, fontWeight: 700, letterSpacing: -0.5,
            color, textShadow: `0 0 14px ${color}70`,
            fontFamily: 'IBM Plex Mono, monospace',
          }}
        >
          {displayVal}
        </motion.div>
      </div>

      {/* Track */}
      <div style={{ position: 'relative', height: 26 }}>
        <div style={{
          position: 'absolute', left: 0, right: 0, top: '50%', transform: 'translateY(-50%)',
          height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 2,
        }}>
          {/* baseline tick */}
          <div style={{
            position: 'absolute', left: `${basePct}%`, top: -5,
            width: 1, height: 13, background: 'rgba(255,255,255,0.2)',
          }} />
          {/* fill */}
          <div style={{
            position: 'absolute',
            left: `${fillLeft}%`, width: `${fillWidth}%`,
            height: '100%', borderRadius: 2,
            background: color, boxShadow: `0 0 7px ${color}`,
            transition: 'background 0.3s, box-shadow 0.3s, left 0.05s, width 0.05s',
          }} />
        </div>
        <input
          type="range" min={cfg.min} max={cfg.max} step={cfg.step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="sim-slider"
          style={{ ['--thumb-color' as string]: color } as React.CSSProperties}
        />
      </div>

      {/* Labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>
        <span>{cfg.negLabel}</span>
        <span>{cfg.posLabel}</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════ */
export function SimulationPanel({ onSimulate, currentRiskScore, currentInflation }: SimulationPanelProps) {
  const [values, setValues] = useState<Record<string, number>>({
    oil: 0, rate: 0, geopolitical: 30, currency: 0,
  });
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<OrchestratorResult | null>(null);
  const [hasRun, setHasRun] = useState(false);
  const [, forceUpdate] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { oil, rate, geopolitical, currency } = values;

  // Compound projections from all 4 variables
  const projInflation = currentInflation
    + (oil / 20) * 2
    + (rate / 100) * -0.8      // rate hike suppresses inflation
    + (currency / 10) * 1.5;  // depreciation feeds inflation
  const projRisk = clamp(
    currentRiskScore
    + (oil / 20) * 10
    + (rate / 100) * 4
    + (geopolitical / 100) * 25
    + (currency / 20) * 8,
    0, 100,
  );

  const inflTicker = useTicker(projInflation, 1);
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

  const handleChange = (key: string, val: number) => {
    setValues(prev => ({ ...prev, [key]: val }));
  };

  const buildAgentQuery = () => `
You are analyzing a macroeconomic scenario for India with the following inputs:

1. Oil Price Shock: ${oil > 0 ? '+' : ''}${oil}% change in global crude prices
2. Interest Rate Change: ${rate > 0 ? '+' : ''}${rate} bps central bank policy shift
3. Geopolitical Tension Index: ${geopolitical}/100 (current conflict/risk level)
4. INR Depreciation (vs USD): ${currency > 0 ? '+' : ''}${currency}% year-over-year

Projected outcomes from these combined inputs:
- Projected CPI Inflation (India): ${projInflation.toFixed(1)}%
- Projected Composite Risk Score: ${Math.round(projRisk)}/100

Analyze the cascading macroeconomic effects, trade implications, fiscal pressure, 
and recommend policy responses. Consider second-order effects and interactions between these variables.
  `.trim();

  const handleSimulate = async () => {
    setIsRunning(true);
    setResult(null);
    try {
      const res = await fetch('https://juicy25-intelgraph-agents.hf.space/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: buildAgentQuery(), task_type: 'Goal' }),
      });
      const json = await res.json();

      // Map HF API response → OrchestratorResult for AgentInsights
      const AGENT_MAP: Array<{ key: string; name: string; domain: string }> = [
        { key: 'artha',  name: 'Artha Agent',  domain: 'Economics · Fiscal Policy' },
        { key: 'raksha', name: 'Raksha Agent', domain: 'Security · Geopolitics' },
        { key: 'yantra', name: 'Yantra Agent', domain: 'Technology · Infrastructure' },
        { key: 'shakti', name: 'Shakti Agent', domain: 'Energy · Resources' },
        { key: 'samaj',  name: 'Samaj Agent',  domain: 'Social · Demographics' },
      ];

      const insights = AGENT_MAP.map(({ key, name, domain }) => {
        const logs: string[] = json.thinking_logs?.[key] ?? [];
        const text = logs.join(' ');
        const severity: 'info' | 'warning' | 'critical' =
          /critical|war|sanction|crisis|collapse/i.test(text) ? 'critical' :
          /risk|concern|pressure|elevated|tension/i.test(text) ? 'warning' : 'info';
        return { agent: name, domain, insight: logs.join('\n') || 'No analysis returned.', severity };
      });

      const severityOrder = { info: 0, warning: 1, critical: 2 };
      const overallSeverity = insights.reduce<'info' | 'warning' | 'critical'>(
        (worst, cur) => severityOrder[cur.severity] > severityOrder[worst] ? cur.severity : worst,
        'info'
      );

      const mapped: OrchestratorResult = {
        insights,
        executiveSummary: json.final_report ?? 'No executive report returned.',
        overallSeverity,
      };

      // Attach adversary critique as an extra insight if present
      if (json.adversary_critique) {
        mapped.insights.push({
          agent: 'Adversary Review',
          domain: 'Risk · Critique',
          insight: json.adversary_critique,
          severity: 'warning',
        });
      }

      setResult(mapped);
      onSimulate(oil, projRisk, projInflation);
      setHasRun(true);
    } catch (err) {
      console.error('Agent API error:', err);
      setResult({
        insights: [],
        executiveSummary: '⚠️ Failed to reach the Cabinet of Five agents. Please check your connection and try again.',
        overallSeverity: 'warning',
      });
    } finally {
      setIsRunning(false);
    }
  };

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  // Active variable count (non-baseline)
  const activeCount = SLIDERS.filter(s => Math.abs(values[s.key] - s.baselineAt) >= s.step * 0.5).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');

        .sim-wrap {
          font-family: 'IBM Plex Sans', sans-serif;
          display: flex; flex-direction: column; gap: 16px;
        }
        .sim-card {
          position: relative; overflow: hidden;
          background: #060c14;
          border: 1px solid rgba(96,165,250,0.16);
          border-radius: 14px;
          box-shadow:
            0 0 0 1px rgba(96,165,250,0.04) inset,
            0 0 60px rgba(59,130,246,0.08),
            0 32px 64px rgba(0,0,0,0.85);
        }
        .sim-card::after {
          content: '';
          position: absolute; inset: 0; pointer-events: none; z-index: 100;
          background: repeating-linear-gradient(
            0deg, transparent, transparent 3px,
            rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px
          );
        }
        .cb { position: absolute; width: 16px; height: 16px; z-index: 20; }
        .cb-tl { top:-1px;left:-1px;   border-top:2px solid #3b82f6;border-left:2px solid #3b82f6;border-radius:4px 0 0 0; }
        .cb-tr { top:-1px;right:-1px;  border-top:2px solid #3b82f6;border-right:2px solid #3b82f6;border-radius:0 4px 0 0; }
        .cb-bl { bottom:-1px;left:-1px;  border-bottom:2px solid #3b82f6;border-left:2px solid #3b82f6;border-radius:0 0 0 4px; }
        .cb-br { bottom:-1px;right:-1px; border-bottom:2px solid #3b82f6;border-right:2px solid #3b82f6;border-radius:0 0 4px 0; }
        .top-bar {
          display:flex;align-items:center;justify-content:space-between;
          padding:12px 20px;
          background:linear-gradient(90deg,rgba(59,130,246,0.1),rgba(59,130,246,0.02));
          border-bottom:1px solid rgba(96,165,250,0.12);
          position:relative;z-index:10;
        }
        .card-body { padding:20px;position:relative;z-index:10; }
        .sec-label {
          font-size:10px;font-weight:600;letter-spacing:1.5px;
          color:rgba(96,165,250,0.55);text-transform:uppercase;margin-bottom:12px;
          font-family:'IBM Plex Mono',monospace;
        }
        .divider { height:1px;margin:18px 0;background:linear-gradient(90deg,rgba(96,165,250,0.2),transparent); }

        /* Sliders */
        .sim-slider {
          -webkit-appearance:none;appearance:none;
          width:100%;height:26px;background:transparent;
          outline:none;cursor:pointer;position:relative;z-index:5;
        }
        .sim-slider::-webkit-slider-thumb {
          -webkit-appearance:none;
          width:16px;height:16px;
          background:var(--thumb-color,#3b82f6);
          border:2px solid rgba(255,255,255,0.2);border-radius:50%;
          box-shadow:0 0 0 3px color-mix(in srgb,var(--thumb-color,#3b82f6) 20%,transparent),0 0 12px var(--thumb-color,#3b82f6);
          cursor:grab;transition:transform 0.15s,box-shadow 0.2s;
        }
        .sim-slider::-webkit-slider-thumb:hover {
          transform:scale(1.25);
          box-shadow:0 0 0 6px color-mix(in srgb,var(--thumb-color,#3b82f6) 12%,transparent),0 0 20px var(--thumb-color,#3b82f6);
        }
        .sim-slider::-moz-range-thumb {
          width:16px;height:16px;background:var(--thumb-color,#3b82f6);
          border:2px solid rgba(255,255,255,0.2);border-radius:50%;cursor:grab;
        }

        /* Metric card */
        .met-card {
          padding:16px 14px;
          background:rgba(255,255,255,0.025);
          border:1px solid rgba(255,255,255,0.07);
          border-radius:10px;position:relative;overflow:hidden;
        }
        .met-label { font-size:10px;font-weight:500;letter-spacing:0.8px;color:rgba(255,255,255,0.38);margin-bottom:6px; }
        .met-value { font-size:30px;font-weight:700;line-height:1;font-family:'IBM Plex Mono',monospace; }
        .met-delta { margin-top:8px;font-size:11px;font-weight:500; }

        /* Run button */
        .run-btn {
          width:100%;padding:15px;
          background:linear-gradient(135deg,rgba(59,130,246,0.18),rgba(37,99,235,0.1));
          border:1px solid rgba(96,165,250,0.35);
          border-radius:10px;cursor:pointer;position:relative;overflow:hidden;
          font-family:'IBM Plex Sans',sans-serif;font-size:13px;font-weight:600;
          letter-spacing:0.5px;color:#93c5fd;
          display:flex;align-items:center;justify-content:center;gap:8px;
          transition:border-color 0.3s,box-shadow 0.3s,background 0.3s;
        }
        .run-btn:not(:disabled):hover {
          border-color:#60a5fa;
          background:linear-gradient(135deg,rgba(59,130,246,0.28),rgba(37,99,235,0.18));
          box-shadow:0 0 28px rgba(59,130,246,0.22),inset 0 0 28px rgba(59,130,246,0.07);
        }
        .run-btn:disabled { opacity:0.45;cursor:wait; }
        .run-btn::before {
          content:'';position:absolute;top:0;left:-120%;width:60%;height:100%;
          background:linear-gradient(90deg,transparent,rgba(96,165,250,0.1),transparent);
          animation:sweep 2.4s linear infinite;
        }
        @keyframes sweep { to { left:200%; } }
        @keyframes spin  { to { transform:rotate(360deg); } }
        @keyframes blink { 0%,100%{opacity:1}50%{opacity:0.15} }
        .blink { animation:blink 1s step-end infinite; }

        /* Query preview */
        .query-preview {
          background:rgba(0,0,0,0.4);
          border:1px solid rgba(96,165,250,0.12);
          border-radius:8px;
          padding:12px 14px;
          font-family:'IBM Plex Mono',monospace;
          font-size:9.5px;
          color:rgba(96,165,250,0.55);
          line-height:1.7;
          white-space:pre-wrap;
          word-break:break-word;
          max-height:130px;
          overflow:hidden;
          position:relative;
        }
        .query-preview::after {
          content:'';position:absolute;bottom:0;left:0;right:0;height:28px;
          background:linear-gradient(transparent,rgba(6,12,20,0.95));
        }
      `}</style>

      <div className="sim-wrap">
        <div className="sim-card">
          <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} />
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
              <span style={{ fontSize: 13, fontWeight: 600, color: '#93c5fd', letterSpacing: 0.3, fontFamily: 'IBM Plex Mono, monospace' }}>
                Simulation — Cabinet of Five
              </span>
            </div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              {activeCount > 0 && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.25)',
                    borderRadius: 20, padding: '2px 8px',
                    fontSize: 10, color: '#60a5fa', fontFamily: 'IBM Plex Mono, monospace',
                  }}>
                  <Zap size={9} />
                  {activeCount} var{activeCount > 1 ? 's' : ''} active
                </motion.div>
              )}
              <span suppressHydrationWarning style={{ fontSize: 11, color: 'rgba(96,165,250,0.6)', fontFamily: 'IBM Plex Mono, monospace' }}>
                {timeStr}
              </span>
            </div>
          </div>

          {/* ── BODY ── */}
          <div className="card-body">

            {/* 2×2 SLIDER GRID */}
            <div className="sec-label">Scenario Variables</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
              {SLIDERS.map(cfg => (
                <SliderCard
                  key={cfg.key}
                  cfg={cfg}
                  value={values[cfg.key]}
                  onChange={v => handleChange(cfg.key, v)}
                />
              ))}
            </div>

            {/* THREAT BAR */}
            <ThreatBar risk={projRisk} />

            <div className="divider" />

            {/* PROJECTED READOUTS */}
            <div className="sec-label">Projected State</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>

              {/* Inflation */}
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
                {(oil !== 0 || rate !== 0 || currency !== 0) && (
                  <div className="met-delta" style={{ color: projInflation > currentInflation ? '#f87171' : '#34d399' }}>
                    {projInflation > currentInflation ? '▲' : '▼'} {Math.abs(projInflation - currentInflation).toFixed(1)}% combined
                  </div>
                )}
              </div>

              {/* Risk gauge */}
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
                {(oil !== 0 || rate !== 0 || geopolitical !== 30 || currency !== 0) && (
                  <div className="met-delta" style={{ textAlign: 'center', color: projRisk > currentRiskScore ? '#f87171' : '#34d399' }}>
                    {projRisk > currentRiskScore ? '▲' : '▼'} {Math.abs(projRisk - currentRiskScore).toFixed(0)} pts combined
                  </div>
                )}
              </div>
            </div>

            {/* AGENT QUERY PREVIEW */}
            <div className="sec-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>Agent Query Preview</span>
              <span style={{ fontSize: 9, color: 'rgba(96,165,250,0.35)', letterSpacing: 0 }}>— sent on Run</span>
            </div>
            <div className="query-preview" style={{ marginBottom: 16 }}>
              {buildAgentQuery()}
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
                    Run Simulation ({activeCount} var{activeCount !== 1 ? 's' : ''})
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 10, color: 'rgba(96,165,250,0.3)', fontFamily: 'IBM Plex Mono, monospace' }}>
              <span>Cabinet · 5 Agents · 4 Variables</span>
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