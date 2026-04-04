import { generateTextSafe } from "../ai";

/**
 * Predict revenue for a given goal and platforms using AI (OpenAI gpt-4o-mini).
 */
export async function predictRevenue(
  goal: string,
  platforms: string[],
  segmentSize: number = 10000,
  historicalData: any = null
) {
  try {
    const prompt = `
You are a revenue intelligence AI for a hospitality brand.
Goal: "${goal}"
Platforms: ${platforms.join(", ")}
Target Audience Size: ${segmentSize}
${historicalData ? `Historical Performance: ${JSON.stringify(historicalData)}` : ""}

Analyze the market potential and predict the revenue outcomes (Low, Mid, High) for this campaign.
Consider typical hospitality conversion rates (1-4%) and average booking values ($200-$500).

Return a JSON object ONLY with the following keys:
- "low": (number, conservative estimate)
- "mid": (number, balanced estimate)
- "high": (number, optimistic estimate)
- "confidence": (string: "low", "medium", or "high")
- "reasoning": (string, 1-sentence logic)

Return only the raw JSON.
    `.trim();

    const response = await generateTextSafe(prompt);
    const parsed = JSON.parse(response);

    return {
      low: parsed.low || 0,
      mid: parsed.mid || 0,
      high: parsed.high || 0,
      confidence: parsed.confidence || "medium",
      reasoning: parsed.reasoning || "Predicted based on platform reach and hospitality industry benchmarks."
    };
  } catch (error) {
    console.error("[RevenuePredictor] AI prediction failed, falling back to heuristic:", error);
    
    // Heuristic Fallback (the original logic)
    const avgReachRate = 0.15;
    const baseReach = segmentSize * avgReachRate;
    const platformMultiplier = Math.max(1, platforms.length * 1.1);
    const estimatedReach = baseReach * platformMultiplier;
    
    let engagementRate = 0.05;
    let conversionRate = 0.02;
    const goalLower = goal.toLowerCase();
    if (goalLower.includes("sale") || goalLower.includes("deal") || goalLower.includes("discount")) {
      engagementRate += 0.02;
      conversionRate += 0.015;
    }
    const avgBookingValue = 250;

    const lowRevenue = Math.round(estimatedReach * engagementRate * 0.7 * conversionRate * 0.7 * avgBookingValue);
    const highRevenue = Math.round(estimatedReach * engagementRate * 1.3 * conversionRate * 1.3 * avgBookingValue);
    const midRevenue = Math.round((lowRevenue + highRevenue) / 2);

    return {
      low: lowRevenue,
      mid: midRevenue,
      high: highRevenue,
      confidence: "medium",
      reasoning: "Heuristic fallback used due to AI rate-limiting."
    };
  }
}
