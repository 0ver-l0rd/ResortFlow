import { NextResponse } from "next/server";
import { generateTextSafe } from "@/lib/ai";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { topic, platforms, tone, primaryPlatform } = await request.json();

    if (!topic || typeof topic !== "string") {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const targetPlatform = primaryPlatform || (platforms && platforms.length > 0 ? platforms[0] : "general");

    const platformRules: Record<string, string> = {
      twitter: "- Keep it under 280 characters.\n- Use a strong 'X' hook (controvserial, curiosity-driven, or extreme brevity).\n- Use exactly 1-2 trending hashtags at the very end.\n- Maximize viral potential through punchy sentences.",
      instagram: "- Focus on visual storytelling and 'lifestyle' vibes.\n- Use frequent emojis to separate thoughts.\n- Place a large block of 10-15 relevant hashtags separated by dots at the bottom.\n- Use a conversational, friendly community-focused tone.",
      linkedin: "- Use a professional, executive authority tone.\n- Focus on 'Insights' and 'Value Add'.\n- Use extreme whitespace (single sentences per paragraph).\n- Use 3-5 professional hashtags (e.g., #Strategy #Leadership).\n- Feature a clear, professional Call to Action.",
      facebook: "- Focus on community and storytelling.\n- Medium-length paragraphs.\n- Higher focus on shared experiences and family/business community vibes.",
      tiktok: "- Write a high-energy video description.\n- Focus on the 'HOOK' in the first 3 words.\n- Use TikTok-specific slang and trending emoji styles.\n- Use 5-7 trending hashtags.",
      youtube: "- Write a search-optimized video description.\n- Use keywords in the first sentence.\n- Include a 'Subscribe' and 'Watch More' naturally in the CTA.",
      general: "- Standard engaging social media post format.\n- 2-3 hashtags and moderate emoji usage."
    };

    const rule = platformRules[targetPlatform] || platformRules.general;

    const toneDesc = tone ? `Tone: ${tone}.` : "Tone: friendly and engaging.";
    
    const prompt = `
You are a world-class social media viral mastermind and expert copywriter.
Write an exceptionally engaging, high-conversion post about the following topic.

### PLATFORM CONTEXT: ${targetPlatform.toUpperCase()}
${rule}

### CORE INSTRUCTIONS:
- Tone: ${toneDesc}
- Apply master-level copywriting psychology (AIDA, PAS, or Bridge-to-Gap).
- Format smartly with modern spacing and intentional line breaks for readability.
- Integrate modern, relevant emojis and symbols naturally.
- Ensure the post is highly shareable and features a compelling call-to-action (CTA).
- Do NOT include any meta-text, explanations, or quotes. Return only the raw post text.

### TOPIC:
${topic}
    `;

    const generatedContent = await generateTextSafe(prompt);

    return NextResponse.json({ content: generatedContent.trim() });
  } catch (error) {
    console.error("AI Generate Post Error:", error);
    return NextResponse.json({ error: "Failed to generate post" }, { status: 500 });
  }
}
