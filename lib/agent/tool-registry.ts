import { FunctionDeclaration, SchemaType } from "@google/generative-ai";
import * as contentTools from "./tools/content.tools";
import * as schedulingTools from "./tools/scheduling.tools";
import * as connectionsTools from "./tools/connections.tools";
import * as autoReplyTools from "./tools/auto-reply.tools";
import * as analyticsTools from "./tools/analytics.tools";
import * as agentTools from "./tools/agent.tools";

export const geminiToolDeclarations: FunctionDeclaration[] = [
  // Content Tools
  {
    name: "composePosts",
    description: "Create new social media posts for one or multiple platforms.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        content: { type: SchemaType.STRING, description: "The text content of the post." },
        platforms: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "List of platforms to post to (e.g., instagram, twitter, linkedin)." },
        mediaUrls: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "Optional list of media URLs to attach." },
        scheduledAt: { type: SchemaType.STRING, description: "Optional ISO string for scheduling." },
      },
      required: ["content", "platforms"],
    },
  },
  {
    name: "getPosts",
    description: "Fetch a list of posts with optional status filtering.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        status: { type: SchemaType.STRING, description: "Optional status to filter by: draft, scheduled, published, failed." },
        limit: { type: SchemaType.NUMBER, description: "Max number of posts to return." },
      },
    },
  },

  // Scheduling Tools
  {
    name: "getCalendar",
    description: "Get scheduled posts for a specific date range.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        startDate: { type: SchemaType.STRING, description: "ISO string for the start of the range." },
        endDate: { type: SchemaType.STRING, description: "ISO string for the end of the range." },
      },
      required: ["startDate", "endDate"],
    },
  },

  // Connections Tools
  {
    name: "getConnectedAccounts",
    description: "List all social media accounts currently connected by the user.",
    parameters: { type: SchemaType.OBJECT, properties: {} },
  },

  // Auto-Reply Tools
  {
    name: "listAutoReplyRules",
    description: "List all active and inactive auto-reply rules.",
    parameters: { type: SchemaType.OBJECT, properties: {} },
  },

  // Analytics Tools
  {
    name: "getAnalyticsOverview",
    description: "Get a high-level summary of engagement metrics across all platforms.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        days: { type: SchemaType.NUMBER, description: "Number of days to look back (default 7)." },
      },
    },
  },

  // Agent Tools
  {
    name: "askClarification",
    description: "Ask the user for more information before proceeding with an action.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        question: { type: SchemaType.STRING, description: "The question to ask the user." },
      },
      required: ["question"],
    },
  },
  {
    name: "confirmAction",
    description: "Request explicit confirmation from the user before performing a sensitive action.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        action: { type: SchemaType.STRING, description: "Description of the action to be confirmed." },
        data: { type: SchemaType.OBJECT, description: "The parameters of the action to execute if confirmed.", properties: {} } as any,
      },
      required: ["action"],
    },
  },
];

export async function executeAgentTool(toolName: string, params: any, userId: string) {
  console.log(`[AgentTool] Executing ${toolName} for user ${userId}`, params);

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
    return { success: false, error: `Tool ${toolName} not found implementation.` };
  }

  try {
    return await toolFn(params, userId);
  } catch (error: any) {
    console.error(`[AgentTool] Error executing ${toolName}:`, error);
    return { success: false, error: error.message || "Unknown error" };
  }
}
