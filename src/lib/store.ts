import { create } from 'zustand';

interface AppState {
  riskScore: number;
  inflation: number;
  oilPriceChange: number;
  news: Array<{
    id: number;
    title: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    time: string;
    source: string;
  }>;
  setOilPriceChange: (change: number) => void;
  runSimulation: () => void;
}

const INITIAL_RISK = 45;
const INITIAL_INFLATION = 5.5;

export const useStore = create<AppState>((set, get) => ({
  riskScore: INITIAL_RISK,
  inflation: INITIAL_INFLATION,
  oilPriceChange: 0,
  news: [
    { id: 1, title: 'India and USA announce new semiconductor alliance', sentiment: 'positive', time: '2 hours ago', source: 'Reuters' },
    { id: 2, title: 'Border tensions escalate between India and China', sentiment: 'negative', time: '5 hours ago', source: 'Bloomberg' },
    { id: 3, title: 'Russia shifts more oil exports toward Asian markets', sentiment: 'neutral', time: '8 hours ago', source: 'FT' },
    { id: 4, title: 'US imposes new tech trade restrictions', sentiment: 'negative', time: '11 hours ago', source: 'WSJ' },
    { id: 5, title: 'India reports 7% GDP growth for Q3', sentiment: 'positive', time: '1 day ago', source: 'CNBC' },
  ],
  setOilPriceChange: (change) => set({ oilPriceChange: change }),
  runSimulation: () => {
    const change = get().oilPriceChange;
    // Base formula for mock MVP: 
    // +20% oil -> +2% inflation -> +10 risk score
    const newInflation = INITIAL_INFLATION + (change / 20) * 2;
    const addedRisk = (change / 20) * 10;
    
    // Calculate new risk score based on formula
    const newRisk = Math.min(100, Math.max(0, INITIAL_RISK + addedRisk));

    set({ riskScore: newRisk, inflation: newInflation });
  }
}));
