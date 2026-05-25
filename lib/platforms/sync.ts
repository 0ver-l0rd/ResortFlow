import { listZernioAccounts, listZernioPosts, getZernioAccountId } from "../zernio";
import { db } from "@/db";
import { socialAccounts, posts, postPlatformResults } from "@/db/schema";
import { encrypt } from "@/lib/encryption";
import { and, eq } from "drizzle-orm";

/**
 * Syncs whitelisted Zernio social accounts and their published post history
 * into the local database under the logged-in user's namespace.
 */
export async function syncPlatformHistoryForUser(userId: string, platform?: string) {
  // 1. Fetch connected accounts from the unified Zernio developer key
  let zernioAccounts = [];
  try {
    zernioAccounts = await listZernioAccounts();
  } catch (err: any) {
    console.error("Failed to fetch Zernio accounts:", err.message);
    return { success: false, error: "Failed to fetch accounts from Zernio" };
  }

  // 2. Filter Zernio accounts to only include whitelisted and active environment accounts
  const whitelistedAccounts = zernioAccounts.filter(za => {
    const configuredId = getZernioAccountId(za.platform);
    
    // Ensure we only sync configured accounts matching our environment variables
    const isWhitelisted = configuredId && configuredId === za._id;
    
    if (platform) {
      return isWhitelisted && za.platform.toLowerCase() === platform.toLowerCase();
    }
    return isWhitelisted;
  });

  const syncedAccounts = [];

  for (const account of whitelistedAccounts) {
    try {
      // Check if we already have this account locally for this user
      const existing = await db.query.socialAccounts.findFirst({
        where: and(
          eq(socialAccounts.userId, userId),
          eq(socialAccounts.platform, account.platform.toLowerCase()),
          eq(socialAccounts.platformUserId, account.platformUserId || account._id)
        )
      });

      const accountData = {
        userId,
        platform: account.platform.toLowerCase(),
        accessToken: encrypt("zernio"), // Dummy token for schema compliance
        platformUserId: account.platformUserId || account._id,
        username: account.username || account.displayName || account.platform,
        avatarUrl: account.avatarUrl || null,
      };

      if (existing) {
        await db.update(socialAccounts)
          .set(accountData)
          .where(eq(socialAccounts.id, existing.id));
      } else {
        await db.insert(socialAccounts).values(accountData);
      }
      
      syncedAccounts.push(account.platform.toLowerCase());
    } catch (dbErr) {
      console.error(`Failed to store social account ${account.platform} in database:`, dbErr);
    }
  }

  // 3. Fetch published posts from Zernio
  let zernioPosts = [];
  try {
    zernioPosts = await listZernioPosts();
  } catch (err: any) {
    console.error("Failed to fetch Zernio posts:", err.message);
    return { success: true, message: "Sync accounts complete, but failed to sync posts history." };
  }

  let syncedPostsCount = 0;

  for (const zPost of zernioPosts) {
    // Determine which platforms in the post are whitelisted in ResortFlow config
    const postPlatforms = zPost.platforms || [];
    const validPlatforms = postPlatforms.filter((p: any) => {
      const pName = typeof p === "string" ? p : p.platform;
      return getZernioAccountId(pName) !== null;
    });

    if (validPlatforms.length === 0) continue;

    try {
      // Check if this post already exists locally in the database for the user
      const existingPost = await db.query.posts.findFirst({
        where: and(
          eq(posts.userId, userId),
          eq(posts.content, zPost.content)
        )
      });

      let localPostId = existingPost?.id;

      if (!existingPost) {
        const [newPost] = await db.insert(posts).values({
          userId,
          content: zPost.content,
          platforms: validPlatforms.map((p: any) => typeof p === "string" ? p.toLowerCase() : p.platform.toLowerCase()),
          status: "published",
          publishedAt: zPost.createdAt ? new Date(zPost.createdAt) : new Date(),
          createdAt: zPost.createdAt ? new Date(zPost.createdAt) : new Date(),
          isAiGenerated: false
        }).returning();
        localPostId = newPost.id;
      }

      // Sync platform results
      for (const p of validPlatforms) {
        const pName = typeof p === "string" ? p : p.platform;
        const existingResult = await db.query.postPlatformResults.findFirst({
          where: and(
            eq(postPlatformResults.postId, localPostId!),
            eq(postPlatformResults.platform, pName.toLowerCase())
          )
        });

        if (!existingResult) {
          await db.insert(postPlatformResults).values({
            postId: localPostId!,
            platform: pName.toLowerCase(),
            platformPostId: zPost._id,
            status: "success",
            createdAt: zPost.createdAt ? new Date(zPost.createdAt) : new Date()
          });
          syncedPostsCount++;
        }
      }
    } catch (postErr) {
      console.error("Failed to sync Zernio post:", postErr);
    }
  }

  return { success: true, syncedAccounts, syncedPostsCount };
}
