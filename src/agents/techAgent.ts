import { AgentInsight, SimulationInput } from './econAgent';

export function techAgent(input: SimulationInput): AgentInsight {
  const { oilPriceChange, currentRiskScore } = input;
  let insight = 'India-USA semiconductor partnership expanding. Digital infrastructure stable. AI compute capacity growing — 3 new tier-3 data centers commissioned.';
  let severity: 'info' | 'warning' | 'critical' = 'info';

  if (currentRiskScore > 65 || oilPriceChange > 25) {
    insight = `High geopolitical tension threatens semiconductor supply chains — India imports 87% of chips. US export controls on China may benefit Indian fabs mid-term, but short-term crunch likely. Data center power costs surge with energy price rise. Recommend accelerating domestic chip fabrication incentives.`;
    severity = 'critical';
  } else if (oilPriceChange > 10) {
    insight = `Rising energy prices are a concern for India's data center sector — server farms consume ~2.5 GW nationally. Cloud providers may increase costs. However, India's tech outsourcing sector remains resilient as a dollar-earning industry that offsets oil import costs.`;
    severity = 'warning';
  }

  return { agent: 'Yantra Agent', domain: 'Semiconductors · AI · Space · Digital Infra', insight, severity };
}
