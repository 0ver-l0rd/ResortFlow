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
You are an expert social media content creator.
Write a high-quality social media post about the following topic.
${toneDesc}
${platformDesc}
${charLimit}
Include relevant emojis, natural line breaks, and a call-to-action if appropriate.
Do NOT wrap your response in quotes or include any explanation — return only the post text.

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
