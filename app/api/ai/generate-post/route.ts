import { NextResponse } from "next/server";
import { geminiModel } from "@/lib/ai";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { topic, platforms, tone } = await request.json();

    if (!topic || typeof topic !== "string") {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const toneDesc = tone ? `Tone: ${tone}.` : "Tone: friendly and engaging.";
    const platformDesc =
      platforms && platforms.length > 0
        ? `Optimize for: ${platforms.join(", ")}.`
        : "";

    const charLimit =
      platforms?.includes("twitter") ? "Keep it under 280 characters." : "";

    const prompt = `
You are an elite, top-tier social media marketer and content mastermind.
Write a highly engaging, viral-ready social media post about the following topic.
${toneDesc}
${platformDesc}
${charLimit}
Apply expert copywriting psychology, format it smartly with modern spacing and line breaks, and seamlessly integrate proper, modern emojis, relevant symbols, and trending, strategic hashtags.
Ensure the structure is highly converting and features a naturally compelling call-to-action to spark community interaction.
Do NOT wrap your response in quotes, markdown code blocks, or include any explanation — return only the exact post text ready for publishing.

Topic: ${topic}
    `;

    const result = await geminiModel.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ content: text.trim() });
  } catch (error) {
    console.error("AI Generate Post Error:", error);
    return NextResponse.json({ error: "Failed to generate post" }, { status: 500 });
  }
}
