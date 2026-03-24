import { AgentInsight, SimulationInput } from './econAgent';

export function resourceAgent(input: SimulationInput): AgentInsight {
  const { oilPriceChange } = input;
  let insight = 'Energy grid is stable. Renewable energy transition on track — solar capacity at 73 GW. Monsoon outlook normal, agriculture sector stable.';
  let severity: 'info' | 'warning' | 'critical' = 'info';

  if (oilPriceChange > 30) {
    insight = `Critical: +${oilPriceChange}% oil price spike creates severe energy stress. Thermal power generation costs rise ~18%. Grid load on renewable infrastructure increases. AQI in industrial zones may worsen as subsidized coal use rises. Water sector irrigation pump costs surge.`;
    severity = 'critical';
  } else if (oilPriceChange > 10) {
    insight = `Oil price rise of +${oilPriceChange}% pressures non-renewable energy costs. India should accelerate EV push and green hydrogen. Short-term: fertilizer prices spike by ~8%, impacting farm input costs.`;
    severity = 'warning';
  } else if (oilPriceChange < 0) {
    insight = `Oil price drop eases energy cost pressure. Good time to maintain strategic petroleum reserves. Renewable transition can proceed without emergency subsidy pressure.`;
  }

  return { agent: 'Shakti Agent', domain: 'Energy · Climate · AQI · Water · Agriculture', insight, severity };
}
