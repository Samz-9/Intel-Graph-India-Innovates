'use client';

import { useParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';

import { ECONOMIC_DATA } from '@/lib/economicData';

/* ── Fade-up stagger helper ── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
});

const countryFlags: Record<string, string> = {
  India: '🇮🇳',
  USA: '🇺🇸',
  China: '🇨🇳',
  Russia: '🇷🇺',
};

const countryDetails: Record<
  string,
  {
    color: string;
    accent: string;
    glow: string;
    tagline: string;
    gdpGrowth: number[];
    tradeBalance: number[];
    radarData: { subject: string; value: number }[];
  }
> = {
  India: {
    color: '#22d3ee',
    accent: '#06b6d4',
    glow: 'rgba(34,211,238,0.18)',
    tagline: 'Emerging Powerhouse · South Asia',
    gdpGrowth: [6.5, 7.0, 7.2, 6.8, 7.4, 7.2],
    tradeBalance: [-180, -195, -210, -185, -220, -230],
    radarData: [
      { subject: 'GDP Growth', value: 80 },
      { subject: 'Stability', value: 62 },
      { subject: 'Trade', value: 70 },
      { subject: 'Inflation', value: 50 },
      { subject: 'Diplomacy', value: 75 },
      { subject: 'Defense', value: 65 },
    ],
  },
  USA: {
    color: '#38bdf8',
    accent: '#0ea5e9',
    glow: 'rgba(56,189,248,0.18)',
    tagline: 'Global Superpower · North America',
    gdpGrowth: [2.1, 2.3, 1.9, 2.5, 2.2, 2.0],
    tradeBalance: [-600, -650, -580, -710, -680, -700],
    radarData: [
      { subject: 'GDP Growth', value: 55 },
      { subject: 'Stability', value: 85 },
      { subject: 'Trade', value: 90 },
      { subject: 'Inflation', value: 70 },
      { subject: 'Diplomacy', value: 80 },
      { subject: 'Defense', value: 98 },
    ],
  },
  China: {
    color: '#818cf8',
    accent: '#6366f1',
    glow: 'rgba(129,140,248,0.18)',
    tagline: 'Strategic Challenger · East Asia',
    gdpGrowth: [5.2, 4.9, 5.1, 4.6, 4.8, 5.0],
    tradeBalance: [700, 820, 750, 900, 850, 870],
    radarData: [
      { subject: 'GDP Growth', value: 65 },
      { subject: 'Stability', value: 55 },
      { subject: 'Trade', value: 85 },
      { subject: 'Inflation', value: 88 },
      { subject: 'Diplomacy', value: 45 },
      { subject: 'Defense', value: 82 },
    ],
  },
  Russia: {
    color: '#60a5fa',
    accent: '#3b82f6',
    glow: 'rgba(96,165,250,0.18)',
    tagline: 'Energy Giant · Eastern Europe',
    gdpGrowth: [1.5, 2.1, -2.2, 0.8, 1.2, 1.8],
    tradeBalance: [120, 180, 210, 150, 170, 160],
    radarData: [
      { subject: 'GDP Growth', value: 30 },
      { subject: 'Stability', value: 40 },
      { subject: 'Trade', value: 50 },
      { subject: 'Inflation', value: 35 },
      { subject: 'Diplomacy', value: 30 },
      { subject: 'Defense', value: 78 },
    ],
  },
};

const QUARTERS = ['Q1 24', 'Q2 24', 'Q3 24', 'Q4 24', 'Q1 25', 'Q2 25'];

/* ── Custom tooltip ── */
function CustomTooltip({ active, payload, label, color }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(8,15,26,0.95)',
      border: `1px solid ${color}40`,
      borderLeft: `3px solid ${color}`,
      borderRadius: 8,
      padding: '8px 14px',
      backdropFilter: 'blur(12px)',
      boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${color}20`,
    }}>
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 4, letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color, fontFamily: 'inherit' }}>
        {payload[0].value > 0 ? '+' : ''}{payload[0].value}
        <span style={{ fontSize: 10, fontWeight: 400, marginLeft: 4, color: 'rgba(255,255,255,0.4)' }}>
          {payload[0].dataKey === 'growth' ? '% YoY' : 'B USD'}
        </span>
      </div>
    </div>
  );
}

/* ── Stat badge ── */
function StatBadge({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{
      padding: '10px 16px',
      background: `${color}0d`,
      border: `1px solid ${color}25`,
      borderRadius: 10,
      display: 'flex', flexDirection: 'column', gap: 3,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${color}, transparent)`,
      }} />
      <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: 1.5, color: `${color}90`, textTransform: 'uppercase' }}>{label}</span>
      <span style={{ fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>{value}</span>
    </div>
  );
}

/* ── Section wrapper ── */
function Panel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: 'linear-gradient(145deg, rgba(10,18,32,0.95), rgba(6,12,22,0.98))',
      border: '1px solid rgba(56,189,248,0.1)',
      borderRadius: 16,
      padding: '22px 24px',
      position: 'relative', overflow: 'hidden',
      boxShadow: '0 1px 0 rgba(255,255,255,0.04) inset, 0 20px 40px rgba(0,0,0,0.4)',
      ...style,
    }}>
      {/* top shimmer line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.3), transparent)',
      }} />
      {children}
    </div>
  );
}

/* ── Chart label ── */
function ChartLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 600, letterSpacing: 2,
      color: 'rgba(148,210,255,0.45)', textTransform: 'uppercase', marginBottom: 18,
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      <div style={{ width: 3, height: 12, borderRadius: 2, background: 'rgba(56,189,248,0.5)' }} />
      {children}
    </div>
  );
}

export default function CountryPage() {
  const params = useParams();
  const name = decodeURIComponent(params.name as string);

  const data = ECONOMIC_DATA[name as keyof typeof ECONOMIC_DATA];
  const details = countryDetails[name];

  if (!data || !details) return notFound();

  const { color, accent, glow, tagline } = details;

  const gdpData = QUARTERS.map((q, i) => ({ quarter: q, growth: details.gdpGrowth[i] }));
  const tradeData = QUARTERS.map((q, i) => ({ quarter: q, balance: details.tradeBalance[i] }));

  const axisStyle = { fill: 'rgba(148,210,255,0.4)', fontSize: 11, fontFamily: 'inherit' };
  const gridStyle = { stroke: 'rgba(56,189,248,0.07)', strokeDasharray: '4 4' };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap');

        .country-root * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        .country-root { display: flex; flex-direction: column; gap: 20px; }

        .capability-axis text { fill: rgba(148,210,255,0.55) !important; font-size: 10px !important; }
      `}</style>

      <div className="country-root">

        {/* ══ HEADER PANEL ══ */}
        <motion.div {...fadeUp(0)}>
          <div style={{
            background: `linear-gradient(135deg, rgba(10,18,32,0.98) 0%, rgba(6,12,22,0.98) 100%)`,
            border: `1px solid ${color}25`,
            borderRadius: 20,
            padding: '28px 32px',
            position: 'relative', overflow: 'hidden',
            boxShadow: `0 0 0 1px rgba(255,255,255,0.04) inset, 0 0 80px ${glow}, 0 32px 64px rgba(0,0,0,0.6)`,
          }}>
            {/* Diagonal accent stripe */}
            <div style={{
              position: 'absolute', top: -40, right: 80, width: 280, height: 280,
              background: `radial-gradient(ellipse, ${glow} 0%, transparent 70%)`,
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
              background: `linear-gradient(90deg, transparent, ${color}35, transparent)`,
            }} />
            {/* diagonal grid lines — decorative */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.04 }}>
              {[0,1,2,3,4,5].map(i => (
                <line key={i} x1={`${i * 20}%`} y1="0" x2={`${i * 20 + 30}%`} y2="100%"
                  stroke={color} strokeWidth="1" />
              ))}
            </svg>

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 22 }}>
              {/* Flag with glow ring */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: `${color}15`,
                  border: `1px solid ${color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 42,
                  boxShadow: `0 0 0 6px ${color}08, 0 0 30px ${glow}`,
                }}>
                  {countryFlags[name]}
                </div>
                {/* pulse ring */}
                <div style={{
                  position: 'absolute', inset: -6, borderRadius: '50%',
                  border: `1px solid ${color}20`,
                  animation: 'pulse-ring 2.5s ease-out infinite',
                }} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 3, color: `${color}80`, textTransform: 'uppercase', marginBottom: 4 }}>
                  Intelligence Profile
                </div>
                <h1 style={{
                  fontFamily: 'Syne, sans-serif', fontSize: 38, fontWeight: 800,
                  color: 'rgba(255,255,255,0.96)', letterSpacing: -1, lineHeight: 1,
                  marginBottom: 6,
                  textShadow: `0 0 40px ${color}30`,
                }}>
                  {name}
                </h1>
                <div style={{ fontSize: 12, color: 'rgba(148,210,255,0.55)', fontWeight: 500 }}>
                  {tagline}
                </div>
              </div>

              {/* Stat badges row */}
              <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
                <StatBadge label="GDP" value={data.gdp} color={color} />
                <StatBadge label="Inflation" value={data.inflation} color={color} />
                <StatBadge label="Partners" value={data.trade.length.toString()} color={color} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ══ CHARTS ROW ══ */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 360px', gap: 16 }}>

          {/* GDP Growth */}
          <motion.div {...fadeUp(0.1)} style={{ gridColumn: '1 / 3' }}>
            <Panel>
              <ChartLabel>GDP Growth — Last 6 Quarters</ChartLabel>
              <ResponsiveContainer width="100%" height={230}>
                <LineChart data={gdpData}>
                  <defs>
                    <linearGradient id="gdpGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid {...gridStyle} />
                  <XAxis dataKey="quarter" tick={axisStyle} axisLine={false} tickLine={false} />
                  <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
                  <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" />
                  <Tooltip content={<CustomTooltip color={color} />} />
                  <Line
                    type="monotone" dataKey="growth"
                    stroke={color} strokeWidth={2.5}
                    dot={{ fill: color, r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: color, boxShadow: `0 0 12px ${color}` }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Panel>
          </motion.div>

          {/* Radar */}
          <motion.div {...fadeUp(0.18)}>
            <Panel style={{ height: '100%' }}>
              <ChartLabel>Capability Index</ChartLabel>
              <ResponsiveContainer width="100%" height={230}>
                <RadarChart data={details.radarData} outerRadius="72%">
                  <PolarGrid stroke={`${color}18`} />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: `${color}70`, fontSize: 10, fontFamily: 'DM Sans, sans-serif' }} />
                  <Radar
                    dataKey="value" stroke={color} fill={color} fillOpacity={0.18}
                    strokeWidth={1.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </Panel>
          </motion.div>
        </div>

        {/* ══ TRADE BALANCE ══ */}
        <motion.div {...fadeUp(0.26)}>
          <Panel>
            <ChartLabel>Trade Balance — Last 6 Quarters (B USD)</ChartLabel>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={tradeData} barSize={32}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.9} />
                    <stop offset="100%" stopColor={accent} stopOpacity={0.5} />
                  </linearGradient>
                </defs>
                <CartesianGrid {...gridStyle} />
                <XAxis dataKey="quarter" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
                <ReferenceLine y={0} stroke="rgba(255,255,255,0.15)" />
                <Tooltip content={<CustomTooltip color={color} />} />
                <Bar dataKey="balance" fill="url(#barGrad)" radius={[5, 5, 0, 0]}
                  style={{ filter: `drop-shadow(0 0 6px ${color}50)` }} />
              </BarChart>
            </ResponsiveContainer>
          </Panel>
        </motion.div>

        {/* ══ TRADE PARTNERS ══ */}
        <motion.div {...fadeUp(0.34)}>
          <Panel>
            <ChartLabel>Key Trade Partners</ChartLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {data.trade.map((partner: string, i: number) => (
                <motion.div
                  key={partner}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.38 + i * 0.06, duration: 0.3 }}
                  style={{
                    padding: '7px 14px',
                    background: `${color}0f`,
                    border: `1px solid ${color}22`,
                    borderRadius: 8,
                    fontSize: 12, fontWeight: 500,
                    color: 'rgba(200,230,255,0.8)',
                    cursor: 'default',
                    transition: 'background 0.2s, border-color 0.2s',
                  }}
                  whileHover={{ background: `${color}20`, borderColor: `${color}45` }}
                >
                  {partner}
                </motion.div>
              ))}
            </div>
          </Panel>
        </motion.div>

      </div>

      <style>{`
        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(1.4); opacity: 0; }
        }
      `}</style>
    </>
  );
}