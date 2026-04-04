import { auth } from "@clerk/nextjs/server";
import { getPlatform } from "@/lib/platforms/factory";
import { db } from "@/db";
import { socialAccounts, posts, postPlatformResults } from "@/db/schema";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { decrypt } from "@/lib/encryption";
import { and, eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { platform } = await request.json();
    const user = await getUserByClerkId(clerkId);
    if (!user) return new NextResponse("User not found", { status: 404 });

    // Fetch account details
    const accounts = await db.query.socialAccounts.findMany({
      where: and(
        eq(socialAccounts.userId, user.id),
        platform ? eq(socialAccounts.platform, platform) : undefined
      ),
    });

    if (accounts.length === 0) {
      return NextResponse.json({ message: "No accounts found to sync" });
    }

    const syncResults = [];

    for (const account of accounts) {
      const driver = getPlatform(account.platform);
      const decryptedTokens = {
        accessToken: decrypt(account.accessToken),
        refreshToken: account.refreshToken ? decrypt(account.refreshToken) : undefined,
        expiresAt: account.expiresAt || undefined
      };

      const history = await driver.fetchPostHistory(decryptedTokens, account.platformUserId);
      
      let syncedCount = 0;

      for (const item of history) {
        // Check if we've already synced this post
        const existing = await db.query.postPlatformResults.findFirst({
          where: and(
            eq(postPlatformResults.platform, account.platform),
            eq(postPlatformResults.platformPostId, item.id)
          ),
        });

        if (existing) continue;

        // Create the post record
        const [newPost] = await db.insert(posts).values({
          userId: user.id,
          content: item.content,
          platforms: [account.platform],
          status: "published",
          publishedAt: item.createdAt,
          createdAt: item.createdAt,
          isAiGenerated: false
        }).returning();

        // Record the platform result
        await db.insert(postPlatformResults).values({
          postId: newPost.id,
          platform: account.platform,
          platformPostId: item.id,
          status: "success",
          createdAt: item.createdAt
        });

        syncedCount++;
      }

      syncResults.push({ platform: account.platform, count: syncedCount });
    }

    return NextResponse.json({ success: true, results: syncResults });
  } catch (error: any) {
    console.error("[Sync API] Error:", error);
    return new NextResponse(error.message, { status: 500 });
  }
}
