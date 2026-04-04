import { getDemoUserId } from "@/lib/demo-auth";
import { openai } from "@/lib/openai";
import { buildSystemPrompt } from "@/lib/agent/system-prompt";
import { executeAgentTool, openAIToolDeclarations } from "@/lib/agent/tool-registry";
import { db } from "@/db";
import { agentConversations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { ChatCompletionMessageParam } from "openai/resources/index";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Derive a short title from the first user message */
function deriveTitle(message: string): string {
  const clean = message.replace(/\s+/g, " ").trim();
  return clean.length <= 60 ? clean : clean.slice(0, 57) + "...";
}

export async function POST(req: Request) {
  const clerkId = getDemoUserId();

  const user = await getUserByClerkId(clerkId);
  if (!user) return new Response("User not found", { status: 404 });

  const { message, conversationId } = await req.json();
  if (!message) return new Response("Message required", { status: 400 });

  let conversation;
  if (conversationId) {
    conversation = await db.query.agentConversations.findFirst({
      where: eq(agentConversations.id, conversationId),
    });
  }

  const isNew = !conversation;

  if (!conversation) {
    [conversation] = await db
      .insert(agentConversations)
      .values({
        userId: user.id,
        messages: [],
        title: deriveTitle(message),
      })
      .returning();
  }

  const systemPrompt = await buildSystemPrompt(user.id);
  const previousMessages = (conversation.messages as any[]) || [];

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      function sendEvent(event: string, data: any) {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        );
      }

      let fullResponse = "";
      const messages: ChatCompletionMessageParam[] = [
        { role: "system", content: systemPrompt },
        ...previousMessages.map(m => ({
          role: m.role as "user" | "assistant",
          content: m.content
        })),
        { role: "user", content: message }
      ];

      try {
        sendEvent("thinking", { status: "Thinking (GPT-4o)..." });

        const MAX_ROUNDS = 10;
        for (let round = 0; round < MAX_ROUNDS; round++) {
          const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages,
            tools: openAIToolDeclarations,
            stream: true,
          });

          let toolCalls: any[] = [];
          let currentMessageContent = "";

          for await (const chunk of response) {
            const delta = chunk.choices[0]?.delta;
            
            if (delta?.content) {
              currentMessageContent += delta.content;
              fullResponse += delta.content;
              sendEvent("message", { text: delta.content });
            }

            if (delta?.tool_calls) {
              for (const tc of delta.tool_calls) {
                if (!toolCalls[tc.index]) {
                  toolCalls[tc.index] = { 
                    id: tc.id, 
                    type: "function",
                    function: { name: "", arguments: "" } 
                  };
                }
                if (tc.function?.name) toolCalls[tc.index].function.name += tc.function.name;
                if (tc.function?.arguments) toolCalls[tc.index].function.arguments += tc.function.arguments;
              }
            }
          }

          // Filter out nulls from sparse array if any and ensure valid structure
          const validToolCalls = toolCalls.filter(Boolean);

          if (validToolCalls.length === 0) {
            // No more tool calls, we're done
            break;
          }

          // Add the assistant's message with tool calls to the history
          messages.push({
            role: "assistant",
            content: currentMessageContent || null,
            tool_calls: validToolCalls
          });

          // Execute tools
          for (const tc of validToolCalls) {
            const toolName = tc.function.name;
            const toolArgs = JSON.parse(tc.function.arguments || "{}");

            sendEvent("tool_call", { name: toolName, args: toolArgs });

            let result;
            try {
              result = await executeAgentTool(toolName, toolArgs, user.id);
            } catch (err: any) {
              result = { success: false, error: err.message || "Tool execution failed" };
            }

            sendEvent("tool_result", {
              name: toolName,
              result,
              success: result?.success !== false
            });

            messages.push({
              role: "tool",
              tool_call_id: tc.id,
              content: JSON.stringify(result)
            });
          }
          
          sendEvent("thinking", { status: "Processing results..." });
        }

        // Persist conversation
        const updatedMessages = [
          ...previousMessages,
          { role: "user", content: message },
          { role: "assistant", content: fullResponse },
        ];

        await db
          .update(agentConversations)
          .set({
            messages: updatedMessages,
            updatedAt: new Date(),
          })
          .where(eq(agentConversations.id, conversation!.id));

        sendEvent("done", { conversationId: conversation!.id, isNew });
        controller.close();
      } catch (error: any) {
        console.error("[AgentChat OpenAI Error]:", error);
        sendEvent("error", { message: error.message || "OpenAI request failed" });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
