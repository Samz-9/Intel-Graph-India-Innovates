import { NextResponse } from 'next/server';
import NewsAPI from 'newsapi';

const newsapi = new NewsAPI(process.env.NEWS_API_KEY);

const countries = ['in', 'us', 'cn', 'ru'];

export async function GET() {
  try {
    let articles: Array<{ id: string, title: string, source: string, time: Date, sentiment: string, country: string }> = [];

    // 🔥 Fetch all countries in parallel
    const responses = await Promise.allSettled(
      countries.map(c =>
        newsapi.v2.topHeadlines({
          country: c,
          category: 'general',
          language: 'en',
          pageSize: 10,
        })
      )
    );

    // 🧠 Merge + format
    responses.forEach((res, idx) => {
      if (res.status === 'fulfilled') {
        const data = res.value;

        const mapped = ((data.articles as Array<{ title?: string; source?: { name?: string }; publishedAt?: string }>) || []).map((a, i: number) => ({
          id: `${countries[idx]}-${i}`,
          title: a.title,
          source: a.source?.name || "Unknown",
          time: new Date(a.publishedAt),
          sentiment: getSentiment(a.title || ""),
          country: countries[idx].toUpperCase(),
        }));

        articles.push(...mapped);
      }
    });

    // 🧠 Remove invalid / old news
    articles = articles.filter(a => {
      if (!a.time || isNaN(a.time.getTime())) return false;

      const diff = (Date.now() - a.time.getTime()) / (1000 * 60 * 60);
      return diff <= 24; // only last 24 hrs
    });

    // 🔥 Sort latest first
    articles.sort((a, b) => b.time.getTime() - a.time.getTime());

    // 🎯 Limit + format time
    const final = articles.slice(0, 20).map(a => ({
      ...a,
      time: formatTime(a.time),
    }));

    return NextResponse.json(final);

  } catch (err) {
    console.error(err);
    return NextResponse.json([]);
  }
}

/* ⏱ Time formatter */
function formatTime(date: Date) {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);

  if (diff < 60) return "just now";
  if (diff < 3600) return Math.floor(diff / 60) + " min ago";
  if (diff < 86400) return Math.floor(diff / 3600) + " hrs ago";
  return Math.floor(diff / 86400) + " days ago";
}

/* 🧠 Sentiment */
function getSentiment(title: string) {
  const t = title.toLowerCase();

  if (t.includes('growth') || t.includes('deal') || t.includes('agreement')) return 'positive';
  if (t.includes('war') || t.includes('tension') || t.includes('sanction')) return 'negative';
  return 'neutral';
}