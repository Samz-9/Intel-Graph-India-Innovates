'use client';
import { motion } from 'framer-motion';
import { TrendingUp, Radio } from 'lucide-react';

const MOCK_NEWS = [
  { id: 1, title: 'India and USA announce new semiconductor alliance to counter Chinese tech dominance', sentiment: 'positive' as const, time: '2 hours ago', source: 'Reuters' },
  { id: 2, title: 'Border tensions escalate between India and China along LAC in eastern sector', sentiment: 'negative' as const, time: '5 hours ago', source: 'Bloomberg' },
  { id: 3, title: 'Russia redirects 40% of oil exports toward Asian markets as Western sanctions bite', sentiment: 'neutral' as const, time: '8 hours ago', source: 'FT' },
  { id: 4, title: 'US imposes sweeping new tech trade restrictions targeting Chinese semiconductor firms', sentiment: 'negative' as const, time: '11 hours ago', source: 'WSJ' },
  { id: 5, title: 'India reports 7.2% GDP growth for Q3, beats IMF forecast by 1.1 percentage points', sentiment: 'positive' as const, time: '1 day ago', source: 'CNBC' },
  { id: 6, title: 'India-Russia rupee-ruble trade settlement reaches record $8B in FY25', sentiment: 'neutral' as const, time: '1 day ago', source: 'Mint' },
];

const sentimentStyles: Record<string, string> = {
  positive: 'bg-statusSuccess/20 text-[#7ee787]',
  negative: 'bg-statusDanger/20 text-[#ff7b72]',
  neutral: 'bg-[#8b949e]/20 text-[#8b949e]',
};

export function NewsFeed() {
  return (
    <div className="glass-panel flex flex-col flex-1 overflow-hidden">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-panelBorder">
        <Radio size={14} className="text-statusDanger animate-pulse" />
        <span className="font-semibold text-sm tracking-wide">Live Intel Feed</span>
        <span className="ml-auto text-[10px] text-[#8b949e] font-mono">AI EXTRACTED</span>
      </div>
      <ul className="flex flex-col gap-3 overflow-y-auto news-list-scrollbar pr-1">
        {MOCK_NEWS.map((news, i) => (
          <motion.li
            key={news.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="p-3 bg-white/3 border border-panelBorder rounded-xl hover:bg-white/7 transition-colors cursor-pointer"
          >
            <div className="flex justify-between text-[11px] text-[#8b949e] mb-1.5">
              <span className="font-medium">{news.source}</span>
              <span>{news.time}</span>
            </div>
            <p className="text-sm leading-snug text-foreground">{news.title}</p>
            <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full mt-2 font-semibold uppercase tracking-wider ${sentimentStyles[news.sentiment]}`}>
              {news.sentiment}
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
