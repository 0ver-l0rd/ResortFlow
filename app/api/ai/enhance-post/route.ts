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
You are an expert social media copywriter. 
Take the following draft post and enhance it to be more engaging, professional, and visually appealing. 
Fix any grammatical errors, optimize the tone depending on general social media best practices, and optionally add a couple of relevant emojis if there are none.
Do not wrap your response in quotes, just provide the improved text directly.

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
