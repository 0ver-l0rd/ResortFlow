import { auth } from "@clerk/nextjs/server";
import { genAI } from "@/lib/ai";
import { buildSystemPrompt } from "@/lib/agent/system-prompt";
import { executeAgentTool, geminiToolDeclarations } from "@/lib/agent/tool-registry";
import { db } from "@/db";
import { agentConversations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { getPlanLimits } from "@/lib/plan-limits";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return new Response("Unauthorized", { status: 401 });

  const user = await getUserByClerkId(clerkId);
  if (!user) return new Response("User not found", { status: 404 });

  const { message, conversationId } = await req.json();
  if (!message) return new Response("Message required", { status: 400 });

  // Plan Check (Basic for now)
  const limits = getPlanLimits(user.plan);
  // TODO: Check monthly agent message count in a real implementation

  let conversation;
  if (conversationId) {
    conversation = await db.query.agentConversations.findFirst({
      where: eq(agentConversations.id, conversationId),
    });
  }

  if (!conversation) {
    [conversation] = await db.insert(agentConversations).values({
      userId: user.id,
      messages: [],
    }).returning();
  }

  const systemPrompt = await buildSystemPrompt(user.id);
  const previousMessages = (conversation.messages as any[]) || [];
  
  const model = genAI.getGenerativeModel({ 
    model: "gemini-flash-latest",
    systemInstruction: systemPrompt,
    tools: [{ functionDeclarations: geminiToolDeclarations }],
  });

  // Convert previous messages to Gemini history format
  const history = previousMessages.map(m => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.content || "" }],
  }));

  const chat = model.startChat({ history });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      function sendEvent(event: string, data: any) {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      }

      try {
        sendEvent("thinking", { status: "Searching for context..." });
        
        let result = await chat.sendMessageStream(message);
        let fullResponse = "";

        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            fullResponse += text;
            sendEvent("message", { text });
          }

          const calls = chunk.functionCalls();
          if (calls && calls.length > 0) {
            for (const call of calls) {
              sendEvent("tool_call", { name: call.name, args: call.args });
              
              const toolResult = await executeAgentTool(call.name, call.args, user.id);
              sendEvent("tool_result", { name: call.name, result: toolResult });
              
              // Feed result back to Gemini
              const toolResponse = await chat.sendMessage([{
                functionResponse: {
                  name: call.name,
                  response: toolResult,
                }
              }]);
              
              const partText = toolResponse.response.text();
              if (partText) {
                fullResponse += partText;
                sendEvent("message", { text: partText });
              }
            }
          }
        }

        // Save to DB
        const updatedMessages = [
          ...previousMessages,
          { role: "user", content: message },
          { role: "assistant", content: fullResponse },
        ];
        
        await db.update(agentConversations)
          .set({ messages: updatedMessages, updatedAt: new Date() })
          .where(eq(agentConversations.id, conversation.id));

        sendEvent("done", { conversationId: conversation.id });
        controller.close();
      } catch (error: any) {
        console.error("Streaming error:", error);
        sendEvent("error", { message: error.message });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
