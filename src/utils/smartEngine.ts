import { GoogleGenerativeAI } from '@google/generative-ai';
import type { RegionCode } from '../types';
import { CATEGORIES } from '../data/carbonData';
import type { UserFootprintData } from '../store/appStore';

// --- Carbon Footprint Calculation Engine ---

export function calculateFootprint(footprintData: UserFootprintData): Record<string, number> {
  const results: Record<string, number> = {};

  CATEGORIES.forEach(category => {
    let categoryTotal = 0;
    category.activities.forEach(activity => {
      const userInput = footprintData[category.id]?.[activity.id] || 0;
      categoryTotal += userInput * activity.emissionFactor;
    });
    results[category.id] = categoryTotal;
  });

  return results;
}

// --- Smart Chat Engine ---

type Intent = 'greeting' | 'thanks' | 'footprint' | 'tips' | 'general' | 'unknown';

const PATTERNS: Array<{ intent: Intent; keywords: string[] }> = [
  { intent: 'greeting', keywords: ['hello', 'hi', 'hey', 'good morning', 'namaste'] },
  { intent: 'thanks', keywords: ['thanks', 'thank you', 'appreciate', 'cheers'] },
  { intent: 'footprint', keywords: ['calculate', 'footprint', 'emissions', 'my impact'] },
  { intent: 'tips', keywords: ['reduce', 'tips', 'help', 'lower', 'improve'] },
];

function detectIntent(input: string): Intent {
  const lower = input.toLowerCase();
  for (const { intent, keywords } of PATTERNS) {
    if (keywords.some(kw => lower.includes(kw))) return intent;
  }
  return 'general';
}

const RESPONSES: Record<string, string> = {
  greeting: "👋 Hello! I'm your Carbon Footprint Guide. How can I help you understand or reduce your emissions today?",
  thanks: "😊 You're welcome! Let me know if you need any more tips.",
  unknown: "I'm not quite sure I understand. Could you rephrase your question about carbon emissions or footprint reduction?"
};

const DEFAULT_GEMINI_MODELS = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];
let geminiBlockedUntil = 0;

function isQuotaError(message: string): boolean {
  return /429|quota exceeded|rate limit|too many requests/i.test(message);
}

function parseRetryDelayMs(message: string): number {
  const retryInMatch = message.match(/retry in\s+([\d.]+)s/i);
  if (retryInMatch?.[1]) {
    return Math.ceil(Number(retryInMatch[1]) * 1000);
  }

  const retryDelayMatch = message.match(/"retryDelay":"(\d+)s"/i);
  if (retryDelayMatch?.[1]) {
    return Number(retryDelayMatch[1]) * 1000;
  }

  return 60_000;
}

function getGeminiModelCandidates(): string[] {
  const configuredModel = import.meta.env.VITE_GEMINI_MODEL?.trim();
  const candidates = configuredModel ? [configuredModel, ...DEFAULT_GEMINI_MODELS] : DEFAULT_GEMINI_MODELS;
  return [...new Set(candidates.filter(Boolean))];
}

export async function getSmartResponse(
  userInput: string,
  region: RegionCode,
  footprintData: UserFootprintData
): Promise<string> {
  const intent = detectIntent(userInput);
  
  // For basic conversational intents, use static responses for efficiency
  if (intent === 'greeting' || intent === 'thanks' || intent === 'unknown') {
    return RESPONSES[intent];
  }

  if (Date.now() < geminiBlockedUntil) {
    const waitSeconds = Math.max(1, Math.ceil((geminiBlockedUntil - Date.now()) / 1000));
    return `Gemini API quota is temporarily exhausted. Please retry in about ${waitSeconds}s. Meanwhile, review the Categories and Next Steps views for actionable guidance.`;
  }

  // Use Gemini for complex domain queries
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('API key missing. Please configure VITE_GEMINI_API_KEY in your .env file.');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelCandidates = getGeminiModelCandidates();

    const totalEmissions = calculateFootprint(footprintData);

    const context = `
      You are an expert Carbon Footprint AI Assistant. 
      The user is from region: ${region}.
      Their current footprint breakdown (in kg CO2e) is: ${JSON.stringify(totalEmissions)}.
      Provide concise, personalized, and actionable advice to reduce carbon emissions.
      Do not hallucinate external data if not relevant. Keep the response to 1-2 short paragraphs.
    `;

    const prompt = `${context}\n\nUser Question: ${userInput}`;

    for (const modelName of modelCandidates) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        if (text) {
          return text;
        }
      } catch (modelError) {
        const message = modelError instanceof Error ? modelError.message : String(modelError);
        const looksLikeMissingModel = /404|not found|not supported/i.test(message);

        if (!looksLikeMissingModel || modelName === modelCandidates[modelCandidates.length - 1]) {
          throw modelError;
        }
      }
    }

    return RESPONSES.unknown;
  } catch (error) {
    console.error('Gemini API Error:', error);
    const message = error instanceof Error ? error.message : String(error);

    if (isQuotaError(message)) {
      const retryDelayMs = parseRetryDelayMs(message);
      geminiBlockedUntil = Date.now() + retryDelayMs;
      const waitSeconds = Math.max(1, Math.ceil(retryDelayMs / 1000));
      return `Gemini API quota is exceeded for this project right now. Please retry in about ${waitSeconds}s, or enable billing / increase quota in Google AI Studio and regenerate the API key.`;
    }

    if (/404|not found|not supported/i.test(message)) {
      return "The configured Gemini model is not available for this API key. Set VITE_GEMINI_MODEL to a supported model for your project, rebuild, and redeploy.";
    }

    return "I'm having trouble connecting to my AI core right now. Please check your API key configuration. However, you can always check the Categories view for general reduction tips!";
  }
}

export function getTypingDelay(response: string): number {
  const words = response.split(' ').length;
  return Math.min(300 + words * 25, 1500);
}
