import { getDbUser } from "@/lib/auth";
import { db } from "@/db";
import { socialAccounts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { syncPlatformHistoryForUser } from "@/lib/platforms/sync";

export async function GET() {
  const user = await getDbUser();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  let syncResult: { skippedAccounts?: Array<{ platform: string; reason: string }> } | null = null;

  // 1. Automatically run synchronization with Zernio on-demand
  try {
    syncResult = await syncPlatformHistoryForUser(user.id);
  } catch (err: any) {
    console.error("Auto sync connected accounts failed:", err.message);
  }

  // 2. Fetch whitelisted connected accounts synced to this user locally
  const localAccounts = await db.query.socialAccounts.findMany({
    where: eq(socialAccounts.userId, user.id),
    orderBy: (socialAccounts, { desc }) => [desc(socialAccounts.createdAt)],
  });

  // Map to safe public representation
  const safeAccounts = localAccounts.map(acc => ({
    id: acc.id,
    platform: acc.platform,
    username: acc.username,
    avatarUrl: acc.avatarUrl,
    expiresAt: acc.expiresAt,
    createdAt: acc.createdAt,
    source: "local" as const,
  }));

  return NextResponse.json({
    accounts: safeAccounts,
    sync: {
      skippedAccounts: syncResult?.skippedAccounts || [],
    },
  });
}
