export interface AgentInsight {
  agent: string;
  domain: string;
  insight: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface SimulationInput {
  oilPriceChange: number;
  currentRiskScore: number;
  currentInflation: number;
}

export function econAgent(input: SimulationInput): AgentInsight {
  const { oilPriceChange } = input;
  let insight = 'Economy is stable. Moderate trade activity with key partners USA and Russia.';
  let severity: 'info' | 'warning' | 'critical' = 'info';

  if (oilPriceChange > 0) {
    insight = `Oil shock of +${oilPriceChange}% will trigger cost-push inflation of ~+${((oilPriceChange / 20) * 2).toFixed(1)}%. India's import bill surges — current account deficit widens. MSMEs and logistics sector at risk.`;
    severity = oilPriceChange > 25 ? 'critical' : 'warning';
  } else if (oilPriceChange < 0) {
    insight = `Oil price drop of ${oilPriceChange}% reduces India's input costs. Inflation eases by ~${Math.abs((oilPriceChange / 20) * 2).toFixed(1)}%. Trade deficit narrows.`;
  }

  return { agent: 'Econ Agent', domain: 'Trade · GDP · Inflation · MSMEs', insight, severity };
}
