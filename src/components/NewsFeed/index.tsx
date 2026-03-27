'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const sentimentColors: Record<string, { bg: string; text: string }> = {
  positive: { bg: 'rgba(46,160,67,0.15)', text: '#7ee787' },
  negative:  { bg: 'rgba(248,81,73,0.15)',  text: '#ff7b72' },
  neutral:   { bg: 'rgba(139,148,158,0.15)',text: '#8b949e' },
};

const flagMap: Record<string, string> = {
  IN: '🇮🇳', US: '🇺🇸', CN: '🇨🇳', RU: '🇷🇺',
  GB: '🇬🇧', EU: '🇪🇺', ME: '🌍', JP: '🇯🇵',
  DE: '🇩🇪', FR: '🇫🇷',
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
        .then(r => r.json())
        .then(data => { setNews(Array.isArray(data) ? data : []); setIsLoading(false); })
        .catch(() => setIsLoading(false));
    };
    fetchNews();
    const t = setInterval(fetchNews, 30000);
    return () => clearInterval(t);
  }, []);

  return (
    /* Outer wrapper fills 100% of whatever height the parent gives it */
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', padding: '12px 12px 12px 14px' }}>
      {/* Scrollable list */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, paddingRight: 4 }}>
        {isLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <span style={{ color: '#8b949e', fontSize: 11, fontFamily: 'monospace', letterSpacing: 3, animation: 'pulse 1.5s infinite' }}>
              FETCHING LIVE INTEL...
            </span>
          </div>
        ) : news.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <span style={{ color: '#8b949e', fontSize: 11, fontFamily: 'monospace', letterSpacing: 2 }}>NO INTEL AVAILABLE</span>
          </div>
        ) : news.map((item, i) => {
          const s = sentimentColors[item.sentiment] || sentimentColors.neutral;
          const flag = flagMap[item.country] || '🌐';
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.3 }}
              style={{
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.02)',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              {/* Top row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#8b949e', fontFamily: 'monospace' }}>
                  <span style={{ fontSize: 13 }}>{flag}</span>
                  {item.source}
                </span>
                <span style={{ fontSize: 9, color: '#8b949e66', fontFamily: 'monospace' }}>{item.time}</span>
              </div>

              {/* Title */}
              <p style={{ fontSize: 12, lineHeight: 1.5, color: 'rgba(240,246,252,0.88)', margin: '0 0 8px 0' }}>
                {item.title}
              </p>

              {/* Badges */}
              <div style={{ display: 'flex', gap: 6 }}>
                <span style={{
                  fontSize: 8, padding: '2px 8px', borderRadius: 20, fontWeight: 700,
                  letterSpacing: 1, textTransform: 'uppercase',
                  background: s.bg, color: s.text,
                }}>
                  {item.sentiment}
                </span>
                <span style={{
                  fontSize: 8, padding: '2px 8px', borderRadius: 20, fontWeight: 700,
                  letterSpacing: 1, textTransform: 'uppercase',
                  background: 'rgba(255,255,255,0.05)', color: '#8b949e',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  {item.country}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
