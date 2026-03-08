/**
 * AI Extractor (OpenAI-powered — requires OPENAI_API_KEY env var)
 * Falls back to mock data for hackathon demo without a key.
 */
export interface ExtractionResult {
  from: string;
  relation: string;
  to: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
}

const MOCK_EXTRACTIONS: ExtractionResult[] = [
  { from: 'India', relation: 'tension_with', to: 'China', sentiment: 'negative', confidence: 0.92 },
  { from: 'India', relation: 'trade_with', to: 'USA', sentiment: 'positive', confidence: 0.88 },
  { from: 'Russia', relation: 'trade_with', to: 'India', sentiment: 'neutral', confidence: 0.81 },
  { from: 'USA', relation: 'tension_with', to: 'China', sentiment: 'negative', confidence: 0.95 },
  { from: 'China', relation: 'alliance_with', to: 'Russia', sentiment: 'neutral', confidence: 0.77 },
];

export async function extractRelations(headlines: string[]): Promise<ExtractionResult[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // Return mock data when no OpenAI key is provided
    return MOCK_EXTRACTIONS;
  }

  try {
    const prompt = `
Extract geopolitical relationships from these news headlines.
For each headline, return JSON objects with this format:
{ "from": "Country", "relation": "tension_with|trade_with|alliance_with", "to": "Country", "sentiment": "positive|negative|neutral", "confidence": 0.0-1.0 }

Headlines:
${headlines.map((h, i) => `${i + 1}. ${h}`).join('\n')}

Return ONLY a JSON array.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? '[]';
    return JSON.parse(content) as ExtractionResult[];
  } catch {
    return MOCK_EXTRACTIONS;
  }
}
