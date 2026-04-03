import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { db } from '../db';
import { autoReplyRules, autoReplyLogs } from '../db/schema';
import { eq } from 'drizzle-orm';
import { generateAutoReply } from '../lib/ai';

const redisUrl = process.env.REDIS_URL;
const connection = redisUrl ? new Redis(redisUrl, { maxRetriesPerRequest: null }) : new Redis({ maxRetriesPerRequest: null });



export const autoReplyWorker = new Worker('auto-reply', async (job: Job) => {
  const { ruleId, commentId, commentText, platform } = job.data;
  console.log(`Processing auto-reply job ${job.id} for rule ${ruleId}`);

  try {
    // 1. Fetch rule from DB
    const rule = await db.query.autoReplyRules.findFirst({
      where: eq(autoReplyRules.id, ruleId),
    });

    if (!rule || !rule.isActive) {
      console.log(`Rule ${ruleId} not found or inactive`);
      return { success: false, reason: 'rule_inactive' };
    }

    let replyText = '';

    // 2. Generate reply
    if (rule.useAI) {
      console.log(`Generating AI reply for comment: "${commentText}"`);
      replyText = await generateAutoReply(commentText, rule.aiPrompt || "");
    } else {
      replyText = rule.replyTemplate || 'Thank you for your comment!';
    }

    // 3. Mock posting reply (In reality, call platform API here)
    console.log(`Posting reply to ${platform}: "${replyText}"`);

    // 4. Log the reply
    await db.insert(autoReplyLogs).values({
      ruleId: rule.id,
      commentId,
      commentText,
      replyText,
      status: 'success'
    });

    return { success: true, replyText };
  } catch (error: any) {
    if (job?.data?.ruleId && job?.data?.commentId) {
      try {
        await db.insert(autoReplyLogs).values({
          ruleId: job.data.ruleId,
          commentId: job.data.commentId,
          commentText: job.data.commentText || "",
          replyText: 'Error generating/posting reply',
          status: 'failed'
        });
      } catch (logErr) {
        console.error('Failed to write failure log:', logErr);
      }
    }
    console.error(`Failed to process auto-reply ${job?.data?.ruleId}:`, error);
    throw error;
  }
}, { connection });

autoReplyWorker.on('completed', (job) => {
  console.log(`${job.id} has completed!`);
});

autoReplyWorker.on('failed', (job, err) => {
  console.log(`${job?.id} has failed with ${err.message}`);
});
