import { getDemoUserId } from "@/lib/demo-auth";
import { db } from "@/db";
import { socialAccounts } from "@/db/schema";
import { getUserByAuthId } from "@/lib/db/queries/users";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const authId = getDemoUserId();

  const user = await getUserByAuthId(authId);
  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  const accounts = await db.query.socialAccounts.findMany({
    where: eq(socialAccounts.userId, user.id),
    orderBy: (socialAccounts, { desc }) => [desc(socialAccounts.createdAt)],
  });

  // Don't return tokens to the client
  const safeAccounts = accounts.map(acc => ({
    id: acc.id,
    platform: acc.platform,
    username: acc.username,
    avatarUrl: acc.avatarUrl,
    expiresAt: acc.expiresAt,
    createdAt: acc.createdAt,
  }));

  return NextResponse.json(safeAccounts);
}
