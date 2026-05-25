import { eq } from "drizzle-orm";
import { postPlatformResults } from "@/db/schema";
import { inngest } from "./client";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { createZernioPost, getZernioAccountId } from "@/lib/zernio";

export const publishPost = inngest.createFunction(
  {
    id: "publish-post",
    name: "Publish Social Post",
    triggers: [{ event: "post/created" }]
  },
  async ({ event, step }) => {
    const { postId, scheduledAt } = event.data;

    // 1. Sleep until scheduled time if in the future
    if (scheduledAt) {
      const scheduledDate = new Date(scheduledAt);
      if (scheduledDate > new Date()) {
        await step.sleepUntil("wait-for-schedule", scheduledDate);
      }
    }

    // 2. Perform publishing through Zernio
    const results = await step.run("publish-to-social-media", async () => {
      const post = await db.query.posts.findFirst({
        where: eq(posts.id, postId),
      });

      if (!post) throw new Error(`Post ${postId} not found`);

      const zernioPlatforms = [];
      const skippedPlatforms = [];

      for (const platformName of post.platforms) {
        const accountId = getZernioAccountId(platformName);
        if (accountId) {
          zernioPlatforms.push({ platform: platformName, accountId });
        } else {
          skippedPlatforms.push(platformName);
        }
      }

      const publishResults = [];

      if (zernioPlatforms.length > 0) {
        try {
          const zernioMedia = (post.mediaUrls || []).map((url: string) => {
            const isVideo = /\.(mp4|mov|avi|webm)$/i.test(url);
            return { url, type: isVideo ? "video" : "image" } as const;
          });

          const zernioPost = await createZernioPost({
            content: post.content,
            platforms: zernioPlatforms,
            mediaItems: zernioMedia.length > 0 ? zernioMedia : undefined,
            publishNow: true,
          });

          for (const p of zernioPlatforms) {
            publishResults.push({
              platform: p.platform,
              status: "success",
              platformPostId: zernioPost._id,
            });
          }
        } catch (error: any) {
          console.error("Zernio publish error in Inngest:", error.message);
          for (const p of zernioPlatforms) {
            publishResults.push({
              platform: p.platform,
              status: "error",
              error: error.message,
            });
          }
        }
      }

      for (const platformName of skippedPlatforms) {
        publishResults.push({
          platform: platformName,
          status: "error",
          error: "Account not connected on Zernio",
        });
      }

      return publishResults;
    });

    // 3. Record results and update local post status
    await step.run("record-results-and-update-status", async () => {
      const typedResults = results as { platform: string; status: string; platformPostId?: string; error?: string }[];

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
