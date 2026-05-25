import { NextRequest } from "next/server";
import { openai } from "@/lib/openai";
import { predictRevenue } from "@/lib/autopilot/revenue-predictor";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { goal, budget, deadline } = body;

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (event: string, data: any) => {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        };

        const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

        try {
          sendEvent("message", { status: "Analyzing your goal..." });
          await sleep(1000);
          
          const platforms = ["instagram", "twitter", "linkedin"];
          sendEvent("message", { status: "Identifying best platforms..." });
          await sleep(1000);
          
          const revenue = await predictRevenue(goal, platforms, 10000, null);
          
          sendEvent("message", { status: "Generating campaign content (GPT-4o)..." });

          if (!process.env.OPENAI_API_KEY) {
             console.warn("No OPENAI_API_KEY found, using mock plan.");
             await sleep(1500);
             sendEvent("plan", {
               predictedRevenue: revenue,
               posts: [
                 { platform: "instagram", content: `🚀 We are running a special deal: ${goal}! Check it out now.`, scheduledAt: new Date(Date.now() + 86400000).toISOString() },
                 { platform: "twitter", content: `Don't miss out on our latest update: ${goal}. Link in bio!`, scheduledAt: new Date(Date.now() + 172800000).toISOString() }
               ]
             });
             controller.close();
             return;
          }

          const prompt = `You are an expert marketing AI.
Goal: "${goal}"
Platforms: instagram, twitter, linkedin (Generate for ALL of these).
Budget: ${budget || 'Not specified'}
Deadline: ${deadline || 'Not specified'}

Tasks:
1. Create a 3-5 post campaign to achieve this goal.
2. Ensure at least one post for EACH of these platforms: instagram, twitter, linkedin.
3. Use highly engaging, platform-specific tones.

IMPORTANT: Return a JSON object with a SINGLE root key strictly named "posts" containing an array of post objects.
Each post object MUST have exactly these keys:
- "platform": (one of: instagram, twitter, linkedin)
- "content": (string, engaging text)
- "imagePrompt": (string, highly descriptive prompt for an AI image generator, e.g. "Luxury hotel room with mountain view, cinematic lighting")
- "scheduledAt": (ISO date string starting tomorrow, staggered by 6 hours)

Example:
{
  "posts": [
    { 
      "platform": "twitter", 
      "content": "Deal alert!", 
      "imagePrompt": "A person relaxing by a crystal clear resort pool, tropical sunset",
      "scheduledAt": "${new Date(Date.now() + 86400000).toISOString()}" 
    }
  ]
}

Return ONLY valid JSON. No markdown blocks.`;

          const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
          });

          const content = response.choices[0]?.message?.content || "{}";
          
          let parsedPlan;
          try {
             parsedPlan = JSON.parse(content);
          } catch (e) {
             console.error("Failed to parse AI plan:", content);
             parsedPlan = { posts: [] };
          }

          // Validation & Fallback for "empty stack" issues
          const posts = Array.isArray(parsedPlan.posts) ? parsedPlan.posts : [];
          if (posts.length === 0) {
            posts.push(
              { platform: "instagram", content: `🌟 New Deal: ${goal}! Check our bio for details. #Hospitality #Offers`, imagePrompt: `Luxury hotel lobby with elegant decor, high quality photography`, scheduledAt: new Date(Date.now() + 86400000).toISOString() },
              { platform: "twitter", content: `Don't miss out: ${goal}. Limited availability! 🏨✨`, imagePrompt: `Stunning swimming pool at a resort during golden hour`, scheduledAt: new Date(Date.now() + 108000000).toISOString() },
              { platform: "linkedin", content: `We are excited to announce our newest initiative: ${goal}. Read more on our site.`, imagePrompt: `Modern hotel meeting room, professional atmosphere`, scheduledAt: new Date(Date.now() + 129600000).toISOString() }
            );
          }

          const finalPlan = {
            predictedRevenue: revenue,
            posts: posts
          };
          
          sendEvent("plan", finalPlan);
          controller.close();
        } catch (e) {
          console.error("Autopilot Plan Stream Error:", e);
          sendEvent("error", { message: (e as Error).message });
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      }
    });
  } catch (err) {
    return new Response("Invalid request", { status: 400 });
  }
}
