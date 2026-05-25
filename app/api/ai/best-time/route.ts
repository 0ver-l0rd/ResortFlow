import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { getDemoUserId } from "@/lib/demo-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const userId = getDemoUserId();

    const { platforms } = await request.json();

    const platformDesc =
      platforms && platforms.length > 0
        ? `for ${platforms.join(", ")}`
        : "for general social media";

    const prompt = `
You are a social media analytics expert.
Based on general engagement patterns and social media best practices, suggest the single best date and time to post ${platformDesc} within the next 7 days.
Return a JSON object ONLY with the following keys:
- "datetime": (string, ISO 8601 format e.g. "YYYY-MM-DDTHH:mm")
- "reason": (string, one sentence explaining why)

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
    console.error("Best Time Error:", error);
    // Safe fallback: suggest tomorrow at 10 AM
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    return NextResponse.json({
      datetime: tomorrow.toISOString().slice(0, 16),
      reason: "10 AM on weekdays typically sees high engagement across most social platforms.",
    });
  }
}
