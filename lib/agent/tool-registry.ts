import { FunctionDeclaration, SchemaType } from "@google/generative-ai";
import { ChatCompletionTool } from "openai/resources/index";
import * as contentTools from "./tools/content.tools";
import * as schedulingTools from "./tools/scheduling.tools";
import * as connectionsTools from "./tools/connections.tools";
import * as autoReplyTools from "./tools/auto-reply.tools";
import * as analyticsTools from "./tools/analytics.tools";
import * as agentTools from "./tools/agent.tools";

export const geminiToolDeclarations: FunctionDeclaration[] = [
  // ─── Content ───
  {
    name: "composePosts",
    description:
      "Create and optionally publish or schedule a social media post on one or more platforms. " +
      "Use publishNow=true to post immediately. Always confirm with the user what the post says before using publishNow.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        content: { type: SchemaType.STRING, description: "The text content of the post." },
        platforms: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
          description: 'List of target platforms, e.g. ["twitter", "instagram", "linkedin"].',
        },
        mediaUrls: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
          description: "Optional list of media URLs to attach to the post.",
        },
        scheduledAt: {
          type: SchemaType.STRING,
          description: "ISO 8601 datetime string — schedule the post for this time. Leave empty to save as draft.",
        },
        publishNow: {
          type: SchemaType.BOOLEAN,
          description: "Set true to publish immediately via the connected accounts. Fires the delivery pipeline.",
        },
      },
      required: ["content", "platforms"],
    },
  },
  {
    name: "getPosts",
    description: "Retrieve the user's posts, optionally filtered by status (draft, scheduled, published, failed).",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        status: {
          type: SchemaType.STRING,
          description: 'Filter by status: "draft", "scheduled", "published", or "failed".',
        },
        limit: { type: SchemaType.NUMBER, description: "Max number of posts to return (default 10)." },
      },
    },
  },

  // ─── Scheduling ───
  {
    name: "getCalendar",
    description: "Get all scheduled posts within a date range to show what's coming up on the content calendar.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        startDate: { type: SchemaType.STRING, description: "ISO start date, e.g. 2025-04-01T00:00:00Z" },
        endDate:   { type: SchemaType.STRING, description: "ISO end date, e.g. 2025-04-30T23:59:59Z" },
      },
      required: ["startDate", "endDate"],
    },
  },
  {
    name: "schedulePost",
    description: "Update an existing draft post to be scheduled at a specific time.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        postId:      { type: SchemaType.STRING, description: "The UUID of the post to schedule." },
        scheduledAt: { type: SchemaType.STRING, description: "ISO 8601 datetime to schedule the post." },
      },
      required: ["postId", "scheduledAt"],
    },
  },
  {
    name: "getBestTime",
    description: "Suggest the best time to post on social media based on audience engagement patterns.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        platform: { type: SchemaType.STRING, description: 'Platform name, e.g. "twitter" or "instagram".' },
      },
    },
  },

  // ─── Connections ───
  {
    name: "getConnectedAccounts",
    description: "List all social media accounts connected by the user (platform, username, status).",
    parameters: { type: SchemaType.OBJECT, properties: {} },
  },

  // ─── Auto-Reply ───
  {
    name: "listAutoReplyRules",
    description: "List all auto-reply rules the user has configured across their connected accounts.",
    parameters: { type: SchemaType.OBJECT, properties: {} },
  },

  // ─── Analytics ───
  {
    name: "getAnalyticsOverview",
    description: "Get a summary of post publish results and engagement metrics across all platforms.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        days: { type: SchemaType.NUMBER, description: "Number of past days to analyse (default 7)." },
      },
    },
  },

  // ─── Agent Utilities ───
  {
    name: "askClarification",
    description: "Use this tool when the user's request is ambiguous and you need more information before acting.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        question: { type: SchemaType.STRING, description: "The clarifying question to present to the user." },
      },
      required: ["question"],
    },
  },
  {
    name: "rememberPreference",
    description: "Persist a user preference (tone, brand voice, timezone) for future conversations.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        key:   { type: SchemaType.STRING, description: 'Preference key, e.g. "tone", "brandVoice", "timezone".' },
        value: { type: SchemaType.STRING, description: "The value to store." },
      },
      required: ["key", "value"],
    },
  },
  {
    name: "getBestTime",
    description: "Get the recommended best time to post on a specific platform.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        platform: { type: SchemaType.STRING, description: "The social media platform name." },
      },
    },
  },
];

// De-duplicate declarations by name (getBestTime appeared twice above as example; just in case)
const seen = new Set<string>();
const uniqueDeclarations = geminiToolDeclarations.filter(d => {
  if (seen.has(d.name)) return false;
  seen.add(d.name);
  return true;
});
// Re-export deduplicated list
(geminiToolDeclarations as any).length = 0;
uniqueDeclarations.forEach(d => (geminiToolDeclarations as any).push(d));

/**
 * Convert Gemini-style tool declarations to OpenAI-style tools.
 */
export const openAIToolDeclarations: ChatCompletionTool[] = uniqueDeclarations.map(d => ({
  type: "function" as const,
  function: {
    name: d.name,
    description: d.description,
    parameters: {
      type: "object",
      properties: Object.entries(d.parameters?.properties || {}).reduce((acc: any, [key, prop]: [string, any]) => {
        acc[key] = {
          type: prop.type === SchemaType.STRING ? "string" :
                prop.type === SchemaType.NUMBER ? "number" :
                prop.type === SchemaType.BOOLEAN ? "boolean" :
                prop.type === SchemaType.ARRAY ? "array" : "object",
          description: prop.description,
          ...(prop.items ? { items: { type: prop.items.type === SchemaType.STRING ? "string" : "object" } } : {})
        };
        return acc;
      }, {}),
      required: d.parameters?.required || [],
    },
  },
}));

export async function executeAgentTool(toolName: string, params: any, userId: string) {
  console.log(`[AgentTool] Executing: ${toolName}`, JSON.stringify(params ?? {}).substring(0, 200));

  const tools: Record<string, Function> = {
    ...contentTools,
    ...schedulingTools,
    ...connectionsTools,
    ...autoReplyTools,
    ...analyticsTools,
    ...agentTools,
  };

  const toolFn = tools[toolName];
  if (!toolFn) {
    return { success: false, error: `Tool "${toolName}" has no implementation.` };
  }

  try {
    const result = await toolFn(params ?? {}, userId);
    return result;
  } catch (error: any) {
    console.error(`[AgentTool] Error in ${toolName}:`, error);
    return { success: false, error: error.message || "Unknown error" };
  }
}
