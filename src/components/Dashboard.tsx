"use client";

import React, { useState } from 'react';
import { LayoutDashboard, Globe, Activity, TrendingUp, AlertTriangle } from 'lucide-react';

// --- MOCK DATA ---
const INITIAL_RISK_SCORE = 45; // Medium
const BASE_INFLATION = 5.5;

const MOCK_NEWS = [
  { id: 1, title: 'India and USA announce new semiconductor alliance', sentiment: 'positive', time: '2 hours ago' },
  { id: 2, title: 'Border tensions escalate between India and China', sentiment: 'negative', time: '5 hours ago' },
  { id: 3, title: 'Russia shifts more oil exports toward Asian markets', sentiment: 'neutral', time: '8 hours ago' },
  { id: 4, title: 'US imposes new tech trade restrictions', sentiment: 'negative', time: '11 hours ago' },
  { id: 5, title: 'India reports 7% GDP growth for Q3', sentiment: 'positive', time: '1 day ago' },
];

const COUNTRY_DATA = {
  India: { gdp: '$3.73 Trillion', inflation: '5.5%', trade: ['USA', 'Russia', 'China'] },
  USA: { gdp: '$26.9 Trillion', inflation: '3.1%', trade: ['India', 'China'] },
  China: { gdp: '$17.7 Trillion', inflation: '-0.8%', trade: ['USA', 'Russia'] },
  Russia: { gdp: '$2.2 Trillion', inflation: '7.4%', trade: ['India', 'China'] },
};

const glassClasses = "bg-panelBg backdrop-blur-[12px] border border-panelBorder rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all duration-300 ease-in-out hover:-translate-y-[2px] hover:shadow-[0_12px_40px_0_rgba(0,0,0,0.4)]";
const btnClasses = "bg-accentBlue text-black py-3 px-6 rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 w-full hover:bg-[#79c0ff] hover:shadow-[0_0_15px_rgba(88,166,255,0.4)]";

// --- SUB-COMPONENTS ---
const GraphView = () => {
  return (
    <div className={`flex items-center justify-center relative overflow-hidden h-full ${glassClasses}`}>
      <svg width="400" height="300" viewBox="0 0 400 300">
        {/* Edges */}
        <line x1="200" y1="200" x2="100" y2="100" className="stroke-panelBorder border-2 transition-all duration-300 hover:stroke-accentBlue hover:border-[3px]" />
        <line x1="200" y1="200" x2="300" y2="100" className="stroke-panelBorder border-2 transition-all duration-300 hover:stroke-accentBlue hover:border-[3px]" strokeDasharray="5,5" />
        <line x1="200" y1="200" x2="200" y2="50" className="stroke-panelBorder border-2 transition-all duration-300 hover:stroke-accentBlue hover:border-[3px]" />
        <line x1="100" y1="100" x2="300" y2="100" className="stroke-panelBorder border-2 transition-all duration-300 hover:stroke-accentBlue hover:border-[3px]" />

        {/* Labels for edges (simplified) */}
        <text x="130" y="140" className="font-inter text-[11px] fill-[#8b949e] select-none bg-background">Trade</text>
        <text x="260" y="140" className="font-inter text-[11px] fill-[#8b949e] select-none bg-background">Tension</text>
        <text x="180" y="125" className="font-inter text-[11px] fill-[#8b949e] select-none bg-background">Alliance</text>

        {/* Nodes */}
        <g className="cursor-pointer transition-all duration-300 ease-in-out hover:[&>circle]:drop-shadow-[0_0_12px_rgba(88,166,255,0.6)]" transform="translate(200, 200)">
          <circle r="30" fill="#238636" className="transition-all duration-300" />
          <text textAnchor="middle" dy=".3em" className="font-inter text-sm font-semibold fill-foreground select-none">India</text>
        </g>
        <g className="cursor-pointer transition-all duration-300 ease-in-out hover:[&>circle]:drop-shadow-[0_0_12px_rgba(88,166,255,0.6)]" transform="translate(100, 100)">
          <circle r="25" fill="#58a6ff" className="transition-all duration-300" />
          <text textAnchor="middle" dy=".3em" className="font-inter text-sm font-semibold fill-foreground select-none">USA</text>
        </g>
        <g className="cursor-pointer transition-all duration-300 ease-in-out hover:[&>circle]:drop-shadow-[0_0_12px_rgba(88,166,255,0.6)]" transform="translate(300, 100)">
          <circle r="28" fill="#da3633" className="transition-all duration-300" />
          <text textAnchor="middle" dy=".3em" className="font-inter text-sm font-semibold fill-foreground select-none">China</text>
        </g>
        <g className="cursor-pointer transition-all duration-300 ease-in-out hover:[&>circle]:drop-shadow-[0_0_12px_rgba(88,166,255,0.6)]" transform="translate(200, 50)">
          <circle r="25" fill="#d29922" className="transition-all duration-300" />
          <text textAnchor="middle" dy=".3em" className="font-inter text-sm font-semibold fill-foreground select-none">Russia</text>
        </g>
      </svg>
    </div>
  );
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Simulation State
  const [oilIncrease, setOilIncrease] = useState(0);
  const [riskScore, setRiskScore] = useState(INITIAL_RISK_SCORE);
  const [currentInflation, setCurrentInflation] = useState(BASE_INFLATION);
  const [isSimulating, setIsSimulating] = useState(false);

  const getRiskLabel = (score: number) => {
    if (score <= 30) return { label: 'LOW', classText: 'text-statusSuccess' };
    if (score <= 60) return { label: 'MEDIUM', classText: 'text-statusWarning' };
    return { label: 'HIGH', classText: 'text-statusDanger' };
  };

  const riskInfo = getRiskLabel(riskScore);

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      // Logic: 20% oil increase -> +2% inflation, +10 risk score
      const addedInflation = (oilIncrease / 20) * 2;
      const addedRisk = (oilIncrease / 20) * 10;
      
      setCurrentInflation(BASE_INFLATION + addedInflation);
      setRiskScore(INITIAL_RISK_SCORE + addedRisk);
      setIsSimulating(false);
    }, 800);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[linear-gradient(135deg,#0d1117_0%,#161b22_100%)] text-foreground font-inter">
      {/* Sidebar */}
      <aside className="flex flex-col p-8 border-r border-panelBorder bg-[#0d1117]/80 backdrop-blur-md z-10 w-full md:w-[280px]">
        <h1 className="text-xl font-bold mb-10 leading-tight bg-[linear-gradient(90deg,#58a6ff,#a371f7)] bg-clip-text text-transparent w-fit">
          Mini Global<br/>Intelligence Graph
        </h1>
        <div className="flex flex-col gap-3">
          <div 
            className={`flex items-center gap-3 py-3 px-4 rounded-lg cursor-pointer transition-all duration-200 font-medium ${
              activeTab === 'overview' 
                ? 'text-foreground bg-accentBlue/15 border-l-4 border-accentBlue' 
                : 'text-[#8b949e] hover:text-foreground hover:bg-white/5 border-l-4 border-transparent'
            }`} 
            onClick={() => setActiveTab('overview')}
          >
            <LayoutDashboard size={20} />
            <span>Overview</span>
          </div>
          <div 
            className={`flex items-center gap-3 py-3 px-4 rounded-lg cursor-pointer transition-all duration-200 font-medium ${
              activeTab === 'country' 
                ? 'text-foreground bg-accentBlue/15 border-l-4 border-accentBlue' 
                : 'text-[#8b949e] hover:text-foreground hover:bg-white/5 border-l-4 border-transparent'
            }`} 
            onClick={() => setActiveTab('country')}
          >
            <Globe size={20} />
            <span>Country Details</span>
          </div>
          <div 
            className={`flex items-center gap-3 py-3 px-4 rounded-lg cursor-pointer transition-all duration-200 font-medium ${
              activeTab === 'simulation' 
                ? 'text-foreground bg-accentBlue/15 border-l-4 border-accentBlue' 
                : 'text-[#8b949e] hover:text-foreground hover:bg-white/5 border-l-4 border-transparent'
            }`} 
            onClick={() => setActiveTab('simulation')}
          >
            <Activity size={20} />
            <span>What-If Simulation</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto relative w-full">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-3xl font-semibold">
            {activeTab === 'overview' && 'Global Dashboard'}
            {activeTab === 'country' && 'Country Intelligence'}
            {activeTab === 'simulation' && 'Risk Simulation Engine'}
          </h2>
          <div className={`${glassClasses} p-2! px-4! rounded-full! flex items-center gap-2 max-h-min`}>
            <span className="text-xs text-[#8b949e]">System Status: </span>
            <span className="text-statusSuccess font-bold text-xs">● ACTIVE</span>
          </div>
        </div>

        {/* Page 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-[2fr_1fr] flex-col gap-6 h-auto md:h-[calc(100%-60px)]">
            <GraphView />
            
            <div className="flex flex-col gap-6 h-full">
              <div className={`flex flex-col items-center justify-center text-center ${glassClasses}`}>
                <AlertTriangle 
                  size={32} 
                  color={riskInfo.classText === 'text-statusDanger' ? '#da3633' : '#d29922'} 
                  className={riskScore > 60 ? "animate-pulseRed" : ""}
                />
                <div className={`mt-4 text-lg font-semibold tracking-widest uppercase ${riskInfo.classText}`}>
                  {riskInfo.label} RISK
                </div>
                <div className={`text-[64px] font-bold leading-none my-4 transition-colors duration-500 ${riskInfo.classText} ${riskScore > 60 ? 'animate-pulseRed' : ''}`}>
                  {Math.round(riskScore)}
                </div>
                <div className="text-xs text-[#8b949e]">
                  Composite Geopolitical index
                </div>
              </div>

              <div className={`flex-1 flex flex-col overflow-hidden min-h-[300px] ${glassClasses}`}>
                <div className="font-semibold mb-4 pb-2 border-b border-panelBorder flex items-center gap-2">
                  <TrendingUp size={16} /> Live Intel Feed
                </div>
                <ul className="flex flex-col gap-3 overflow-y-auto pr-2 news-list-scrollbar">
                  {MOCK_NEWS.map(news => (
                    <li key={news.id} className="p-3 bg-white/5 rounded-lg transition-colors hover:bg-white/10 animate-fadeIn cursor-pointer">
                      <div className="flex justify-between text-xs text-[#8b949e] mb-[6px]">
                        <span>Source: AI Extraction</span>
                        <span>{news.time}</span>
                      </div>
                      <div className="text-sm leading-tight text-foreground">{news.title}</div>
                      <span className={`inline-block text-[11px] px-2 py-0.5 rounded mt-2 font-medium ${
                        news.sentiment === 'negative' ? 'bg-statusDanger/20 text-[#ff7b72]' :
                        news.sentiment === 'positive' ? 'bg-statusSuccess/20 text-[#7ee787]' :
                        'bg-[#8b949e]/20 text-[#8b949e]'
                      }`}>
                        {news.sentiment.toUpperCase()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Page 2: Country Details */}
        {activeTab === 'country' && (
          <div className={`${glassClasses} animate-fadeIn`}>
            <h3 className="mb-4 text-accentBlue font-medium text-lg">Economic & Geopolitical Metrics</h3>
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-3 px-4 text-left text-[#8b949e] font-medium border-b border-panelBorder">Country Nodes</th>
                    <th className="p-3 px-4 text-left text-[#8b949e] font-medium border-b border-panelBorder">Real GDP</th>
                    <th className="p-3 px-4 text-left text-[#8b949e] font-medium border-b border-panelBorder">Real Inflation</th>
                    <th className="p-3 px-4 text-left text-[#8b949e] font-medium border-b border-panelBorder">Key Trade Connections</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(COUNTRY_DATA).map(([country, data]) => (
                    <tr key={country} className="hover:bg-white/5 transition-colors group">
                      <td className="p-3 px-4 font-bold border-b border-panelBorder group-last:border-none">{country}</td>
                      <td className="p-3 px-4 border-b border-panelBorder group-last:border-none">{data.gdp}</td>
                      <td className="p-3 px-4 border-b border-panelBorder group-last:border-none">
                        {country === 'India' ? currentInflation.toFixed(1) + '%' : data.inflation}
                      </td>
                      <td className="p-3 px-4 border-b border-panelBorder group-last:border-none text-sm text-[#8b949e]">
                        {data.trade.join(', ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Page 3: Simulation */}
        {activeTab === 'simulation' && (
          <div className={`${glassClasses} max-w-[600px] mx-auto animate-fadeIn mt-10`}>
            <h3 className="mb-2 text-accentBlue font-semibold text-xl">Rule-Based Scenario Testing</h3>
            <p className="text-sm text-[#8b949e] mb-8">
              Adjust macro-variables to observe ripple effects across the knowledge graph domain agents.
            </p>

            <div className="my-8">
              <div className="flex justify-between mb-4 font-medium">
                <span>Global Oil Price Shock</span>
                <span className="text-accentBlue font-bold text-lg">+{oilIncrease}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="50" 
                step="5" 
                value={oilIncrease} 
                onChange={(e) => setOilIncrease(Number(e.target.value))} 
                className="w-full bg-transparent appearance-none focus:outline-none custom-slider"
              />
              <div className="flex justify-between text-xs text-[#8b949e] mt-3 font-medium">
                <span>Baseline (0%)</span>
                <span>Severe (+50%)</span>
              </div>
            </div>

            <div className="p-5 bg-black/20 rounded-xl mb-6 border border-white/5">
              <h4 className="text-sm mb-4 text-[#8b949e] font-medium">Projected Ripple Effects (India Agents Output):</h4>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm">Inflation Trigger (Econ-Agent):</span>
                <span className={`font-bold text-lg ${oilIncrease > 0 ? 'text-statusWarning' : 'text-foreground'}`}>
                  +{((oilIncrease / 20) * 2).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Overall Risk Spike (Security-Agent):</span>
                <span className={`font-bold text-lg ${oilIncrease > 0 ? 'text-statusDanger' : 'text-foreground'}`}>
                  +{((oilIncrease / 20) * 10).toFixed(0)} pts
                </span>
              </div>
            </div>

            <button className={btnClasses} onClick={handleSimulate}>
              {isSimulating ? 'Running Agents...' : 'Run Simulation'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
