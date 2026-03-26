import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function loadGeopoliticalData() {
  const filePath = path.join(process.cwd(), 'lib/geopolitical_data.json');
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return {};
  }
}

function calculateCapabilityScores(stat: Record<string, unknown>) {
  const clamp = (val: number) => Math.max(0, Math.min(100, Math.round(val)));

  const gdpGrowth = stat.gdpGrowth as number || 0;
  const stability = stat.stability as number || 0;
  const tradeBalance = stat.tradeBalance as number || 0;
  const inflation = stat.inflation as number || 0;
  const diplomacy = stat.diplomacy as number | string;
  const military = stat.military as number || 0;

  return {
    gdpGrowth: gdpGrowth ? clamp((gdpGrowth / 10) * 100) : 0,
    stability: stability ? clamp(((stability + 2.5) / 5) * 100) : 0,
    trade: tradeBalance ? clamp((Math.abs(tradeBalance) / 1.5e12) * 100) : 0,
    inflation: inflation ? clamp(100 - (inflation / 10) * 100) : 0,
    diplomacy: diplomacy !== "N/A" ? clamp(Number(diplomacy)) : 0,
    defense: military ? clamp((military / 5) * 100) : 0,
  };
}

export async function GET() {
  const geo = loadGeopoliticalData();
  const codes = 'CHN;RUS;IND;USA';

  const indicators: Record<string, string> = {
    population: 'SP.POP.TOTL',
    gdp: 'NY.GDP.MKTP.CD',
    inflation: 'FP.CPI.TOTL.ZG',
    gdpGrowth: 'NY.GDP.MKTP.KD.ZG',
    tradeBalance: 'NE.RSB.GNFS.CD',
    stability: 'PV.EST',
    military: 'MS.MIL.XPND.GD.ZS'
  };

  const url = (i: string) =>
    `https://api.worldbank.org/v2/country/${codes}/indicator/${i}?format=json&mrv=5&per_page=100`;

  const res = await Promise.all(Object.values(indicators).map((i) => fetch(url(i))));
  const data = await Promise.all(res.map(r => r.json()));

  const [pop, gdp, inf, growth, trade, stability, military] = data;

  const stats: Record<string, Record<string, unknown>> = {};

  const process = (d: unknown[] | null | undefined, key: string) => {
    if (!d || !d[1] || !Array.isArray(d[1])) return;
    d[1].forEach((r: Record<string, unknown>) => {
      const id = r.countryiso3code as string;
      const countryVal = (r.country as Record<string, string>)?.value;
      const rValue = r.value as number | null;
      const rDate = r.date as string;
      
      if (!id) return;
      if (!stats[id]) stats[id] = { name: countryVal };
      if (rValue !== null && !stats[id][key]) stats[id][key] = rValue;
      
      const histKey = key + 'History';
      if (!stats[id][histKey]) stats[id][histKey] = [] as { date: string, value: number }[];
      if (rValue !== null) {
        (stats[id][histKey] as { date: string, value: number }[]).push({ date: rDate, value: rValue });
      }
    });
  };

  process(pop, 'population');
  process(gdp, 'gdp');
  process(inf, 'inflation');
  process(growth, 'gdpGrowth');
  process(trade, 'tradeBalance');
  process(stability, 'stability');
  process(military, 'military');

  const final: Record<string, unknown> = {};

  Object.keys(stats).forEach(id => {
    const s = stats[id];
    const g = geo[id] || {};

    s.diplomacy = g.diplomacy ?? "N/A";
    s.partners = g.partners ?? [];

    final[id] = {
      name: s.name,
      stats: s,
      radar: calculateCapabilityScores(s)
    };
  });

  return NextResponse.json(final);
}