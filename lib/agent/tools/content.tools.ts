import { db } from "@/db";
import { posts, postPlatformResults } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { createZernioPost, getZernioAccountId, ZernioPlatformTarget, ZernioMediaItem } from "@/lib/zernio";

export async function composePosts(params: any, userId: string) {
  try {
    const { content, platforms, mediaUrls = [], scheduledAt, publishNow } = params;
    
    const status = publishNow ? "published" : scheduledAt ? "scheduled" : "draft";

    const [newPost] = await db.insert(posts).values({
      userId,
      content,
      platforms,
      mediaUrls,
      status,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
    }).returning();

    if (status === "published" || status === "scheduled") {
      const zernioPlatforms: ZernioPlatformTarget[] = [];
      const skippedPlatforms: string[] = [];

      for (const p of platforms) {
        const accountId = getZernioAccountId(p);
        if (accountId) {
          zernioPlatforms.push({ platform: p, accountId });
        } else {
          skippedPlatforms.push(p);
        }
      }

      if (zernioPlatforms.length > 0) {
        const zernioMedia: ZernioMediaItem[] = (mediaUrls || []).map((url: string) => {
          const isVideo = /\.(mp4|mov|avi|webm)$/i.test(url);
          return { url, type: isVideo ? "video" : "image" } as ZernioMediaItem;
        });

        const zernioPost = await createZernioPost({
          content,
          platforms: zernioPlatforms,
          mediaItems: zernioMedia.length > 0 ? zernioMedia : undefined,
          publishNow,
          scheduledFor: status === "scheduled" && scheduledAt ? scheduledAt : undefined,
          timezone: "Asia/Dubai",
        });

        for (const p of zernioPlatforms) {
          await db.insert(postPlatformResults).values({
            postId: newPost.id,
            platform: p.platform,
            status: "success",
            platformPostId: zernioPost._id,
          });
        }
      }

      for (const p of skippedPlatforms) {
        await db.insert(postPlatformResults).values({
          postId: newPost.id,
          platform: p,
          status: "error",
          error: `Platform "${p}" is not connected on Zernio.`,
        });
      }
    }

    return { success: true, data: newPost };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getPosts(params: any, userId: string) {
  try {
    const { status, limit = 10 } = params;
    
    let query = db.select().from(posts).where(eq(posts.userId, userId)).orderBy(desc(posts.createdAt)).limit(limit);
    
    if (status) {
      query = db.select().from(posts).where(
        and(eq(posts.userId, userId), eq(posts.status, status))
      ).orderBy(desc(posts.createdAt)).limit(limit) as any;
    }

    const results = await query;
    return { success: true, data: results };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function generateContent(params: any, userId: string) {
  // This will call the existing AI utility
  return { success: true, data: { suggestion: "This is an AI generated social media post placeholder." } };
}

export async function editPost(params: any, userId: string) {
  return { success: false, error: "Not implemented yet" };
}

export async function deletePost(params: any, userId: string) {
  return { success: false, error: "Not implemented yet" };
}
