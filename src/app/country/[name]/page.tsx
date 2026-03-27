'use client';
import { useEffect, useState } from 'react';

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

// import { ECONOMIC_DATA } from '@/lib/economicData';

/* ── Fade-up stagger helper ── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay },
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
  }
> = {
  India: {
    color: '#22d3ee',
    accent: '#06b6d4',
    glow: 'rgba(34,211,238,0.18)',
    tagline: 'Emerging Powerhouse · South Asia',
  },
  USA: {
    color: '#38bdf8',
    accent: '#0ea5e9',
    glow: 'rgba(56,189,248,0.18)',
    tagline: 'Global Superpower · North America',
  },
  China: {
    color: '#818cf8',
    accent: '#6366f1',
    glow: 'rgba(129,140,248,0.18)',
    tagline: 'Strategic Challenger · East Asia',
  },
  Russia: {
    color: '#60a5fa',
    accent: '#3b82f6',
    glow: 'rgba(96,165,250,0.18)',
    tagline: 'Energy Giant · Eastern Europe',
  },
};
const countryMap: Record<string, string> = {
  India: 'IND',
  USA: 'USA',
  China: 'CHN',
  Russia: 'RUS'
};
const QUARTERS = ['Q1 24', 'Q2 24', 'Q3 24', 'Q4 24', 'Q1 25', 'Q2 25'];

/* ── Custom tooltip ── */
function CustomTooltip({ active, payload, label, color }: { active?: boolean; payload?: Array<{ value: number; dataKey: string }>; label?: string; color: string }) {
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
 
  interface CountryApiData {
    radar: {
      gdpGrowth: number;
      stability: number;
      trade: number;
      inflation: number;
      diplomacy: number;
      defense: number;
    };
    stats: {
      gdp: number;
      inflation: number;
      population: number;
      stability: number;
      military: number;
      diplomacy: string | number;
      partners: string[];
      gdpGrowthHistory?: { date: string; value: number }[];
      tradeBalanceHistory?: { date: string; value: number }[];
    };
  }

  interface AatmanirbharData {
    id: string;
    name: string;
    score: number;
    breakdown: {
      tech: number;
      energy: number;
      manufacturing: number;
      food: number;
      trade: number;
    };
    raw: any;
  }

  const [apiData, setApiData] = useState<Record<string, CountryApiData> | null>(null);
  const [aatmanirbharData, setAatmanirbharData] = useState<AatmanirbharData | null>(null);

  useEffect(() => {
    // Fetch cabinet data
    fetch('/api/cabinet')
      .then(res => res.json())
      .then(data => setApiData(data));

    // Fetch Aatmanirbhar data
    fetch('/api/aatmanirbhar')
      .then(res => res.json())
      .then((data: AatmanirbharData[]) => {
        const countryId = countryMap[name];
        const countryData = data.find(c => c.id === countryId);
        if (countryData) setAatmanirbharData(countryData);
      });
  }, [name]);

  const code = countryMap[name];
  const data = apiData?.[code];
  const details = countryDetails[name];

  if (!details) return notFound();
  if (!data) return <div style={{ padding: 40, color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans, sans-serif' }}>Loading intelligence...</div>;
 
  const { color, accent, glow, tagline } = details;

  const PillarBar = ({ label, value, delay }: { label: string; value: number, delay: number }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, alignItems: 'center' }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: 1.5, textTransform: 'uppercase' }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 800, color, fontFamily: 'Syne, sans-serif' }}>{value}%</span>
      </div>
      <div style={{ height: 6, width: '100%', background: 'rgba(255,255,255,0.03)', borderRadius: 10, overflow: 'hidden', position: 'relative' }}>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.2, delay: 0.5 + delay, ease: [0.22, 1, 0.36, 1] }}
          style={{ 
            height: '100%', 
            background: `linear-gradient(90deg, ${color}30, ${color})`,
            boxShadow: `0 0 10px ${color}40`,
            borderRadius: 10
          }} 
        />
      </div>
    </div>
  );

  const radarData = [
    { subject: 'GDP Growth', value: data.radar.gdpGrowth },
    { subject: 'Stability', value: data.radar.stability },
    { subject: 'Trade', value: data.radar.trade },
    { subject: 'Inflation', value: data.radar.inflation },
    { subject: 'Diplomacy', value: data.radar.diplomacy },
    { subject: 'Defense', value: data.radar.defense },
  ];
  const gdpData = data.stats.gdpGrowthHistory && data.stats.gdpGrowthHistory.length > 0
    ? data.stats.gdpGrowthHistory.slice(0, 6).reverse().map((h: { date: string; value: number }) => ({ quarter: h.date, growth: Number(h.value?.toFixed(2)) || 0 }))
    : QUARTERS.map((q) => ({ quarter: q, growth: 0 }));
  const tradeData = data.stats.tradeBalanceHistory && data.stats.tradeBalanceHistory.length > 0
    ? data.stats.tradeBalanceHistory.slice(0, 6).reverse().map((h: { date: string; value: number }) => ({ quarter: h.date, balance: Number((h.value / 1e9).toFixed(2)) || 0 }))
    : QUARTERS.map((q) => ({ quarter: q, balance: 0 }));

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
                <StatBadge label="GDP" value={(data.stats.gdp / 1e12).toFixed(2) + 'T'} color={color} />
                <StatBadge label="Inflation" value={data.stats.inflation?.toFixed(2) + '%'} color={color} />
                <StatBadge label="Population" value={data.stats.population > 1e9 ? (data.stats.population / 1e9).toFixed(2) + 'B' : (data.stats.population / 1e6).toFixed(0) + 'M'} color={color} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ══ CHARTS ROW ══ */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 360px', gap: 16 }}>

          {/* GDP Growth */}
          <motion.div {...fadeUp(0.1)} style={{ gridColumn: '1 / 3' }}>
            <Panel>
              <ChartLabel>GDP Growth — Historical Trend</ChartLabel>
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
                    activeDot={{ r: 6, fill: color }}
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
                <RadarChart data={radarData} outerRadius="72%">
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

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: 16 }}>
          {/* ══ TRADE BALANCE ══ */}
          <motion.div {...fadeUp(0.26)}>
            <Panel style={{ height: '100%' }}>
              <ChartLabel>Trade Balance — Historical Trend (B USD)</ChartLabel>
              <ResponsiveContainer width="100%" height={220}>
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

          {/* ══ AATMANIRBHAR (SELF-RELIANCE) INDEX ══ */}
          <motion.div {...fadeUp(0.32)}>
            <Panel style={{ height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <ChartLabel>Strategic Sovereignty Index</ChartLabel>
                {aatmanirbharData && (
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color, fontFamily: 'Syne, sans-serif', lineHeight: 1 }}>
                      {aatmanirbharData.score}
                    </div>
                    <div style={{ fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1 }}>Overall Score</div>
                  </div>
                )}
              </div>

              {!aatmanirbharData ? (
                <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
                  Calculating Sovereignty Matrix...
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <PillarBar label="Tech & IP Sovereignty" value={aatmanirbharData.breakdown.tech} delay={0.1} />
                  <PillarBar label="Energy Independence" value={aatmanirbharData.breakdown.energy} delay={0.2} />
                  <PillarBar label="Physical Production" value={aatmanirbharData.breakdown.manufacturing} delay={0.3} />
                  <PillarBar label="Agro-Security" value={aatmanirbharData.breakdown.food} delay={0.4} />
                  <PillarBar label="Supply Chain Autonomy" value={aatmanirbharData.breakdown.trade} delay={0.5} />
                  
                  <div style={{ 
                    marginTop: 10, padding: '10px 12px', background: 'rgba(255,255,255,0.02)', 
                    borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' 
                  }}>
                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5, margin: 0 }}>
                      <span style={{ color, fontWeight: 700 }}>AI ANALYST:</span> This score reflects real-time World Bank data on R&D, energy imports, and manufacturing output relative to global leaders.
                    </p>
                  </div>
                </div>
              )}
            </Panel>
          </motion.div>
        </div>

        {/* ══ ADDITIONAL INDICATORS ══ */}
        <motion.div {...fadeUp(0.38)}>
          <Panel>
            <ChartLabel>Additional Intelligence Data</ChartLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {[
                { label: 'Military Exp.', value: data.stats.military?.toFixed(2) + '% of GDP' },
                { label: 'Pol. Stability', value: data.stats.stability?.toFixed(2) + ' Index' },
                { label: 'Diplomacy', value: data.stats.diplomacy },
              ].map((stat: { label: string; value: string | number }, i: number) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.38 + i * 0.06, duration: 0.3 }}
                  style={{
                    padding: '10px 18px',
                    background: `${color}0f`,
                    border: `1px solid ${color}22`,
                    borderRadius: 10,
                    display: 'flex', flexDirection: 'column', gap: 4,
                    minWidth: 140,
                    transition: 'background 0.2s, border-color 0.2s',
                  }}
                  whileHover={{ background: `${color}20`, borderColor: `${color}45` }}
                >
                  <span style={{ fontSize: 10, fontWeight: 600, color: 'rgba(200,230,255,0.5)', textTransform: 'uppercase', letterSpacing: 1.2 }}>{stat.label}</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.95)' }}>{stat.value}</span>
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