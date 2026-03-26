declare module 'newsapi' {
  export default class NewsAPI {
    constructor(apiKey: string | undefined);
    v2: {
      topHeadlines(params: {
        country?: string;
        category?: string;
        language?: string;
        pageSize?: number;
      }): Promise<{
        status: string;
        totalResults: number;
        articles: Record<string, unknown>[];
      }>;
    };
  }
}
