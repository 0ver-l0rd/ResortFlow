import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { db } from '../db';
import { posts, postPlatformResults } from '../db/schema';
import { eq } from 'drizzle-orm';
import {
  createZernioPost,
  getZernioAccountId,
  ZernioPlatformTarget,
  ZernioMediaItem,
} from '../lib/zernio';

const redisUrl = process.env.REDIS_URL;
const connection = redisUrl ? new Redis(redisUrl, { maxRetriesPerRequest: null, lazyConnect: true }) : new Redis({ maxRetriesPerRequest: null, lazyConnect: true });

export const postPublishWorker = new Worker('post-publish', async (job: Job) => {
  const { postId } = job.data;
  console.log(`Processing post-publish job ${job.id} for post ${postId}`);

  try {
    // 1. Fetch post from DB
    const post = await db.query.posts.findFirst({
      where: eq(posts.id, postId),
    });

    if (!post) {
      throw new Error(`Post ${postId} not found`);
    }

    // 2. Build Zernio platform targets
    const zernioPlatforms: ZernioPlatformTarget[] = [];
    const skippedPlatforms: string[] = [];

    for (const platform of post.platforms) {
      const accountId = getZernioAccountId(platform);
      if (accountId) {
        zernioPlatforms.push({ platform, accountId });
      } else {
        skippedPlatforms.push(platform);
      }
    }

    console.log(`Publishing post to Zernio platforms: ${zernioPlatforms.map(p => p.platform).join(', ')}`);
    if (skippedPlatforms.length > 0) {
      console.warn(`Skipped (no Zernio account): ${skippedPlatforms.join(', ')}`);
    }

    // 3. Publish via Zernio
    if (zernioPlatforms.length > 0) {
      // Build media items
      const zernioMedia: ZernioMediaItem[] = (post.mediaUrls || []).map((url: string) => {
        const isVideo = /\.(mp4|mov|avi|webm)$/i.test(url);
        return { url, type: isVideo ? 'video' : 'image' } as ZernioMediaItem;
      });

      const zernioPost = await createZernioPost({
        content: post.content,
        platforms: zernioPlatforms,
        mediaItems: zernioMedia.length > 0 ? zernioMedia : undefined,
        publishNow: true,
      });

      console.log(`✅ Zernio post published: ${zernioPost._id}`);

      // Record success for each platform
      for (const p of zernioPlatforms) {
        await db.insert(postPlatformResults).values({
          postId: post.id,
          platform: p.platform,
          status: 'success',
          platformPostId: zernioPost._id,
        });
      }
    }

    // Record errors for skipped platforms
    for (const platform of skippedPlatforms) {
      await db.insert(postPlatformResults).values({
        postId: post.id,
        platform,
        status: 'error',
        error: `Platform "${platform}" is not connected on Zernio.`,
      });
    }

    // 4. Update post status
    await db.update(posts)
      .set({ 
        status: 'published',
        publishedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(posts.id, postId));

    return { success: true, postId };
  } catch (error: any) {
    console.error(`Failed to publish post ${postId}:`, error);
    
    // Update post status to failed
    await db.update(posts)
      .set({ 
        status: 'failed',
        updatedAt: new Date(),
      })
      .where(eq(posts.id, postId));

    // Record failure
    try {
      const post = await db.query.posts.findFirst({ where: eq(posts.id, postId) });
      if (post) {
        for (const platform of post.platforms) {
          await db.insert(postPlatformResults).values({
            postId: post.id,
            platform,
            status: 'error',
            error: error.message || 'Zernio publish failed',
          });
        }
      }
    } catch { /* best effort */ }
      
    throw error;
  }
}, { connection });

postPublishWorker.on('completed', (job) => {
  console.log(`${job.id} has completed!`);
});

postPublishWorker.on('failed', (job, err) => {
  console.log(`${job?.id} has failed with ${err.message}`);
});
