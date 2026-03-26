'use client';
import { motion } from 'framer-motion';
import { Radio } from 'lucide-react';
import { useState, useEffect } from 'react';

// MOCK_NEWS removed since API is integrated

const sentimentStyles: Record<string, string> = {
  positive: 'bg-statusSuccess/20 text-[#7ee787]',
  negative: 'bg-statusDanger/20 text-[#ff7b72]',
  neutral: 'bg-[#8b949e]/20 text-[#8b949e]',
};

interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  sentiment: string;
  country: string;
}

export function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = () => {
      fetch('/api/news')
        .then(res => res.json())
        .then(data => {
          setNews(data);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    };

  fetchNews();

  const interval = setInterval(fetchNews, 30000); // every 30 sec

  return () => clearInterval(interval);
}, []);

  return (
    <div className="glass-panel flex flex-col flex-1 overflow-hidden">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-panelBorder">
        <Radio size={14} className="text-statusDanger animate-pulse" />
        <span className="font-semibold text-sm tracking-wide">Live Intel Feed</span>
        <span className="ml-auto text-[10px] text-[#8b949e] font-mono">AI EXTRACTED</span>
      </div>
      <ul className="flex flex-col gap-3 overflow-y-auto news-list-scrollbar pr-1">
        {isLoading ? (
          <div className="flex items-center justify-center p-6 mt-4">
            <span className="text-[#8b949e] text-xs font-mono animate-pulse tracking-widest">FETCHING LIVE INTEL...</span>
          </div>
        ) : (
          Array.isArray(news) && news.map((item, i) => (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="p-3 bg-white/3 border border-panelBorder rounded-xl hover:bg-white/7 transition-colors cursor-pointer group"
            >
              <div className="flex justify-between items-center text-[11px] text-[#8b949e] mb-1.5 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="text-sm">
                    {item.country === 'IN' && '🇮🇳'}
                    {item.country === 'US' && '🇺🇸'}
                    {item.country === 'CN' && '🇨🇳'}
                    {item.country === 'RU' && '🇷🇺'}
                  </span>
                  {item.source}
                </span>
                <span className="opacity-70 group-hover:opacity-100 transition-opacity">{item.time}</span>
              </div>
              <p className="text-[13px] leading-relaxed text-foreground mb-3">{item.title}</p>
              
              <div className="flex items-center gap-2">
                <span className={`inline-block text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest ${sentimentStyles[item.sentiment] || sentimentStyles.neutral}`}>
                  {item.sentiment}
                </span>
                <span className="inline-block text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest bg-white/5 text-[#8b949e] border border-white/5">
                  {item.country}
                </span>
              </div>
            </motion.li>
          ))
        )}
      </ul>
    </div>
  );
}
