'use client';
import { useState } from 'react';
import { SimulationPanel } from '@/components/SimulationPanel';
import { motion } from 'framer-motion';

const INITIAL_RISK = 45;
const INITIAL_INFLATION = 5.5;

export default function SimulationPage() {
  const [riskScore, setRiskScore] = useState(INITIAL_RISK);
  const [inflation, setInflation] = useState(INITIAL_INFLATION);

  const handleSimulate = (_oilChange: number, newRisk: number, newInflation: number) => {
    setRiskScore(newRisk);
    setInflation(newInflation);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Risk Simulation Lab</h2>
        <p className="text-sm text-[#8b949e] mt-1">
          Adjust macroeconomic variables and observe cascading effects across the intelligence graph.
          The Cabinet of Five agents analyze the scenario independently.
        </p>
      </div>
      <SimulationPanel
        onSimulate={handleSimulate}
        currentRiskScore={riskScore}
        currentInflation={inflation}
      />
    </motion.div>
  );
}
