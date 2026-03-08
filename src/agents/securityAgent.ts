import { AgentInsight, SimulationInput } from './econAgent';

export function securityAgent(input: SimulationInput): AgentInsight {
  const { oilPriceChange, currentRiskScore } = input;
  let insight = 'No active conflict escalation signals. India-China LAC remains tense but stable. India-USA strategic tech partnership strengthening.';
  let severity: 'info' | 'warning' | 'critical' = 'info';

  if (oilPriceChange > 20 || currentRiskScore > 60) {
    insight = `High oil prices are geopolitically destabilizing — Russia gains leverage in energy exports. India must accelerate Atmanirbhar Bharat in energy. China may exploit economic stress to amplify border pressure. Risk of retaliatory trade actions from USA if India increases Russian oil imports.`;
    severity = 'critical';
  } else if (oilPriceChange > 0) {
    insight = `Rising oil prices strengthen Russia's geopolitical hand. India's dependency on Russian oil (~40% of imports) creates strategic vulnerability. Expect moderate diplomatic pressure from Western partners.`;
    severity = 'warning';
  }

  return { agent: 'Security Agent', domain: 'Defense · Geopolitics · Border · Cyber', insight, severity };
}
