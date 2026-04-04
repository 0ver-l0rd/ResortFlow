import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { db } from '../db';
import { posts, postPlatformResults } from '../db/schema';
import { eq } from 'drizzle-orm';

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

    // 2. Mock platform publishing
    console.log(`Publishing post to platforms: ${post.platforms.join(', ')}`);
    
    // In a real scenario, we would iterate through platforms and call their APIs
    // For now, we mock success for all requested platforms
    for (const platform of post.platforms) {
      await db.insert(postPlatformResults).values({
        postId: post.id,
        platform,
        status: 'success',
        platformPostId: `mock_${platform}_${Date.now()}`,
      });
    }

    // 3. Update post status
    await db.update(posts)
      .set({ 
        status: 'published',
        publishedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(posts.id, postId));

    return { success: true, postId };
  } catch (error: any) {
    console.error(`Failed to process post ${postId}:`, error);
    
    // Update post status to failed
    await db.update(posts)
      .set({ 
        status: 'failed',
        updatedAt: new Date(),
      })
      .where(eq(posts.id, postId));
      
    throw error;
  }
}, { connection });

postPublishWorker.on('completed', (job) => {
  console.log(`${job.id} has completed!`);
});

postPublishWorker.on('failed', (job, err) => {
  console.log(`${job?.id} has failed with ${err.message}`);
});
