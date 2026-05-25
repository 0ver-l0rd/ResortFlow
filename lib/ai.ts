import { openai } from "./openai";

/**
 * Standard text generation with resilience using OpenAI GPT-4o-mini.
 */
export async function generateTextSafe(prompt: string, model: "gpt-4o" | "gpt-4o-mini" = "gpt-4o-mini"): Promise<string> {
  const tryGenerate = async (attempt = 0): Promise<string> => {
    try {
      const response = await openai.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1500,
      });

      return response.choices[0]?.message?.content?.trim() ?? "";
    } catch (error: any) {
      const status = error.status ?? 0;
      const is429 = status === 429 || (error.message ?? "").includes("429");
      const isOverloaded = (error.message ?? "").includes("overloaded");

      if ((is429 || isOverloaded) && attempt < 3) {
        const delay = is429 ? 2000 * (attempt + 1) : 1000;
        console.warn(`[AI] OpenAI rate-limited (Attempt ${attempt + 1}), retrying in ${delay}ms...`);
        await new Promise(r => setTimeout(r, delay));
        return tryGenerate(attempt + 1);
      }
      throw error;
    }
  };

  return tryGenerate();
}

/**
 * Generate a hospitality-focused reply to a social media comment.
 */
export async function generateAutoReply(commentText: string, aiPrompt: string): Promise<string> {
  const prompt = `
You are a hospitality brand's social media manager.
Brand persona: ${aiPrompt}

A guest left this comment: "${commentText}"

Write a short, warm, professional reply (2–3 sentences max). No headers. No sign-offs.
  `.trim();

  return generateTextSafe(prompt);
}
