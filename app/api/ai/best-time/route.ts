import { NextResponse } from "next/server";
import { geminiModel } from "@/lib/ai";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { platforms } = await request.json();

    const platformDesc =
      platforms && platforms.length > 0
        ? `for ${platforms.join(", ")}`
        : "for general social media";

    const prompt = `
You are a social media analytics expert.
Based on general engagement patterns and best practices, suggest the single best date and time to post ${platformDesc} within the next 7 days.
Return a JSON object ONLY with no markdown, in this exact format:
{"datetime": "YYYY-MM-DDTHH:mm", "reason": "one sentence explanation"}
    `;

    const result = await geminiModel.generateContent(prompt);
    const text = result.response.text().trim();

    // Parse JSON safely
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI response");
    const parsed = JSON.parse(jsonMatch[0]);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Best Time Error:", error);
    // Fallback: suggest tomorrow at 10 AM
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    return NextResponse.json({
      datetime: tomorrow.toISOString().slice(0, 16),
      reason: "10 AM on weekdays typically sees high engagement.",
    });
  }
}
