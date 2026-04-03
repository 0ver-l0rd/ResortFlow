import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";

// Initialize the Google Generative AI client
export const genAI = new GoogleGenerativeAI(apiKey);

// Default model to use for Gemini API
export const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
