import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { db } from '../db';
import { autoReplyRules, autoReplyLogs } from '../db/schema';
import { eq } from 'drizzle-orm';
import { GoogleGenerativeAI } from "@google/generative-ai";

const redisUrl = process.env.REDIS_URL;
const connection = redisUrl ? new Redis(redisUrl, { maxRetriesPerRequest: null }) : new Redis({ maxRetriesPerRequest: null });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

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
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `${rule.aiPrompt || 'Reply to this social media comment politely and helpfully:'} \n\nComment: "${commentText}"`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      replyText = response.text();
    } else {
      replyText = rule.replyTemplate || 'Thank you for your comment!';
    }

    // 3. Mock posting reply (In reality, call platform API here)
    console.log(`Posting reply to ${platform}: "${replyText}"`);

    // 4. Log the reply
    await db.insert(autoReplyLogs).values({
      ruleId: rule.id,
      commentId,
      replyText,
    });

    return { success: true, replyText };
  } catch (error: any) {
    console.error(`Failed to process auto-reply ${ruleId}:`, error);
    throw error;
  }
}, { connection });

autoReplyWorker.on('completed', (job) => {
  console.log(`${job.id} has completed!`);
});

autoReplyWorker.on('failed', (job, err) => {
  console.log(`${job?.id} has failed with ${err.message}`);
});
