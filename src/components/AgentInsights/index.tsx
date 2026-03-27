'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OrchestratorResult } from '@/agents/orchestrator';
import { X, Bot, AlertTriangle, Info, Zap, Shield, TrendingUp, Cpu, Leaf, Users, Swords } from 'lucide-react';

interface AgentInsightsProps {
  result: OrchestratorResult | null;
}

/* ─── Metadata ─────────────────────────────────────────────────────────────── */
type AgentMeta = {
  Icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  emoji: string;
  accent: string;
  glow: string;
  domains: string[];
  pos: { x: number; y: number }; // % within the left constellation panel
};

const AGENT_META: Record<string, AgentMeta> = {
  'Artha Agent':     { Icon: TrendingUp, emoji: '📈', accent: '#f59e0b', glow: 'rgba(245,158,11,0.3)',  domains: ['Trade','GDP','Inflation','MSMEs'],            pos: { x: 3, y: 2  } },
  'Raksha Agent':    { Icon: Shield,     emoji: '🛡️', accent: '#ef4444', glow: 'rgba(239,68,68,0.3)',   domains: ['Defense','Geopolitics','Border','Cyber'],      pos: { x: 36, y: 8  } },
  'Yantra Agent':    { Icon: Cpu,        emoji: '⚙️', accent: '#38bdf8', glow: 'rgba(56,189,248,0.3)',  domains: ['Semiconductors','AI','Space','Digital Infra'], pos: { x: 70, y: 2  } },
  'Shakti Agent':    { Icon: Leaf,       emoji: '⚡', accent: '#22c55e', glow: 'rgba(34,197,94,0.3)',   domains: ['Energy','Climate','Agri','Water'],             pos: { x: 15, y: 58 } },
  'Samaj Agent':     { Icon: Users,      emoji: '👥', accent: '#f97316', glow: 'rgba(249,115,22,0.3)',  domains: ['Society','Welfare','Industry','Economy'],       pos: { x: 65, y: 58 } },
  'Adversary Review':{ Icon: Swords,     emoji: '⚠️', accent: '#a855f7', glow: 'rgba(168,85,247,0.3)', domains: ['Risk','Critique','Counter-Analysis'],           pos: { x: 50, y: 80 } },
};

const DEFAULT_META = AGENT_META['Artha Agent'];

const SEV = {
  info:     { color: '#38bdf8', Icon: Info,          label: 'INFO'     },
  warning:  { color: '#f59e0b', Icon: AlertTriangle, label: 'ELEVATED' },
  critical: { color: '#ef4444', Icon: Zap,           label: 'CRITICAL' },
} as const;

const OVERALL = {
  info:     { color: '#22c55e', label: 'STABLE'   },
  warning:  { color: '#f59e0b', label: 'MODERATE' },
  critical: { color: '#ef4444', label: 'CRITICAL' },
} as const;

/* ─── Starfield ─────────────────────────────────────────────────────────────── */
function StarField() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d')!;
    let raf: number;
    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.2 + 0.2,
      speed: Math.random() * 0.004 + 0.001,
      phase: Math.random() * Math.PI * 2,
    }));
    const draw = (t: number) => {
      c.width = c.offsetWidth; c.height = c.offsetHeight;
      ctx.clearRect(0, 0, c.width, c.height);
      for (const s of stars) {
        const a = 0.25 + 0.55 * Math.sin(t * s.speed + s.phase);
        ctx.beginPath();
        ctx.arc(s.x * c.width, s.y * c.height, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,210,255,${a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />;
}

/* ─── Agent Card ─────────────────────────────────────────────────────────────── */
function AgentCard({ insight, isExpanded, onClick, index }: {
  insight: { agent: string; severity: string; insight: string };
  isExpanded: boolean;
  onClick: () => void;
  index: number;
}) {
  const meta = AGENT_META[insight.agent] ?? DEFAULT_META;
  const sev  = SEV[insight.severity as keyof typeof SEV] ?? SEV.info;
  const { Icon: AgentIcon } = meta;
  const { Icon: SevIcon }   = sev;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.75 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.08 + 0.1, duration: 0.3, ease: 'easeOut' }}
      onClick={onClick}
      style={{
        position: 'absolute',
        left: `${meta.pos.x}%`,
        top:  `${meta.pos.y}%`,
        transform: 'translate(-50%, 0)',
        width: 185,
        zIndex: 20,
        cursor: 'pointer',
      }}
    >
      {/* halo glow */}
      <div style={{
        position: 'absolute', inset: -12, borderRadius: 20, pointerEvents: 'none',
        background: `radial-gradient(ellipse at 50% 0%, ${meta.glow}, transparent 70%)`,
        opacity: isExpanded ? 1 : 0.5, transition: 'opacity 0.3s',
      }} />

      <div style={{
        position: 'relative', borderRadius: 12, overflow: 'hidden',
        background: 'linear-gradient(145deg, rgba(8,18,42,0.98), rgba(4,11,26,0.99))',
        border: `1px solid ${meta.accent}55`,
        borderTop: `2px solid ${meta.accent}dd`,
        boxShadow: `0 6px 24px rgba(0,0,0,0.7), 0 0 0 1px ${meta.accent}14, inset 0 1px 0 ${meta.accent}22`,
      }}>
        <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${meta.accent}99, transparent)` }} />
        <div style={{ padding: '10px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
            <div style={{
              width: 24, height: 24, borderRadius: 7, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: `${meta.accent}22`, border: `1px solid ${meta.accent}44`,
              boxShadow: `0 0 9px ${meta.accent}44`,
            }}>
              <AgentIcon size={12} color={meta.accent} strokeWidth={2} />
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, color: meta.accent, fontFamily: 'IBM Plex Mono, monospace', letterSpacing: 0.5, flex: 1, minWidth: 0 }}>
              {insight.agent}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, padding: '2px 5px', borderRadius: 4, background: `${sev.color}18`, border: `1px solid ${sev.color}33`, flexShrink: 0 }}>
              <SevIcon size={7} color={sev.color} />
              <span style={{ fontSize: 7, color: sev.color, fontFamily: 'IBM Plex Mono, monospace', letterSpacing: 0.8 }}>{sev.label}</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 6 }}>
            {meta.domains.map(d => (
              <span key={d} style={{
                fontSize: 7, padding: '2px 5px', borderRadius: 4,
                background: `${meta.accent}14`, color: `${meta.accent}cc`,
                border: `1px solid ${meta.accent}28`, fontFamily: 'IBM Plex Mono, monospace',
              }}>{d}</span>
            ))}
          </div>

          <p style={{
            fontSize: 10, lineHeight: 1.55, color: 'rgba(200,220,252,0.85)',
            margin: 0, whiteSpace: 'pre-line',
            display: '-webkit-box',
            WebkitLineClamp: isExpanded ? 999 : 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {insight.insight}
          </p>

          {!isExpanded && (
            <div style={{ marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${meta.accent}44)` }} />
              <span style={{ fontSize: 7, color: `${meta.accent}88`, fontFamily: 'IBM Plex Mono, monospace' }}>expand ↗</span>
            </div>
          )}
        </div>
        <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${meta.accent}44, transparent)` }} />
      </div>
    </motion.div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────────── */
export function AgentInsights({ result }: AgentInsightsProps) {
  const [open, setOpen]         = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [pos, setPos]           = useState({ x: 0, y: 0 });
  const dragRef                 = useRef<{ ox: number; oy: number } | null>(null);

  useEffect(() => { if (result) { setOpen(true); setExpanded(null); } }, [result]);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    dragRef.current = { ox: e.clientX - pos.x, oy: e.clientY - pos.y };
    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      setPos({ x: ev.clientX - dragRef.current.ox, y: ev.clientY - dragRef.current.oy });
    };
    const onUp = () => {
      dragRef.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  if (!result) return null;

  const sev    = result.overallSeverity as keyof typeof OVERALL;
  const cfg    = OVERALL[sev] ?? OVERALL.info;
  const main   = result.insights.slice(0, 5);
  const extras = result.insights.slice(5);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 900, background: 'rgba(0,3,12,0.83)', backdropFilter: 'blur(5px)' }}
          />

          {/* Floating window */}
          <motion.div
            key="window"
            initial={{ opacity: 0, scale: 0.84, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 24 }}
            transition={{ type: 'spring', stiffness: 270, damping: 26 }}
            style={{
              position: 'fixed',
              top:  `calc(50% + ${pos.y}px)`,
              left: `calc(50% + ${pos.x}px)`,
              transform: 'translate(-50%, -50%)',
              zIndex: 1000,
              width:  'min(96vw, 1020px)',
              height: 'min(90vh, 720px)',
              borderRadius: 16,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              background: 'radial-gradient(ellipse at 50% 0%, rgba(14,26,54,0.99) 0%, rgba(3,7,18,0.99) 65%)',
              border: `1px solid ${cfg.color}33`,
              boxShadow: `0 0 0 1px ${cfg.color}18, 0 0 90px ${cfg.color}14, 0 50px 120px rgba(0,0,0,0.95)`,
              fontFamily: "'IBM Plex Sans', sans-serif",
            }}
          >
            {/* Background layers */}
            <StarField />
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
              <div style={{ position:'absolute', top:'4%', left:'5%', width:360, height:300, borderRadius:'50%', background:`radial-gradient(ellipse, ${cfg.color}16, transparent 70%)`, filter:'blur(40px)' }} />
              <div style={{ position:'absolute', top:'15%', right:'4%', width:300, height:260, borderRadius:'50%', background:'radial-gradient(ellipse, rgba(59,130,246,0.10), transparent 70%)', filter:'blur(35px)' }} />
              <div style={{ position:'absolute', bottom:'8%', left:'30%', width:280, height:200, borderRadius:'50%', background:'radial-gradient(ellipse, rgba(168,85,247,0.08), transparent 70%)', filter:'blur(30px)' }} />
            </div>

            {/* Corner brackets */}
            {(['tl','tr','bl','br'] as const).map(c => (
              <div key={c} style={{
                position:'absolute', width:18, height:18, zIndex:30, pointerEvents:'none',
                top:    c[0]==='t' ? -1 : 'auto', bottom: c[0]==='b' ? -1 : 'auto',
                left:   c[1]==='l' ? -1 : 'auto', right:  c[1]==='r' ? -1 : 'auto',
                borderTop:    c[0]==='t' ? `2px solid ${cfg.color}` : 'none',
                borderBottom: c[0]==='b' ? `2px solid ${cfg.color}` : 'none',
                borderLeft:   c[1]==='l' ? `2px solid ${cfg.color}` : 'none',
                borderRight:  c[1]==='r' ? `2px solid ${cfg.color}` : 'none',
                borderRadius: c==='tl'?'5px 0 0 0':c==='tr'?'0 5px 0 0':c==='bl'?'0 0 0 5px':'0 0 5px 0',
              }} />
            ))}

            {/* ── Title bar ── */}
            <div
              onMouseDown={onMouseDown}
              style={{
                position:'relative', zIndex:30, flexShrink:0,
                display:'flex', alignItems:'center', justifyContent:'space-between',
                padding:'10px 18px',
                background:`linear-gradient(90deg, ${cfg.color}14, rgba(4,10,26,0.5))`,
                borderBottom:`1px solid ${cfg.color}22`,
                cursor:'grab', userSelect:'none',
              }}
            >
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <motion.div
                  animate={{ opacity:[1,0.2,1], scale:[1,1.3,1] }}
                  transition={{ duration:2, repeat:Infinity }}
                  style={{ width:9, height:9, borderRadius:'50%', background:cfg.color, boxShadow:`0 0 10px ${cfg.color}` }}
                />
                <span style={{ fontSize:13, fontWeight:700, color:'#e6f0ff', letterSpacing:0.4 }}>
                  Simulation Analysis Complete
                </span>
                <div style={{
                  fontSize:9, fontWeight:700, letterSpacing:2, padding:'2px 9px',
                  borderRadius:20, background:`${cfg.color}18`, color:cfg.color,
                  border:`1px solid ${cfg.color}44`, fontFamily:'IBM Plex Mono, monospace',
                }}>
                  {cfg.label}
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <span style={{ fontSize:10, color:'rgba(120,160,220,0.45)', fontFamily:'IBM Plex Mono, monospace', letterSpacing:2 }}>
                  CABINET OF FIVE
                </span>
                <button
                  onClick={e => { e.stopPropagation(); setOpen(false); }}
                  style={{
                    width:24, height:24, borderRadius:'50%',
                    border:'1px solid rgba(239,68,68,0.4)',
                    background:'rgba(239,68,68,0.12)', color:'#ef4444',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    cursor:'pointer', flexShrink:0,
                  }}
                >
                  <X size={13} />
                </button>
              </div>
            </div>

            {/* Subtitle */}
            <div style={{ position:'relative', zIndex:10, textAlign:'center', padding:'8px 20px 0', flexShrink:0 }}>
              <p style={{ fontSize:9, color:'rgba(130,170,230,0.4)', letterSpacing:2.5, fontFamily:'IBM Plex Mono, monospace', margin:0 }}>
                CABINET OF FIVE AGENTS HAVE ANALYZED THE SCENARIO
              </p>
            </div>

            {/* ── Two-panel body ── */}
            <div style={{ position:'relative', zIndex:10, flex:1, minHeight:0, display:'flex', flexDirection:'row' }}>

              {/* ── LEFT: Agent Constellation (60%) ── */}
              <div style={{ position:'relative', flex:'0 0 60%', minHeight:0 }}>
                {/* SVG connector lines */}
                <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:5 }}>
                  {main.map((ins, i) => {
                    const m = AGENT_META[ins.agent] ?? DEFAULT_META;
                    const isActive = !expanded || expanded === ins.agent;
                    const cardMidY = m.pos.y + 8;
                    return (
                      <motion.line
                        key={ins.agent}
                        x1="50%" y1="46%"
                        x2={`${m.pos.x}%`} y2={`${cardMidY}%`}
                        stroke={m.accent}
                        strokeWidth={expanded === ins.agent ? 1.8 : 1}
                        strokeOpacity={isActive ? (expanded===ins.agent ? 0.7 : 0.3) : 0.05}
                        strokeDasharray="5 5"
                        initial={{ pathLength:0, opacity:0 }}
                        animate={{ pathLength:1, opacity:1 }}
                        transition={{ delay: i * 0.09 + 0.2, duration: 0.5 }}
                      />
                    );
                  })}
                </svg>

                {/* Central node */}
                <div style={{ position:'absolute', left:'50%', top:'55%', transform:'translate(-50%,-50%)', zIndex:10 }}>
                  {[1,2,3].map(i => (
                    <motion.div key={i} style={{
                      position:'absolute', inset:-(i*14),
                      borderRadius:'50%', border:`1px solid ${cfg.color}44`,
                    }}
                      animate={{ scale:[1,1.14,1], opacity:[0.5,0,0.5] }}
                      transition={{ duration:2.5, delay:i*0.55, repeat:Infinity }}
                    />
                  ))}
                  <div style={{
                    width:50, height:50, borderRadius:'50%',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    background:`radial-gradient(circle at 35% 35%, ${cfg.color}44, rgba(4,10,24,0.96) 70%)`,
                    border:`2px solid ${cfg.color}88`,
                    boxShadow:`0 0 28px ${cfg.color}66, 0 0 55px ${cfg.color}28, inset 0 1px 0 ${cfg.color}33`,
                  }}>
                    <Bot size={20} color={cfg.color} strokeWidth={1.5} />
                  </div>
                </div>

                {/* 5 agent cards */}
                {main.map((ins, i) => (
                  <AgentCard
                    key={ins.agent}
                    insight={ins}
                    isExpanded={expanded === ins.agent}
                    onClick={() => setExpanded(expanded === ins.agent ? null : ins.agent)}
                    index={i}
                  />
                ))}
              </div>

              {/* Vertical divider */}
              <div style={{
                flexShrink:0, width:1, margin:'10px 0',
                background:`linear-gradient(180deg, transparent, ${cfg.color}55 20%, ${cfg.color}55 80%, transparent)`,
              }} />

              {/* ── RIGHT: Sutra + Adversary Review (40%) ── */}
              <div style={{
                flex:1, minWidth:0, overflowY:'auto',
                padding:'14px 14px 14px 16px',
                display:'flex', flexDirection:'column', gap:12,
              }}>

                {/* Sutra — Executive Summary */}
                <motion.div
                  initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.5 }}
                  style={{
                    borderRadius:12, overflow:'hidden',
                    background:'linear-gradient(135deg, rgba(8,18,42,0.97), rgba(4,11,26,0.98))',
                    border:`1px solid ${cfg.color}33`,
                    borderLeft:`3px solid ${cfg.color}`,
                    position:'relative', flexShrink:0,
                  }}
                >
                  <div style={{ position:'absolute', inset:0, pointerEvents:'none', background:`radial-gradient(ellipse at 0% 40%, ${cfg.color}0d, transparent 60%)` }} />
                  <div style={{ padding:'12px 14px', position:'relative' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8 }}>
                      <div style={{ width:7, height:7, borderRadius:'50%', flexShrink:0, background:cfg.color, boxShadow:`0 0 7px ${cfg.color}` }} />
                      <span style={{ fontSize:10, fontWeight:700, color:cfg.color, fontFamily:'IBM Plex Mono, monospace', letterSpacing:1.5 }}>
                        SUTRA — EXECUTIVE SUMMARY
                      </span>
                      <span style={{
                        marginLeft:'auto', flexShrink:0,
                        fontSize:8, fontWeight:700, letterSpacing:1.5, padding:'2px 7px',
                        borderRadius:20, background:`${cfg.color}18`, color:cfg.color,
                        border:`1px solid ${cfg.color}44`, fontFamily:'IBM Plex Mono, monospace',
                      }}>
                        {cfg.label}
                      </span>
                    </div>
                    <p style={{ margin:0, fontSize:11, lineHeight:1.7, color:'rgba(210,228,255,0.9)' }}>
                      {result.executiveSummary}
                    </p>
                  </div>
                </motion.div>

                {/* Adversary Review + any extra agents */}
                {extras.map((ins, i) => {
                  const m = AGENT_META[ins.agent] ?? AGENT_META['Adversary Review'];
                  const s = SEV[ins.severity as keyof typeof SEV] ?? SEV.warning;
                  const { Icon: SevIcon } = s;
                  return (
                    <motion.div
                      key={ins.agent}
                      initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.65 + i*0.1 }}
                      style={{
                        borderRadius:12, overflow:'hidden', flexShrink:0,
                        background:'linear-gradient(135deg, rgba(8,18,42,0.97), rgba(4,11,26,0.98))',
                        border:`1px solid ${m.accent}44`,
                        borderLeft:`3px solid ${m.accent}`,
                      }}
                    >
                      <div style={{ padding:'12px 14px' }}>
                        <div style={{ display:'flex', alignItems:'center', flexWrap:'wrap', gap:5, marginBottom:7 }}>
                          <span style={{ fontSize:13 }}>{m.emoji}</span>
                          <span style={{ fontSize:10, fontWeight:700, color:m.accent, fontFamily:'IBM Plex Mono, monospace' }}>{ins.agent}</span>
                          <div style={{ display:'flex', alignItems:'center', gap:3, padding:'2px 5px', borderRadius:5, background:`${s.color}18`, border:`1px solid ${s.color}33` }}>
                            <SevIcon size={8} color={s.color} />
                            <span style={{ fontSize:8, color:s.color, fontFamily:'IBM Plex Mono, monospace' }}>{s.label}</span>
                          </div>
                        </div>
                        <div style={{ display:'flex', flexWrap:'wrap', gap:3, marginBottom:8 }}>
                          {m.domains.map(d => (
                            <span key={d} style={{ fontSize:8, padding:'2px 5px', borderRadius:4, background:`${m.accent}14`, color:`${m.accent}cc`, border:`1px solid ${m.accent}28`, fontFamily:'IBM Plex Mono, monospace' }}>{d}</span>
                          ))}
                        </div>
                        <p style={{ margin:0, fontSize:11, lineHeight:1.65, color:'rgba(200,220,252,0.88)' }}>{ins.insight}</p>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Footer */}
                <div style={{
                  marginTop:'auto', paddingTop:8,
                  display:'flex', alignItems:'center', justifyContent:'space-between',
                  fontSize:9, color:'rgba(90,130,200,0.32)',
                  fontFamily:'IBM Plex Mono, monospace', letterSpacing:1.5,
                }}>
                  <span>CABINET · 5 AGENTS · INDIA INTEL GRAPH</span>
                  <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                    <div style={{ width:5, height:5, borderRadius:'50%', background:cfg.color, boxShadow:`0 0 5px ${cfg.color}` }} />
                    <span style={{ color:`${cfg.color}77` }}>COMPLETE</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}