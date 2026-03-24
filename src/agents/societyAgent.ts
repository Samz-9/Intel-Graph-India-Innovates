import { AgentInsight, SimulationInput } from './econAgent';

export function societyAgent(input: SimulationInput): AgentInsight {
  const { oilPriceChange, currentInflation } = input;
  let insight = 'Public sentiment stable. Labor market buoyant with 7% GDP growth. Gig economy expanding — 15M+ workers registered on platform economy.';
  let severity: 'info' | 'warning' | 'critical' = 'info';

  if (currentInflation > 7 || oilPriceChange > 25) {
    insight = `Warning: Sustained inflation above 7% severely erodes real wages of informal workers (~450M). Food inflation driven by fertilizer and transport costs will hit low-income households hardest. Risk of labor unrest in urban manufacturing belts. Public sentiment negative. Government approval ratings may fall 8–12 points.`;
    severity = 'critical';
  } else if (oilPriceChange > 10) {
    insight = `Rising fuel prices translate to higher commute costs for gig-economy workers (+15% transport expense). Food prices rise due to distribution costs. Urban poor face increased cost-of-living pressure. Government should consider targeted LPG subsidies to cushion impact.`;
    severity = 'warning';
  }

  return { agent: 'Samaj Agent', domain: 'Public Health · Labor · Education · Sentiment', insight, severity };
}
