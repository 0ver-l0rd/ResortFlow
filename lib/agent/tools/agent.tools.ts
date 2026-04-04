import { db } from "@/db";
import { agentPreferences } from "@/db/schema";
import { eq, and } from "drizzle-orm";

/**
 * Suspends execution to request specific information via a high-fidelity interactive UI.
 * uiType: "media_upload" | "date_picker" | "buttons" | "text_input" | "post_preview"
 */
export async function askClarification(params: { question: string; uiType?: string; options?: string[]; postData?: any }, userId: string) {
  return { 
    success: true, 
    isClarification: true, 
    question: params.question,
    uiType: params.uiType || "text_input",
    options: params.options || [],
    postData: params.postData
  };
}

/**
 * Requests final user confirmation for a sensitive action with interactive buttons.
 */
export async function confirmAction(params: { action: string; data?: any; options?: string[]; postData?: any }, userId: string) {
  return { 
    success: true, 
    isConfirmation: true, 
    action: params.action, 
    data: params.data,
    postData: params.postData,
    options: params.options || ["Confirm", "Cancel"]
  };
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
    await db.delete(agentPreferences).where(and(eq(agentPreferences.userId, userId), eq(agentPreferences.key, key)));
    await db.insert(agentPreferences).values({ userId, key, value });
    return { success: true, message: `Preference ${key} saved.` };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
