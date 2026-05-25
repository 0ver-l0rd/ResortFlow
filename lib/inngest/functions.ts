import { eq, inArray } from "drizzle-orm";
import { getPlatform } from "@/lib/platforms/factory";
import { postPlatformResults, socialAccounts } from "@/db/schema";

import { inngest } from "./client";
import { db } from "@/db";
import { posts, socialAccounts as socialAccountsTable } from "@/db/schema";
import { decrypt } from "@/lib/encryption";
import { PlatformTheme } from "@/lib/analytics-themes";

const REFRESH_THRESHOLD_MS = 10 * 60 * 1000; // 10 minutes
export const publishPost = inngest.createFunction(
  {
    id: "publish-post",
    name: "Publish Social Post",
    triggers: [{ event: "post/created" }]
  },
  async ({ event, step }: { event: any; step: any }) => {
    const { postId, scheduledAt } = event.data;

    // 1. If it's scheduled for the future, sleep until then
    if (scheduledAt) {
      const scheduledDate = new Date(scheduledAt);
      if (scheduledDate > new Date()) {
        await step.sleepUntil("wait-for-schedule", scheduledDate);
      }
    }

    // 2. Perform the actual multi-platform publishing
    const results = await step.run("publish-to-social-media", async () => {
      const post = await db.query.posts.findFirst({
        where: eq(posts.id, postId),
      });

      if (!post) throw new Error(`Post ${postId} not found`);

      // Get appropriate social accounts for this user
      const accounts = await db
        .select()
        .from(socialAccounts)
        .where(eq(socialAccounts.userId, post.userId));

      const publishResults = [];

      for (const platformName of post.platforms) {
        const account = accounts.find((a) => a.platform.toLowerCase() === platformName.toLowerCase());

        if (!account) {
          console.warn(`No connected account found for platform ${platformName}`);
          publishResults.push({ platform: platformName, status: "error", error: "Account not connected" });
          continue;
        }

        try {
          const driver = getPlatform(platformName);
          
          // Decrypt tokens for the driver to use
          const decryptedTokens = {
            accessToken: decrypt(account.accessToken),
            refreshToken: account.refreshToken ? decrypt(account.refreshToken) : undefined,
            expiresAt: account.expiresAt || undefined
          };
          
          const response = await driver.publishPost(
            decryptedTokens,
            post.content,
            post.mediaUrls || []
          ) as any;

          publishResults.push({
            platform: platformName,
            status: "success",
            platformPostId: response.postId,
            simulated: response.simulated
          });
        } catch (error: any) {
          console.error(`Failed to publish to ${platformName}:`, error.message);
          publishResults.push({ platform: platformName, status: "error", error: error.message });
        }
      }

      return publishResults;
    });

    // 3. Record results and update the post status
    await step.run("record-results-and-update-status", async () => {
      const typedResults = results as { platform: string; status: string; platformPostId?: string; error?: string; simulated?: boolean }[];

      // Record platform results
      if (typedResults.length > 0) {
        await db.insert(postPlatformResults).values(
          typedResults.map((r) => ({
            postId,
            platform: r.platform,
            platformPostId: r.platformPostId,
            status: r.status,
            error: r.simulated ? "SIMULATED_SUCCESS" : r.error,
          }))
        );
      }

      const anySuccess = typedResults.some((r) => r.status === "success" || r.simulated);
      const allFailed = typedResults.length > 0 && typedResults.every((r) => r.status === "error" && !r.simulated);

      await db
        .update(posts)
        .set({
          status: allFailed ? "failed" : "published",
          publishedAt: anySuccess ? new Date() : null,
        })
        .where(eq(posts.id, postId));

      return { status: anySuccess ? "published" : "failed" };
    });

    return { results };
  }
);
