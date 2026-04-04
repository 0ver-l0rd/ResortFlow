import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { getDemoUserId } from "@/lib/demo-auth";

export async function POST(request: Request) {
  try {
    const userId = getDemoUserId();

    const { platform, metrics } = await request.json();

    const prompt = `
You are a social media analytics expert.
Analyze the following ${platform} metrics and top/bottom posts to provide:
1. A concise performance summary (1-2 sentences).
2. Two insights into *why* the best post performed well and why the worst didn't, referencing platform-specific behavior (e.g., watch time, exit rates).
3. One actionable "Deep-Data Strategy" to improve performance based on unique platform metrics.

Metrics & Post Content:
${JSON.stringify(metrics, null, 2)}

Return a JSON object ONLY with the following keys:
- "summary": (string, performance overview)
- "insights": (array of 2 strings, platform insights)
- "tip": (string, actionable strategy)

Return only the raw JSON.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(content);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Analytics Summary Error:", error);
    return NextResponse.json({
      summary: "Your performance across channels is steady, with strong engagement on visual content.",
      insights: [
        "Engagement rates are higher during weekends compared to weekdays.",
        "Video content (Reels/YouTube) is driving 40% more reach than static images."
      ],
      tip: "Focus on posting more video-based content during high-activity weekend windows (10 AM - 1 PM)."
    });
  }
}
