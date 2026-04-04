import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { predictRevenue } from "@/lib/autopilot/revenue-predictor";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

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
          await sleep(1500);
          
          const platforms = ["instagram", "twitter", "linkedin"];
          sendEvent("message", { status: "Identifying best platforms..." });
          await sleep(1500);
          
          const revenue = await predictRevenue(goal, platforms, 10000, null);
          
          sendEvent("message", { status: "Generating campaign content..." });

          if (!process.env.GEMINI_API_KEY) {
             console.warn("No GEMINI_API_KEY found, using mock plan.");
             await sleep(2000);
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

          const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
          const prompt = `You are an expert marketing AI.
Goal: ${goal}
Platforms: ${platforms.join(', ')}
Budget: ${budget || 'Not specified'}
Deadline: ${deadline || 'Not specified'}

Generate a JSON plan for a social media campaign with an array of "posts". Each post should have "platform", "content", and "scheduledAt" (ISO date string in the future).
Return ONLY valid JSON data directly (no markdown blocks like \`\`\`json).`;

          const result = await model.generateContent(prompt);
          const text = result.response.text();
          
          let parsedPlan;
          try {
             const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
             parsedPlan = JSON.parse(jsonStr);
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
