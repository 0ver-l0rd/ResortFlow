import { listUserZernioAccounts, listUserZernioPosts } from "../zernio";
import { db } from "@/db";
import { socialAccounts, posts, postPlatformResults } from "@/db/schema";
import { encrypt } from "@/lib/encryption";
import { and, eq, notInArray } from "drizzle-orm";

const KNOWN_PLATFORMS = ["twitter", "instagram", "linkedin", "facebook", "tiktok", "youtube", "pinterest", "discord", "slack"];

/**
 * Syncs known Zernio social accounts and their published post history
 * into the local database under the logged-in user's namespace.
 */
export async function syncPlatformHistoryForUser(userId: string, platform?: string) {
  // 1. Fetch connected accounts from the unified Zernio developer key
  let zernioAccounts = [];
  try {
    zernioAccounts = await listUserZernioAccounts(userId);
  } catch (err: any) {
    console.error("Failed to fetch Zernio accounts:", err.message);
    return { success: false, error: "Failed to fetch accounts from Zernio" };
  }

  const whitelistedAccounts = zernioAccounts.filter((za: any) => {
    const normalizedPlatform = za.platform.toLowerCase();
    const isKnown = KNOWN_PLATFORMS.includes(normalizedPlatform);
    if (platform) {
      return isKnown && normalizedPlatform === platform.toLowerCase();
    }
    return isKnown;
  });

  const syncedAccounts = [];
  const skippedAccounts: Array<{ platform: string; reason: string }> = [];
  const claimedPlatformUserIds = new Set<string>();

  for (const account of whitelistedAccounts) {
    try {
      const normalizedPlatform = account.platform.toLowerCase();
      const platformUserId = account.platformUserId || account._id;

      const existingByPlatformUserId = await db.query.socialAccounts.findFirst({
        where: eq(socialAccounts.platformUserId, platformUserId),
      });

      if (existingByPlatformUserId && existingByPlatformUserId.userId !== userId) {
        skippedAccounts.push({
          platform: normalizedPlatform,
          reason: "already_linked_to_another_user",
        });
        continue;
      }

      // Check if we already have this account locally for this user
      const existing = await db.query.socialAccounts.findFirst({
        where: and(
          eq(socialAccounts.userId, userId),
          eq(socialAccounts.platform, normalizedPlatform),
          eq(socialAccounts.platformUserId, platformUserId)
        )
      });

      const accountData = {
        userId,
        platform: normalizedPlatform,
        accessToken: encrypt("zernio"), // Dummy token for schema compliance
        platformUserId,
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
      
      syncedAccounts.push(normalizedPlatform);
      claimedPlatformUserIds.add(platformUserId);
    } catch (dbErr) {
      console.error(`Failed to store social account ${account.platform} in database:`, dbErr);
    }
  }

  // 2. Remove local accounts that are no longer present on Zernio
  try {
    const activePlatformUserIds = Array.from(claimedPlatformUserIds);
    if (activePlatformUserIds.length > 0) {
      const deleteCondition = platform 
        ? and(eq(socialAccounts.userId, userId), eq(socialAccounts.platform, platform.toLowerCase()), notInArray(socialAccounts.platformUserId, activePlatformUserIds))
        : and(eq(socialAccounts.userId, userId), notInArray(socialAccounts.platformUserId, activePlatformUserIds));
      
      await db.delete(socialAccounts).where(deleteCondition);
    } else {
      // If no accounts are returned from Zernio, delete all local accounts (optionally filtered by platform)
      const deleteCondition = platform
        ? and(eq(socialAccounts.userId, userId), eq(socialAccounts.platform, platform.toLowerCase()))
        : eq(socialAccounts.userId, userId);
      
      await db.delete(socialAccounts).where(deleteCondition);
    }
  } catch (deleteErr) {
    console.error("Failed to clean up stale social accounts:", deleteErr);
  }

  // 3. Fetch published posts from Zernio
  let zernioPosts = [];
  try {
    zernioPosts = await listUserZernioPosts(userId);
  } catch (err: any) {
    console.error("Failed to fetch Zernio posts:", err.message);
    return { success: true, message: "Sync accounts complete, but failed to sync posts history." };
  }

  let syncedPostsCount = 0;

  for (const zPost of zernioPosts) {
    // Determine which platforms in the post map to known app platforms
    const postPlatforms = zPost.platforms || [];
    const validPlatforms = postPlatforms.filter((p: any) => {
      const pName = typeof p === "string" ? p : p.platform;
      return KNOWN_PLATFORMS.includes(pName.toLowerCase());
    });

    const postAccountIds = postPlatforms
      .map((p: any) => (typeof p === "string" ? undefined : p.accountId || p.platformUserId || p._id))
      .filter(Boolean);

    if (postAccountIds.length > 0 && !postAccountIds.some((accountId: string) => claimedPlatformUserIds.has(accountId))) {
      continue;
    }

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

  return { success: true, syncedAccounts, skippedAccounts, syncedPostsCount };
}
