import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";

// Initialize the Google Generative AI client
export const genAI = new GoogleGenerativeAI(apiKey);

// Default model to use for Gemini API
// Improved model identifier for recent SDK versions
export const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

export async function generateAutoReply(commentText: string, aiPrompt: string) {
  const prompt = `
    User Prompt/Persona: ${aiPrompt}
    
    Incoming Comment: "${commentText}"
    
    Please draft a short, helpful, and natural-sounding reply according to the persona above.
    Do not include any headers or metadata, just the reply text itself.
  `;

  const result = await geminiModel.generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
}
