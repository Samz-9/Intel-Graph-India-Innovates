import { SimulationInput, AgentInsight } from './econAgent';
import { econAgent } from './econAgent';
import { securityAgent } from './securityAgent';
import { resourceAgent } from './resourceAgent';
import { techAgent } from './techAgent';
import { societyAgent } from './societyAgent';

export interface OrchestratorResult {
  insights: AgentInsight[];
  executiveSummary: string;
  overallSeverity: 'info' | 'warning' | 'critical';
}

export function orchestrate(input: SimulationInput): OrchestratorResult {
  // 1. Call all 5 specialist agents
  const insights: AgentInsight[] = [
    econAgent(input),
    securityAgent(input),
    resourceAgent(input),
    techAgent(input),
    societyAgent(input),
  ];

  // 2. Determine overall severity (worst-case from agents)
  const severityOrder = { info: 0, warning: 1, critical: 2 };
  const overallSeverity = insights.reduce<'info' | 'warning' | 'critical'>(
    (worst, cur) =>
      severityOrder[cur.severity] > severityOrder[worst] ? cur.severity : worst,
    'info'
  );

  // 3. Synthesize executive summary
  const criticalAgents = insights.filter((i) => i.severity === 'critical').map((i) => i.agent);
  const warningAgents = insights.filter((i) => i.severity === 'warning').map((i) => i.agent);

  let executiveSummary = '';
  if (overallSeverity === 'critical') {
    executiveSummary = `🔴 CRITICAL ALERT — The following agents report critical conditions: ${criticalAgents.join(', ')}. Immediate policy intervention recommended. The oil price shock of +${input.oilPriceChange}% creates cascading cross-domain stress across India's economic, energy, and social systems. Risk Score elevated to ${Math.round(input.currentRiskScore)} / 100.`;
  } else if (overallSeverity === 'warning') {
    executiveSummary = `🟡 MODERATE RISK — Elevated signals from: ${warningAgents.join(', ')}. The scenario is manageable but requires proactive monitoring. India should consider targeted subsidies and strengthen strategic petroleum reserves as a buffer.`;
  } else {
    executiveSummary = `🟢 STABLE CONDITIONS — All domain agents report low risk. India's geopolitical and economic fundamentals remain solid. Growth trajectory on track.`;
  }

  return { insights, executiveSummary, overallSeverity };
}
