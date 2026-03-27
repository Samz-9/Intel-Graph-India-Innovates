/**
 * CORRECTED: 21st Century Aatmanirbhar (Self-Reliance) Engine
 * Accurately models US technological and energy dominance over developing nations.
 */

export async function getAccurateAatmanirbharScores() {
  const countryCodes = 'CHN;RUS;IND;USA';
  
  // The 5 True Pillars of Modern Sovereignty
  const indicators = {
    techRnD: 'GB.XPD.RSDV.GD.ZS',      // 1. Tech Sovereignty: R&D Expenditure (% of GDP)
    energyImports: 'EG.IMP.CONS.ZS',   // 2. Energy Independence: Net energy imports (% of energy use)
    manufacturing: 'NV.IND.MANF.ZS',   // 3. Production: Manufacturing (% of GDP)
    foodImports: 'TM.VAL.FOOD.ZS.UN',  // 4. Food Security: Food imports (% of merchandise imports)
    tradeBalancePct: 'NE.RSB.GNFS.ZS'  // 5. Supply Chain: Trade balance (% of GDP)
  };

  const getUrl = (indicator) => 
    `https://api.worldbank.org/v2/country/${countryCodes}/indicator/${indicator}?format=json&mrv=5&per_page=100`;

  const clamp = (val) => Math.max(0, Math.min(100, Math.round(val)));

  try {
    const responses = await Promise.all(
      Object.values(indicators).map(code => fetch(getUrl(code)))
    );

    const parsedData = await Promise.all(responses.map(res => res.json().catch(() => null)));
    const countryStats = {};
    const metricKeys = Object.keys(indicators);
    
    // Extract the latest values
    parsedData.forEach((dataBlock, index) => {
      const metricName = metricKeys[index];
      if (dataBlock && dataBlock[1]) {
        dataBlock[1].forEach(record => {
          const id = record.countryiso3code; 
          if (!countryStats[id]) countryStats[id] = { name: record.country.value };
          if (record.value !== null && countryStats[id][metricName] === undefined) {
            countryStats[id][metricName] = record.value;
          }
        });
      }
    });

    const finalFrontendData = [];

    // Calculate the accurate geopolitical scores
    Object.keys(countryStats).forEach(id => {
      const stat = countryStats[id];
      let score = 0;
      let breakdown = {
        tech: 0,
        energy: 0,
        manufacturing: 0,
        food: 0,
        trade: 0
      };
      
      // We check for techRnD and manufacturing as our base requirements
      if (stat.techRnD !== undefined && stat.manufacturing !== undefined) {
        
        // 1. Tech Sovereignty (Target: 3.5% of GDP spent on R&D is top-tier)
        const techScore = clamp((stat.techRnD / 3.5) * 100);
        
        // 2. Energy Independence (Inverted. Net Exporters < 0 get 100).
        const energyPct = stat.energyImports !== undefined ? stat.energyImports : 50; 
        const energyScore = energyPct <= 0 ? 100 : clamp(100 - energyPct);
        
        // 3. Manufacturing (Target: 25% of GDP)
        const mfgScore = clamp((stat.manufacturing / 25.0) * 100);
        
        // 4. Food Security (Target: Imports making up less than 15% of total goods)
        const foodPct = stat.foodImports !== undefined ? stat.foodImports : 10;
        const foodScore = clamp(100 - ((foodPct / 15.0) * 100));

        // 5. Trade Autonomy (-5% deficit = 0, +5% surplus = 100)
        const tradePct = stat.tradeBalancePct !== undefined ? stat.tradeBalancePct : 0;
        const tradeScore = clamp(((tradePct + 5) / 10.0) * 100);
        
        // Apply the new Strategic Weights
        score = clamp(
          (techScore * 0.30) +   // 30% Tech & IP
          (energyScore * 0.25) + // 25% Power/Fuel
          (mfgScore * 0.20) +    // 20% Physical Goods
          (foodScore * 0.15) +   // 15% Agriculture
          (tradeScore * 0.10)    // 10% Supply Chain Deficit
        );

        breakdown = {
          tech: techScore,
          energy: energyScore,
          manufacturing: mfgScore,
          food: foodScore,
          trade: tradeScore
        };
      }

      finalFrontendData.push({
        id: id,
        name: stat.name,
        score: score,
        breakdown: breakdown,
        raw: stat
      });
    });

    // Sort the array highest to lowest score to create a proper leaderboard
    finalFrontendData.sort((a, b) => b.score - a.score);

    return finalFrontendData;

  } catch (error) {
    console.error("Failed to fetch accurate scores:", error);
    return [];
  }
}