import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.INTERDEPENDENCY_API_KEY || '');

export const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export interface Relationship {
  source: string;
  target: string;
  type: string;
  description: string;
  intensity: number;
}

export interface InterdependencyData {
  relationships: Relationship[];
}

export const sampleInterdependencyText = `
The global economy is currently defined by the complex web between four major powers. 
The USA and China remain deeply intertwined, with America relying on Chinese manufacturing and 
China needing the massive US consumer market. Meanwhile, Western sanctions have severed almost 
all economic ties between the USA and Russia. This isolation has pushed Russia into a tight 
Energy-Manufacturing Axis with China. India maintains a Strategic Tech Partnership with the USA. 
However, India still heavily relies on China for industrial machinery. Interestingly, India has 
transitioned their historic arms-trade relationship with Russia into a heavy energy reliance.
`;

export async function fetchInterdependency(text: string = sampleInterdependencyText): Promise<InterdependencyData> {
  const prompt = `
    Analyze the following geopolitical text.
    Extract key bilateral relationships (economic, military, or diplomatic) between these countries: USA, China, India, Russia.
    Identify: source country, target country, type (e.g. Arms Trade, Energy Axis), description (1 sentence), and intensity (1 to 5).
    
    IMPORTANT: RETURN ONLY A RAW JSON OBJECT with a "relationships" key containing an array of these objects. 
    DO NOT INCLUDE ANY TEXT OUTSIDE THE JSON.
    
    TEXT:
    ${text}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let textResult = response.text().trim();
    
    // Improved JSON extraction in case AI includes markers
    const jsonMatch = textResult.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return JSON.parse(textResult);
  } catch (error) {
    console.error('Gemini extraction error:', error);
    return { relationships: [] };
  }
}
