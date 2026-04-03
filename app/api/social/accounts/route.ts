import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { socialAccounts } from "@/db/schema";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const user = await getUserByClerkId(clerkId);
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
