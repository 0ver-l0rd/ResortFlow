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
Goal: ${goal}
Platforms: ${platforms.join(', ')}
Budget: ${budget || 'Not specified'}
Deadline: ${deadline || 'Not specified'}

Generate a JSON plan for a social media campaign with an array of "posts". Each post should have:
- "platform" (must be one of: instagram, twitter, linkedin)
- "content" (highly engaging, platform-specific text)
- "scheduledAt" (ISO date string in the future, staggered)

Return ONLY valid JSON data directly. No markdown code blocks.`;

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
             parsedPlan = {
               posts: [
                  { platform: "instagram", content: "Exciting news! " + goal, scheduledAt: new Date(Date.now() + 86400000).toISOString() }
               ]
             };
          }

          const finalPlan = {
            predictedRevenue: revenue,
            posts: parsedPlan.posts || []
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
