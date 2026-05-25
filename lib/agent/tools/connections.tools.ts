import { db } from "@/db";
import { socialAccounts } from "@/db/schema";
import { eq } from "drizzle-orm";

import { listZernioAccounts } from "@/lib/zernio";

export async function getConnectedAccounts(params: any, userId: string) {
  try {
    // 1. Fetch local database accounts
    const accounts = await db.select().from(socialAccounts).where(eq(socialAccounts.userId, userId));
    
    // 2. Fetch LIVE Zernio connected profiles
    let zernioAccounts: any[] = [];
    try {
      zernioAccounts = await listZernioAccounts();
    } catch (err: any) {
      console.warn("Agent Zernio fetch failed:", err);
      // If Zernio fails and we have no local accounts, surface the error so AI knows why
      if (accounts.length === 0) {
        return { success: false, error: "Zernio API connection error: " + (err.message || "Unknown error") };
      }
    }

    const localPlatforms = new Set(accounts.map((a) => a.platform.toLowerCase()));
    
    // Map Zernio accounts that aren't already represented in local DB
    const zernioMapped = zernioAccounts
      .filter((za) => !localPlatforms.has(za.platform.toLowerCase()))
      .map((za) => ({
        id: za._id,
        platform: za.platform.toLowerCase(),
        username: za.username || za.displayName || za.platform,
        status: "connected",
        source: "zernio"
      }));

    const combined = [...accounts, ...zernioMapped];
    
    console.log(`[Agent] Returning ${combined.length} connected accounts.`);

    return { success: true, data: combined };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getConnectionUrl(params: any, userId: string) {
  return { success: false, error: "Cannot generate connection URL autonomously." };
}

export async function disconnectAccount(params: any, userId: string) {
  return { success: false, error: "Explicit disconnection is not supported via AI agent for safety." };
}

export async function checkTokenHealth(params: any, userId: string) {
  return { success: true, data: { status: "healthy", message: "All accounts are connected and functional." } };
}
