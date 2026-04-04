import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { generateTextSafe } from "@/lib/ai";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, primaryPlatform } = await request.json();

    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "Invalid content format" }, { status: 400 });
    }

    const platformRules: Record<string, string> = {
      twitter: "- Rewrite for extreme brevity and 'X' punchiness.\n- Max 280 characters.\n- Use curiosity-driven hooks.\n- Max 2 hashtags at the end.",
      instagram: "- Enhance for visual storytelling and community engagement.\n- Use frequent emojis to guide the eye.\n- Add a strategic block of 10-15 hashtags at the bottom.\n- Use a personable, lifestyle-friendly tone.",
      linkedin: "- Refactor for a professional, thought-leadership status.\n- Maximize whitespace (line breaks between every 1-2 sentences).\n- Use 3-5 professional hashtags.\n- Ensure the tone is authoritative yet approachable.",
      facebook: "- Enhance for community discussion and high shareability.\n- Use accessible, warm language.\n- Moderate emoji usage.",
      tiktok: "- Refactor as a trending video description.\n- Focus on the 'HOOK' in the first 5 words.\n- Use TikTok-inspired slang and formatting.",
      youtube: "- Refactor as a search-optimized video description.\n- Use relevant keywords and a professional yet high-energy CTA.",
      general: "- Refine for standard social media excellence.\n- Improve flow, grammar, and engagement psychology."
    };

    const targetPlatform = primaryPlatform || "general";
    const rule = platformRules[targetPlatform] || platformRules.general;

    const prompt = `
You are a master-level social media copywriter and growth hacker.
Take the following draft and drastically enhance it specifically for the ${targetPlatform.toUpperCase()} platform.

### PLATFORM SPECIFIC RULES:
${rule}

### GLOBAL ENHANCEMENT RULES:
- Apply high-conversion copywriting frameworks (AIDA/PAS).
- Use intentional line breaks and modern spacing for readability.
- Integrate modern emojis and symbols naturally and strategically.
- Ensure the tone matches the ${targetPlatform || "general"} audience.
- Do NOT include any meta-text, quotes, or markdown wrappers. Return ONLY the enhanced post text.

### DRAFT TO ENHANCE:
${content}
    `;

    const enhancedText = await generateTextSafe(prompt);

    return NextResponse.json({ enhancedContent: enhancedText.trim() });
  } catch (error) {
    console.error("AI Enhance Error:", error);
    return NextResponse.json(
      { error: "Failed to enhance post using AI" },
      { status: 500 }
    );
  }
}
