'use client';
import { use } from 'react';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid,
} from 'recharts';
import { ECONOMIC_DATA } from '@/lib/economicData';

const countryFlags: Record<string, string> = {
  India: '🇮🇳',
  USA: '🇺🇸',
  China: '🇨🇳',
  Russia: '🇷🇺',
};

const countryDetails: Record<string, {
  color: string;
  gdpGrowth: number[];
  tradeBalance: number[];
  radarData: { subject: string; value: number }[];
}> = {
  India: {
    color: '#238636',
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
    color: '#58a6ff',
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
    color: '#da3633',
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
    color: '#d29922',
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


type Props = { params: Promise<{ name: string }> };

export default function CountryPage({ params }: Props) {
  const { name: rawName } = use(params);
  const name = decodeURIComponent(rawName);
  const data = ECONOMIC_DATA[name as keyof typeof ECONOMIC_DATA];
  const details = countryDetails[name];
  if (!data || !details) return notFound();

  const gdpData = QUARTERS.map((q, i) => ({ quarter: q, growth: details.gdpGrowth[i] }));
  const tradeData = QUARTERS.map((q, i) => ({ quarter: q, balance: details.tradeBalance[i] }));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
      {/* Header */}
      <div className="glass-panel flex items-center gap-4">
        <span className="text-6xl">{countryFlags[name]}</span>
        <div>
          <h2 className="text-3xl font-bold">{name}</h2>
          <div className="flex gap-4 mt-2 text-sm text-[#8b949e]">
            <span>GDP: <strong className="text-foreground">{data.gdp}</strong></span>
            <span>Inflation: <strong className="text-foreground">{data.inflation}</strong></span>
            <span>Trade Partners: <strong className="text-foreground">{data.trade.join(', ')}</strong></span>
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-4">
        {/* GDP Growth Line Chart */}
        <div className="glass-panel col-span-2">
          <h3 className="text-sm font-semibold mb-4 text-[#8b949e] uppercase tracking-wide">GDP Growth Rate (%) — Last 6 Quarters</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={gdpData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="quarter" tick={{ fill: '#8b949e', fontSize: 11 }} />
              <YAxis tick={{ fill: '#8b949e', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#1e2731', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
              <Line type="monotone" dataKey="growth" stroke={details.color} strokeWidth={2} dot={{ fill: details.color, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Radar */}
        <div className="glass-panel">
          <h3 className="text-sm font-semibold mb-4 text-[#8b949e] uppercase tracking-wide">Capability Index</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={details.radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#8b949e', fontSize: 9 }} />
              <Radar name={name} dataKey="value" stroke={details.color} fill={details.color} fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Trade Balance */}
        <div className="glass-panel col-span-3">
          <h3 className="text-sm font-semibold mb-4 text-[#8b949e] uppercase tracking-wide">Trade Balance (USD Billion) — Last 6 Quarters</h3>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={tradeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="quarter" tick={{ fill: '#8b949e', fontSize: 11 }} />
              <YAxis tick={{ fill: '#8b949e', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#1e2731', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
              <Bar dataKey="balance" fill={details.color} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
