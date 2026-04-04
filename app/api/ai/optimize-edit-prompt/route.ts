import { NextResponse } from "next/server";
import { generateTextSafe } from "@/lib/ai";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { rawPrompt } = await request.json();

    if (!rawPrompt || typeof rawPrompt !== "string") {
      return NextResponse.json({ error: "Search prompt is required" }, { status: 400 });
    }

    const prompt = `
You are a master of Generative AI prompt engineering for image editing.
Take the following raw user request and transform it into a single, highly descriptive, professional prompt optimized for an AI image modification engine (like ImageKit's generative edit).

### CORE RULES:
- Focus on photorealism and natural blending.
- Use descriptive keywords for lighting, texture, and anatomy.
- For requests like "change posture," describe the specific new pose clearly.
- Keep the result under 200 characters.
- Return ONLY the optimized prompt text. No explanations.

### USER REQUEST:
"${rawPrompt}"

### OPTIMIZED PROMPT:
    `;

    const text = await generateTextSafe(prompt);

    return NextResponse.json({ optimizedPrompt: text });
  } catch (error: any) {
    console.error("AI Optimize Prompt Error:", error);
    return NextResponse.json({ error: "Failed to optimize prompt", details: error.message }, { status: 500 });
  }
}
