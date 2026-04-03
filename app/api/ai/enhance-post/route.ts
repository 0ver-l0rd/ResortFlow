import { NextResponse } from "next/server";
import { geminiModel } from "@/lib/ai";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content } = await request.json();

    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "Invalid content format" }, { status: 400 });
    }

    const prompt = `
You are an elite, top-tier social media marketer and copywriter.
Take the following draft post and drastically enhance it to drive maximum engagement, virality, and conversion.
Apply expert copywriting psychology, format it with modern spacing, and seamlessly integrate proper, modern emojis, standard symbols, and well-researched, highly relevant hashtags.
Ensure the grammatical structure is flawless and the tone deeply resonates with a modern audience.
Do not wrap your response in quotes, just provide the expertly crafted, ready-to-publish text directly.

Draft:
${content}
    `;

    const result = await geminiModel.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ enhancedContent: text.trim() });
  } catch (error) {
    console.error("AI Enhance Error:", error);
    return NextResponse.json(
      { error: "Failed to enhance post using AI" },
      { status: 500 }
    );
  }
}
