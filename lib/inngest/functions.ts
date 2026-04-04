import { eq, inArray } from "drizzle-orm";
import { getPlatform } from "@/lib/platforms/factory";
import { postPlatformResults, socialAccounts } from "@/db/schema";

import { inngest } from "./client";
import { db } from "@/db";
import { posts } from "@/db/schema";
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
          const response = await driver.publishPost(
            {
              accessToken: account.accessToken,
              refreshToken: account.refreshToken || undefined,
              expiresAt: account.expiresAt || undefined
            },
            post.content,
            post.mediaUrls || []
          );

          publishResults.push({
            platform: platformName,
            status: "success",
            platformPostId: response.postId,
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
      const typedResults = results as { platform: string; status: string; platformPostId?: string; error?: string }[];

      // Record platform results
      if (typedResults.length > 0) {
        await db.insert(postPlatformResults).values(
          typedResults.map((r) => ({
            postId,
            platform: r.platform,
            platformPostId: r.platformPostId,
            status: r.status,
            error: r.error,
          }))
        );
      }

      const anySuccess = typedResults.some((r) => r.status === "success");
      const allFailed = typedResults.length > 0 && typedResults.every((r) => r.status === "error");

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
