import { getDemoUserId } from "@/lib/demo-auth";
import { db } from "@/db";
import { socialAccounts } from "@/db/schema";
import { getUserByAuthId } from "@/lib/db/queries/users";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { listZernioAccounts, ZernioAccount } from "@/lib/zernio";

export async function GET() {
  const authId = getDemoUserId();

  const user = await getUserByAuthId(authId);
  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  // 1. Try local DB first
  const localAccounts = await db.query.socialAccounts.findMany({
    where: eq(socialAccounts.userId, user.id),
    orderBy: (socialAccounts, { desc }) => [desc(socialAccounts.createdAt)],
  });

  // 2. Also fetch from Zernio to merge connected accounts
  let zernioAccounts: ZernioAccount[] = [];
  try {
    zernioAccounts = await listZernioAccounts();
  } catch (err: any) {
    console.warn("Could not fetch Zernio accounts:", err.message);
  }

  // Map local accounts (don't return tokens)
  const safeLocal = localAccounts.map(acc => ({
    id: acc.id,
    platform: acc.platform,
    username: acc.username,
    avatarUrl: acc.avatarUrl,
    expiresAt: acc.expiresAt,
    createdAt: acc.createdAt,
    source: "local" as const,
  }));

  // Map Zernio accounts and merge (avoid duplicating platforms already in local)
  const localPlatforms = new Set(safeLocal.map(a => a.platform.toLowerCase()));
  
  const zernioMapped = zernioAccounts
    .filter(za => !localPlatforms.has(za.platform.toLowerCase()))
    .map(za => ({
      id: za._id,
      platform: za.platform.toLowerCase(),
      username: za.username || za.displayName || za.platform,
      avatarUrl: za.avatarUrl || null,
      expiresAt: null,
      createdAt: za.createdAt || new Date().toISOString(),
      source: "zernio" as const,
    }));

  return NextResponse.json([...safeLocal, ...zernioMapped]);
}
