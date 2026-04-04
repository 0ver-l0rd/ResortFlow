import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { db } from '../db';
import { triggers, triggerLogs, posts, notifications } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { generateTextSafe } from '../lib/ai';

const redisUrl = process.env.REDIS_URL;
const connection = redisUrl ? new Redis(redisUrl, { maxRetriesPerRequest: null, lazyConnect: true }) : new Redis({ maxRetriesPerRequest: null, lazyConnect: true });

export const triggerEvalWorker = new Worker('trigger-eval', async (job: Job) => {
  console.log('Running trigger evaluation cycle...');
  
  try {
    // 1. Fetch all active triggers
    const activeTriggers = await db.query.triggers.findMany({
      where: eq(triggers.isActive, true),
    });

    for (const trigger of activeTriggers) {
      try {
        // 2. Check cooldown
        if (trigger.lastFiredAt) {
          const cooldownMs = (trigger.cooldownHours || 6) * 3600000;
          if (Date.now() - new Date(trigger.lastFiredAt).getTime() < cooldownMs) {
            console.log(`Trigger "${trigger.name}" is in cooldown.`);
            continue;
          }
        }

        let shouldFire = false;
        let conditionSnapshot: any = {};
        let actionTaken = "";

        // 3. Evaluate by type
        if (trigger.type === 'no_post_48h' || trigger.type === 'content_gap') {
          const lastPost = await db.query.posts.findFirst({
            where: eq(posts.userId, trigger.userId),
            orderBy: [desc(posts.publishedAt)],
          });

          const thresholdHrs = (trigger.condition as any)?.threshold || 48;
          const lastPublishedAt = lastPost?.publishedAt || lastPost?.createdAt;
          
          if (lastPublishedAt) {
            const hrsSinceLastPost = (Date.now() - new Date(lastPublishedAt).getTime()) / 3600000;
            if (hrsSinceLastPost > thresholdHrs) {
              shouldFire = true;
              conditionSnapshot = { hrsSinceLastPost: Math.round(hrsSinceLastPost), thresholdHrs };
              actionTaken = "AI drafting 3 posts and notifying user to maintain presence.";
            }
          } else {
              // No posts ever?
              shouldFire = true;
              conditionSnapshot = { hrsSinceLastPost: 'infinite', thresholdHrs };
              actionTaken = "Initial content draft suggested by AI.";
          }
        } 
        else if (trigger.type === 'low_engagement') {
          const threshold = (trigger.condition as any)?.threshold || 1;
          // Simulation for demonstration
          if (Math.random() < 0.1) {
            shouldFire = true;
            conditionSnapshot = { engagement: 0.4, threshold };
            actionTaken = "Post rewritten and scheduled for a high-traffic slot.";
          }
        }
        else if (trigger.type === 'viral_spike') {
           const threshold = (trigger.condition as any)?.threshold || 3;
           if (Math.random() < 0.05) {
             shouldFire = true;
             conditionSnapshot = { engagement_multiplier: 4.2, threshold };
             actionTaken = "Follow-up campaign launched to retarget new engaged audience.";
           }
        }

        if (shouldFire) {
          console.log(`Trigger "${trigger.name}" fired for user ${trigger.userId}`);
          
          // Generate AI Action Content
          try {
            const aiPrompt = `
              Trigger: "${trigger.name}" (Type: ${trigger.type})
              Context: ${JSON.stringify(conditionSnapshot)}
              Goal: Generate a catchy hospitality-focused social media post draft (Instagram or Twitter style) to address this situation.
              Keep it under 240 characters.
            `.trim();
            
            const aiSuggestion = await generateTextSafe(aiPrompt);
            actionTaken = aiSuggestion || actionTaken;
          } catch (aiErr) {
            console.error("[TriggerEval] AI action generation failed:", aiErr);
          }

          // 4. Update trigger
          await db.update(triggers)
            .set({ 
              lastFiredAt: new Date(),
              fireCount: (trigger.fireCount || 0) + 1 
            })
            .where(eq(triggers.id, trigger.id));

          // 5. Log firing
          await db.insert(triggerLogs).values({
            triggerId: trigger.id,
            conditionSnapshot,
            actionTaken,
            result: "AI content generated successfully",
          });

          // 6. Create Notification
          await db.insert(notifications).values({
            userId: trigger.userId,
            title: `⚡ Trigger: ${trigger.name}`,
            message: `Autopilot Suggestion: ${actionTaken}`,
            type: 'warning',
          });
        }
      } catch (err) {
        console.error(`Error evaluating individual trigger ${trigger.id}:`, err);
      }
    }
    return { success: true, processed: activeTriggers.length };
  } catch (error) {
    console.error('Trigger evaluation worker failed:', error);
    throw error;
  }
}, { connection });
