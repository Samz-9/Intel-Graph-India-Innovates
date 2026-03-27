import { NextResponse } from 'next/server';

const API_KEY = process.env.NEWS_API_KEY;

const ALL_REGIONS = [
  { code: 'IN', term: 'India' },
  { code: 'US', term: '("United States" OR US)' },
  { code: 'CN', term: 'China' },
  { code: 'RU', term: 'Russia' }, 
  { code: 'ME', term: '("Middle East" OR Israel OR Iran)' }, 
  { code: 'DE', term: 'Germany' },
  { code: 'FR', term: 'France' }
];

interface NewsArticle {
  title: string;
  source?: { name?: string };
  publishedAt: string;
}

interface ProcessedArticle {
  id: string;
  title: string;
  source: string;
  time: Date;
  sentiment: string;
  country: string;
}

export async function GET() {
  try {
    let articles: ProcessedArticle[] = [];

    // Shuffle and pick 5 to conserve API quota and ensure diverse global news
    const shuffled = [...ALL_REGIONS].sort(() => 0.5 - Math.random());
    const selectedRegions = shuffled.slice(0, 5);

    const responses = await Promise.allSettled(
      selectedRegions.map(r => {
        const query = encodeURIComponent(`(${r.term}) AND (politics OR government OR military OR diplomacy OR geopolitics OR "foreign policy" OR relations) NOT (entertainment OR movie OR show OR celebrity OR gossip OR TV OR drama OR sports OR cricket OR actor OR actress OR tourism)`);
        return fetch(
          `https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=publishedAt&pageSize=10&apiKey=${API_KEY}`
        );
      })
    );

    const data = await Promise.all(
      responses.map(res =>
        res.status === 'fulfilled' ? res.value.json() : null
      )
    );

    data.forEach((d, idx) => {
      if (!d || !d.articles) return;

      const mapped = d.articles.map((a: NewsArticle, i: number) => ({
        id: `${selectedRegions[idx].code}-${i}`,
        title: a.title,
        source: a.source?.name || "Unknown",
        time: new Date(a.publishedAt),
        sentiment: getSentiment(a.title || ""),
        country: selectedRegions[idx].code,
      }));

      articles.push(...mapped);
    });

    const excludedKeywords = /movie|actor|actress|cinema|bollywood|hollywood|celebrity|gossip|entertainment|drama|cricket|sports|tourism|concert/i;

    const seenTitles = new Set<string>();

    // ✅ filter & deduplicate
    articles = articles.filter(a => {
      if (!a.time || isNaN(a.time.getTime())) return false;

      const diff = (Date.now() - a.time.getTime()) / (1000 * 60 * 60);
      if (diff > 72) return false;

      if (!a.title || a.title === '[Removed]' || excludedKeywords.test(a.title)) return false;

      // Deduplicate by normalized title
      const normalizedTitle = a.title.toLowerCase().trim();
      if (seenTitles.has(normalizedTitle)) return false;
      seenTitles.add(normalizedTitle);

      return true;
    });

    // sort latest
    articles.sort((a, b) => b.time - a.time);

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

/* time */
function formatTime(date: Date) {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);

  if (diff < 60) return "just now";
  if (diff < 3600) return Math.floor(diff / 60) + " min ago";
  if (diff < 86400) return Math.floor(diff / 3600) + " hrs ago";
  return Math.floor(diff / 86400) + " days ago";
}

/* sentiment */
function getSentiment(title: string) {
  const t = title.toLowerCase();

  if (t.includes('growth') || t.includes('deal') || t.includes('pact') || t.includes('alliance')) return 'positive';
  if (t.includes('war') || t.includes('tension') || t.includes('sanction') || t.includes('military') || t.includes('threat')) return 'negative';
  return 'neutral';
}