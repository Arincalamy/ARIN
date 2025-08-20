import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might want to handle this more gracefully.
  // For this context, we assume the key is present.
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const FACT_CACHE_KEY = 'teamwater_fact_cache';
const FACT_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface FactCache {
  fact: string;
  timestamp: number;
}

export const getWaterFact = async (): Promise<string> => {
  try {
    const cachedItem = window.localStorage.getItem(FACT_CACHE_KEY);
    if (cachedItem) {
      const { fact, timestamp }: FactCache = JSON.parse(cachedItem);
      if (Date.now() - timestamp < FACT_CACHE_DURATION) {
        return fact;
      }
    }
  } catch (error) {
    console.error("Error reading fact from localStorage:", error);
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Tell me a short, surprising, and impactful fact about the global water crisis or the importance of clean water. Keep it to one powerful sentence.',
    });
    const fact = response.text.trim();
    try {
      const newCacheItem: FactCache = {
        fact,
        timestamp: Date.now(),
      };
      window.localStorage.setItem(FACT_CACHE_KEY, JSON.stringify(newCacheItem));
    } catch (error) {
      console.error("Error saving fact to localStorage:", error);
    }
    return fact;
  } catch (error) {
    console.error("Error fetching water fact from Gemini:", error);
    const fallbackFacts = [
        "Over 771 million people around the world lack basic access to clean and safe drinking water.",
        "Women and girls collectively spend an estimated 200 million hours carrying water every single day.",
        "Access to clean water is a key factor in reducing disease and improving educational outcomes for children.",
        "Every $1 invested in water and sanitation provides an average economic return of $4.",
        "Just a single dollar can often provide someone with clean water for an entire year."
    ];
    const randomIndex = Math.floor(Math.random() * fallbackFacts.length);
    return fallbackFacts[randomIndex];
  }
};

interface ThankYouMessageResult {
  message: string;
  success: boolean;
}

export const generateThankYouMessage = async (donorName: string, amount: number): Promise<ThankYouMessageResult> => {
  const maxRetries = 3;
  const initialDelay = 1000; // 1 second
  const fallbackMessage = `Thank you, ${donorName}! Your incredible donation of $${amount} will supply ${amount} years of clean water and create a ripple effect of hope. We are so grateful for your generosity!`;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const prompt = `Generate a short, heartfelt, and inspiring thank you message for a donor named ${donorName} who just donated $${amount} to provide clean water. Mention the impact of their donation in a tangible way (e.g., how many years of water it provides). Address them directly. Keep it to 2-3 encouraging sentences.`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return { message: response.text.trim(), success: true };
    } catch (error: any) {
      const errorMessage = String(error?.message || '');
      const isRateLimitError = errorMessage.includes('"code":429') || errorMessage.includes('RESOURCE_EXHAUSTED');
      
      if (isRateLimitError && attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt);
        console.warn(`Rate limit error encountered. Retrying in ${delay}ms... (Attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error("Error generating thank you message from Gemini:", error);
        // This will be the fallback if it's not a rate limit error or if all retries are exhausted.
        return { message: fallbackMessage, success: false };
      }
    }
  }

  // Fallback in case the loop finishes unexpectedly
  return { message: fallbackMessage, success: false };
};