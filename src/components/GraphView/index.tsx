import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

// ─── Top 8 geopolitical powers (India-centric) ───────────────────────────────
const COUNTRIES = [
  { id: 'INDIA',  name: 'India',   region: 'asia',     color: '#00e5ff' },
  { id: 'USA',    name: 'USA',     region: 'americas', color: '#00c8ff' },
  { id: 'CHINA',  name: 'China',   region: 'asia',     color: '#ff3d3d' },
  { id: 'RUSSIA', name: 'Russia',  region: 'eurasia',  color: '#bf7fff' },
  { id: 'UK',     name: 'UK',      region: 'europe',   color: '#00ff88' },
  { id: 'FRANCE', name: 'France',  region: 'europe',   color: '#00ff88' },
  { id: 'SAUDI',  name: 'Saudi',   region: 'mideast',  color: '#ff8c00' },
  { id: 'JAPAN',  name: 'Japan',   region: 'asia',     color: '#00ffcc' },
];

type RelType = 'trade' | 'alliance' | 'tension' | 'sanction' | 'partnership';

interface Relation {
  from: string;
  to: string;
  type: RelType;
  strength: number;
  label?: string;
}

const RELATIONS: Relation[] = [
  { from: 'USA',   to: 'CHINA',  type: 'tension',     strength: 3, label: 'Trade War' },
  { from: 'USA',   to: 'UK',     type: 'alliance',    strength: 3, label: 'Five Eyes' },
  { from: 'USA',   to: 'JAPAN',  type: 'alliance',    strength: 3, label: 'Security Treaty' },
  { from: 'USA',   to: 'INDIA',  type: 'partnership', strength: 2, label: 'Quad' },
  { from: 'USA',   to: 'RUSSIA', type: 'sanction',    strength: 3, label: 'Sanctions' },
  { from: 'USA',   to: 'SAUDI',  type: 'trade',       strength: 2, label: 'Oil/Arms' },
  { from: 'CHINA', to: 'RUSSIA', type: 'partnership', strength: 3, label: 'Strategic Ally' },
  { from: 'CHINA', to: 'INDIA',  type: 'tension',     strength: 2, label: 'Border Dispute' },
  { from: 'CHINA', to: 'SAUDI',  type: 'trade',       strength: 2, label: 'Oil Trade' },
  { from: 'UK',    to: 'FRANCE', type: 'alliance',    strength: 2, label: 'NATO' },
  { from: 'UK',    to: 'INDIA',  type: 'trade',       strength: 2, label: 'FTA Talks' },
  { from: 'INDIA', to: 'JAPAN',  type: 'partnership', strength: 2, label: 'Quad' },
  { from: 'INDIA', to: 'RUSSIA', type: 'trade',       strength: 2, label: 'Defense/Oil' },
  { from: 'INDIA', to: 'SAUDI',  type: 'trade',       strength: 2, label: 'Energy' },
  { from: 'RUSSIA',to: 'FRANCE', type: 'tension',     strength: 2, label: 'Ukraine War' },
];

const REL_COLORS: Record<RelType, string> = {
  trade:       '#00e5ff',
  alliance:    '#00ff88',
  tension:     '#ff3d3d',
  sanction:    '#ff8c00',
  partnership: '#bf7fff',
};

interface ArcParticle { t: number; speed: number; }

// Arrange nodes in a circle, India at top
function getNodePositions(w: number, h: number) {
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) * 0.36;
  return COUNTRIES.map((c, i) => {
    const angle = (i / COUNTRIES.length) * Math.PI * 2 - Math.PI / 2;
    return { id: c.id, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
}

export function GraphViewWorld() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<ArcParticle[]>([]);
  const [hover, setHover] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string } | null>(null);
  const [filter, setFilter] = useState<RelType | 'all'>('all');
  const [dims, setDims] = useState({ w: 800, h: 420 });

  // Resize
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ob = new ResizeObserver(() => {
      const { clientWidth: w, clientHeight: h } = el;
      if (w > 0 && h > 0) setDims({ w, h });
    });
    ob.observe(el);
    return () => ob.disconnect();
  }, []);

  const filtered = RELATIONS.filter(r => filter === 'all' || r.type === filter);

  // Init particles
  useEffect(() => {
    particlesRef.current = filtered.map(() => ({
      t: Math.random(),
      speed: 0.003 + Math.random() * 0.003,
    }));
  }, [filter, dims]); // eslint-disable-line react-hooks/exhaustive-deps

  // Draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const { w, h } = dims;
    canvas.width = w * devicePixelRatio;
    canvas.height = h * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    if (particlesRef.current.length !== filtered.length) {
      particlesRef.current = filtered.map(() => ({ t: Math.random(), speed: 0.003 + Math.random() * 0.003 }));
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Background gradient
      const bg = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, Math.max(w, h));
      bg.addColorStop(0, '#0d2137');
      bg.addColorStop(1, '#030d18');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Subtle grid
      ctx.strokeStyle = 'rgba(0,180,220,0.06)';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < w; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = 0; y < h; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

      const positions = getNodePositions(w, h);
      const posMap = Object.fromEntries(positions.map(p => [p.id, p]));

      // Draw edges + particles
      filtered.forEach((rel, i) => {
        const from = posMap[rel.from];
        const to = posMap[rel.to];
        if (!from || !to) return;
        const color = REL_COLORS[rel.type];
        const dimmed = hover && hover !== rel.from && hover !== rel.to;
        const alpha = dimmed ? 0.06 : 0.4;

        // Bezier control point
        const mx = (from.x + to.x) / 2;
        const my = (from.y + to.y) / 2;
        const dx = to.x - from.x; const dy = to.y - from.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const cpx = mx - (dy / dist) * dist * 0.25;
        const cpy = my + (dx / dist) * dist * 0.25;

        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.quadraticCurveTo(cpx, cpy, to.x, to.y);
        ctx.strokeStyle = color + Math.round(alpha * 255).toString(16).padStart(2, '0');
        ctx.lineWidth = rel.strength * 0.7;
        ctx.stroke();

        // Particle
        const p = particlesRef.current[i];
        if (p) {
          const t = p.t;
          const bx = (1 - t) * (1 - t) * from.x + 2 * (1 - t) * t * cpx + t * t * to.x;
          const by = (1 - t) * (1 - t) * from.y + 2 * (1 - t) * t * cpy + t * t * to.y;
          if (!dimmed) {
            const grd = ctx.createRadialGradient(bx, by, 0, bx, by, 5);
            grd.addColorStop(0, color + 'ff');
            grd.addColorStop(1, color + '00');
            ctx.beginPath(); ctx.arc(bx, by, 5, 0, Math.PI * 2);
            ctx.fillStyle = grd; ctx.fill();
          }
        }
      });

      // Advance particles
      particlesRef.current.forEach(p => { p.t += p.speed; if (p.t > 1) p.t = 0; });

      // Draw nodes
      positions.forEach(({ id, x, y }) => {
        const c = COUNTRIES.find(c => c.id === id)!;
        const isHov = hover === id;
        const isConn = !!hover && filtered.some(r => (r.from === hover && r.to === id) || (r.to === hover && r.from === id));
        const dimmed = hover && !isHov && !isConn;
        ctx.globalAlpha = dimmed ? 0.25 : 1;

        const nodeR = isHov ? 9 : 6;

        // Outer glow
        const glow = ctx.createRadialGradient(x, y, 0, x, y, isHov ? 32 : 22);
        glow.addColorStop(0, c.color + '44');
        glow.addColorStop(1, c.color + '00');
        ctx.beginPath(); ctx.arc(x, y, isHov ? 32 : 22, 0, Math.PI * 2);
        ctx.fillStyle = glow; ctx.fill();

        // Node dot
        const dot = ctx.createRadialGradient(x - 1, y - 1, 0, x, y, nodeR);
        dot.addColorStop(0, '#fff');
        dot.addColorStop(0.4, c.color);
        dot.addColorStop(1, c.color + '88');
        ctx.beginPath(); ctx.arc(x, y, nodeR, 0, Math.PI * 2);
        ctx.fillStyle = dot; ctx.fill();

        // Ring
        ctx.beginPath(); ctx.arc(x, y, nodeR + 3, 0, Math.PI * 2);
        ctx.strokeStyle = c.color + (isHov ? 'cc' : '66');
        ctx.lineWidth = isHov ? 1.5 : 1; ctx.stroke();

        ctx.globalAlpha = 1;

        // Label — always visible
        ctx.font = `${isHov ? 'bold ' : ''}${isHov ? 12 : 10}px monospace`;
        ctx.textAlign = 'center';
        // Shadow for readability
        ctx.shadowColor = '#000'; ctx.shadowBlur = 6;
        ctx.fillStyle = isHov ? '#fff' : c.color + 'cc';
        ctx.fillText(c.name, x, y + nodeR + 14);
        ctx.shadowBlur = 0;
      });

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [dims, filter, hover]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const positions = getNodePositions(dims.w, dims.h);
    let found: string | null = null;
    for (const p of positions) {
      if (Math.sqrt((mx - p.x) ** 2 + (my - p.y) ** 2) < 16) { found = p.id; break; }
    }
    setHover(found);
    if (found) {
      const c = COUNTRIES.find(c => c.id === found)!;
      const rels = RELATIONS.filter(r => r.from === found || r.to === found);
      const lines = rels.map(r => {
        const other = r.from === found ? r.to : r.from;
        const badge = { trade: '🔵', alliance: '🟢', tension: '🔴', sanction: '🟠', partnership: '🟣' }[r.type];
        const otherName = COUNTRIES.find(c => c.id === other)?.name || other;
        return `${badge} ${otherName}${r.label ? ` — ${r.label}` : ''}`;
      });
      setTooltip({ x: mx + 14, y: my - 8, content: `${c.name}\n${lines.join('\n')}` });
    } else setTooltip(null);
  }, [dims]);

  const filters: Array<{ key: RelType | 'all'; label: string; color: string }> = [
    { key: 'all',         label: 'All',         color: '#aaa' },
    { key: 'trade',       label: 'Trade',        color: REL_COLORS.trade },
    { key: 'alliance',    label: 'Alliance',     color: REL_COLORS.alliance },
    { key: 'tension',     label: 'Tension',      color: REL_COLORS.tension },
    { key: 'sanction',    label: 'Sanction',     color: REL_COLORS.sanction },
    { key: 'partnership', label: 'Partnership',  color: REL_COLORS.partnership },
  ];

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#030d18' }}>
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', cursor: hover ? 'pointer' : 'default' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { setHover(null); setTooltip(null); }}
      />

      {/* Filter pills */}
      <div style={{ position: 'absolute', top: 10, right: 12, display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'flex-end', pointerEvents: 'auto' }}>
        {filters.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{
            padding: '3px 9px', borderRadius: 20,
            border: `1px solid ${f.color}44`,
            background: filter === f.key ? f.color + '28' : 'rgba(0,0,0,0.5)',
            color: filter === f.key ? f.color : f.color + '88',
            fontSize: 9, letterSpacing: 1, cursor: 'pointer',
            boxShadow: filter === f.key ? `0 0 8px ${f.color}44` : 'none',
            transition: 'all 0.2s',
          }}>
            {f.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div style={{ position: 'absolute', bottom: 10, left: 12, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {Object.entries(REL_COLORS).map(([type, color]) => (
          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 18, height: 2, background: color, boxShadow: `0 0 4px ${color}` }} />
            <span style={{ color: color + 'aa', fontSize: 8, letterSpacing: 1 }}>{type.toUpperCase()}</span>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div style={{ position: 'absolute', bottom: 10, right: 12, color: 'rgba(0,200,220,0.4)', fontSize: 8, letterSpacing: 2 }}>
        {COUNTRIES.length} NODES · {filtered.length} EDGES
        <motion.div
                className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 inline-block ml-2"
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div style={{
          position: 'absolute', left: tooltip.x, top: tooltip.y,
          background: 'rgba(3,18,35,0.96)', border: '1px solid rgba(0,200,255,0.25)',
          borderRadius: 8, padding: '8px 12px', maxWidth: 220, pointerEvents: 'none', zIndex: 10,
          boxShadow: '0 0 16px rgba(0,180,255,0.15)',
        }}>
          {tooltip.content.split('\n').map((line, i) => (
            <div key={i} style={{
              color: i === 0 ? '#00e5ff' : 'rgba(180,220,255,0.75)',
              fontSize: i === 0 ? 12 : 10, fontWeight: i === 0 ? 700 : 400,
              marginBottom: i === 0 ? 5 : 2, fontFamily: 'monospace',
            }}>{line}</div>
          ))}
        </div>
      )}
    </div>
  );
}