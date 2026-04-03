import { NextResponse } from "next/server";
import { geminiModel } from "@/lib/ai";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, platforms } = await request.json();

    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "Invalid content format" }, { status: 400 });
    }

    const platformContext = platforms && platforms.length > 0 
      ? `Tailor these hashtags for the following platforms: ${platforms.join(", ")}.` 
      : "";

    const prompt = `
You are an expert social media strategist.
Based on the following draft post, suggest 10 highly relevant and trending hashtags.
${platformContext}
Return ONLY a space-separated string of hashtags, for example: #marketing #growth #socialmedia
Do not include any other text or formatting.

Draft:
${content}
    `;

    const result = await geminiModel.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ hashtags: text.trim() });
  } catch (error) {
    console.error("AI Hashtag Error:", error);
    return NextResponse.json(
      { error: "Failed to suggest hashtags using AI" },
      { status: 500 }
    );
  }
}
