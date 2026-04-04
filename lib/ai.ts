import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";

// Initialize the Google Generative AI client
export const genAI = new GoogleGenerativeAI(apiKey);

// Primary and Secondary models for resilience
const PRIMARY_MODEL = "gemini-flash-latest";
const SECONDARY_MODEL = "gemini-2.5-flash-image";

export const geminiModel = genAI.getGenerativeModel({ model: PRIMARY_MODEL });

/**
 * Resilient text generation with automatic fallback
 */
export async function generateTextSafe(prompt: string) {
  try {
    // Try Primary (High demand/latest)
    const model = genAI.getGenerativeModel({ model: PRIMARY_MODEL });
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error: any) {
    console.error(`AI Error (${PRIMARY_MODEL}):`, error.message);
    
    // If it's a 503, 404, or 429, try the secondary
    if (error.status === 503 || error.status === 404 || error.status === 429 || error.message?.includes("503")) {
      console.log(`Switching to fallback model: ${SECONDARY_MODEL}`);
      try {
        const model = genAI.getGenerativeModel({ model: SECONDARY_MODEL });
        const result = await model.generateContent(prompt);
        return result.response.text().trim();
      } catch (fallbackError: any) {
        console.error(`AI Error (${SECONDARY_MODEL}):`, fallbackError.message);
        throw fallbackError;
      }
    }
    throw error;
  }
}

export async function generateAutoReply(commentText: string, aiPrompt: string) {
  const prompt = `
    User Prompt/Persona: ${aiPrompt}
    
    Incoming Comment: "${commentText}"
    
    Please draft a short, helpful, and natural-sounding reply according to the persona above.
    Do not include any headers or metadata, just the reply text itself.
  `;

  return generateTextSafe(prompt);
}
