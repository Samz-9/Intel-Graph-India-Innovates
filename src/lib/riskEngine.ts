/**
 * Risk Engine
 * Formula: (conflictNewsCount × 0.4) + (negativeSentimentRatio × 0.3) + (inflation × 0.3)
 */
export function calculateRiskScore({
  conflictNewsCount,
  negativeSentimentRatio,
  inflation,
}: {
  conflictNewsCount: number;
  negativeSentimentRatio: number;
  inflation: number;
}): number {
  const score =
    conflictNewsCount * 0.4 + negativeSentimentRatio * 0.3 + inflation * 0.3;
  return Math.min(100, Math.max(0, score));
}

export function getRiskLevel(score: number): {
  label: 'Low' | 'Medium' | 'High';
  color: string;
  bg: string;
  border: string;
} {
  if (score <= 30)
    return {
      label: 'Low',
      color: 'text-statusSuccess',
      bg: 'bg-statusSuccess/20',
      border: 'border-statusSuccess',
    };
  if (score <= 60)
    return {
      label: 'Medium',
      color: 'text-statusWarning',
      bg: 'bg-statusWarning/20',
      border: 'border-statusWarning',
    };
  return {
    label: 'High',
    color: 'text-statusDanger',
    bg: 'bg-statusDanger/20',
    border: 'border-statusDanger',
  };
}
