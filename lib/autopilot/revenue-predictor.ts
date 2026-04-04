export async function predictRevenue(
  goal: string,
  platforms: string[],
  segmentSize: number = 10000,
  historicalData: any = null
) {
  // Simplified heuristic logic simulating AI/algorithmic prediction
  // In a full implementation, you might pass these to Gemini for analysis.
  
  const avgReachRate = 0.15; // 15% of segment
  const baseReach = segmentSize * avgReachRate;
  
  const platformMultiplier = Math.max(1, platforms.length * 1.1);
  const estimatedReach = baseReach * platformMultiplier;

  let engagementRate = 0.05;
  let conversionRate = 0.02;

  // Adjust rates slightly based on goal keywords
  const goalLower = goal.toLowerCase();
  if (goalLower.includes("sale") || goalLower.includes("deal") || goalLower.includes("discount")) {
    engagementRate += 0.02;
    conversionRate += 0.015;
  }
  if (goalLower.includes("weekend") || goalLower.includes("soon")) {
    conversionRate += 0.01;
  }

  const avgBookingValue = 250; // default AOV

  // Calculate variations for low/mid/high
  const lowEngage = engagementRate * 0.7;
  const highEngage = engagementRate * 1.3;

  const lowConv = conversionRate * 0.7;
  const highConv = conversionRate * 1.3;

  const lowBookings = estimatedReach * lowEngage * lowConv;
  const highBookings = estimatedReach * highEngage * highConv;

  const lowRevenue = Math.round(lowBookings * avgBookingValue);
  const highRevenue = Math.round(highBookings * avgBookingValue);
  const midRevenue = Math.round((lowRevenue + highRevenue) / 2);

  return {
    low: lowRevenue,
    mid: midRevenue,
    high: highRevenue,
    confidence: "high"
  };
}
