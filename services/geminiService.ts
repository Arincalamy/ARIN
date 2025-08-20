import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might want to handle this more gracefully.
  // For this context, we assume the key is present.
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getWaterFact = async (): Promise<string> => {
  try {
    const cachedFact = window.sessionStorage.getItem('teamwater_fact');
    if (cachedFact) {
      return cachedFact;
    }
  } catch (error) {
    console.error("Error reading fact from sessionStorage:", error);
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Tell me a short, surprising, and impactful fact about the global water crisis or the importance of clean water. Keep it to one powerful sentence.',
    });
    const fact = response.text.trim();
    try {
      window.sessionStorage.setItem('teamwater_fact', fact);
    } catch (error) {
      console.error("Error saving fact to sessionStorage:", error);
    }
    return fact;
  } catch (error) {
    console.error("Error fetching water fact from Gemini:", error);
    return "Every $1 donated provides one person with clean water for a year. Your contribution makes a world of difference.";
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