import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.warn("[OpenAI] OPENAI_API_KEY is not set.");
}

export const openai = new OpenAI({ apiKey });

/**
 * Simple text generation using GPT-4o-mini (cheap + fast for content tasks)
 */
export async function generateText(prompt: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 1024,
    temperature: 0.7,
  });
  return response.choices[0]?.message?.content?.trim() ?? "";
}
