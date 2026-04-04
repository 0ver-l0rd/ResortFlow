import { db } from "@/db";
import { agentPreferences } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function askClarification(params: any, userId: string) {
  // This tool is used by the agent to suspend execution and request input.
  // The API route handles this by returning a specialized response to the frontend.
  return { success: true, isClarification: true, question: params.question };
}

export async function confirmAction(params: any, userId: string) {
  // Similar to clarification, but specialized for confirming a tool execution.
  return { success: true, isConfirmation: true, action: params.action, data: params.data };
}

export async function getPreferences(params: any, userId: string) {
  try {
    const prefs = await db.select().from(agentPreferences).where(eq(agentPreferences.userId, userId));
    const prefMap = prefs.reduce((acc: any, p) => {
      acc[p.key] = p.value;
      return acc;
    }, {});
    return { success: true, data: prefMap };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function rememberPreference(params: any, userId: string) {
  try {
    const { key, value } = params;
    
    // UPSERT style (Drizzle style depends on adapter, but we can do delete/insert or just insert with onConflict)
    // For now, simpler delete then insert
    await db.delete(agentPreferences).where(and(eq(agentPreferences.userId, userId), eq(agentPreferences.key, key)));
    await db.insert(agentPreferences).values({ userId, key, value });
    
    return { success: true, message: `Preference ${key} saved.` };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
