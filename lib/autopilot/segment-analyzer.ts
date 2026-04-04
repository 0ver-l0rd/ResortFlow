import { generateTextSafe } from "../ai";

/**
 * Analyze an audience segment and provide AI-driven marketing strategies (OpenAI gpt-4o-mini).
 */
export async function analyzeSegment(
  segmentName: string,
  memberCount: number,
  avgRevenue: number,
  samples: { platform: string; engagementScore: number }[]
) {
  try {
    const prompt = `
You are an expert hospitality marketing strategist.
Analyze this audience segment and provide actionable insights.

Segment Name: "${segmentName}"
Total Members: ${memberCount}
Average Revenue per Member: $${avgRevenue}
Sample Member Data: ${JSON.stringify(samples)}

Provide a strategy to increase booking frequency and revenue for this specific group.
Consider the platforms they are on and their engagement levels.

Return a JSON object ONLY with the following keys:
- "summary": (string, 1-sentence overview of who this group is)
- "opportunity": (string, the biggest revenue opportunity for this group)
- "tactics": (array of 2 strings, platform-specific actions)
- "recommendedIncentive": (string, e.g. "Free spa credit" or "15% off midweek")

Return only the raw JSON.
    `.trim();

    const response = await generateTextSafe(prompt);
    return JSON.parse(response);
  } catch (error) {
    console.error("[SegmentAnalyzer] AI analysis failed:", error);
    return {
      summary: `A group of ${memberCount} members interested in ${segmentName}.`,
      opportunity: "Moderate potential for midweek upsells.",
      tactics: [
        "Retarget with story-based testimonials.",
        "Offer early access to holiday packages."
      ],
      recommendedIncentive: "10% discount on next stay"
    };
  }
}
