import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { db } from '../db';
import { contacts, messageCampaigns, campaigns } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { sendMessage } from '../lib/messaging/whatsapp';

const redisUrl = process.env.REDIS_URL;
const connection = redisUrl ? new Redis(redisUrl, { maxRetriesPerRequest: null, lazyConnect: true }) : new Redis({ maxRetriesPerRequest: null, lazyConnect: true });

export const whatsappBlastWorker = new Worker('whatsapp-blast', async (job: Job) => {
  const { campaignId, segmentIds, message, mediaUrl } = job.data;
  console.log(`Processing WhatsApp blast for campaign ${campaignId}`);

  try {
    // 1. Fetch the campaign to verify ownership (userId)
    let userId: string | null = null;
    if (campaignId) {
      const campaignRecord = await db.query.campaigns.findFirst({
        where: eq(campaigns.id, campaignId),
      });
      if (campaignRecord) {
        userId = campaignRecord.userId;
      }
    }

    if (!userId) {
      console.warn(`[whatsappBlastWorker] Aborting. Campaign ${campaignId} owner not found.`);
      return { success: false, reason: "owner_not_found" };
    }

    // 2. Fetch only opted-in contacts belonging to the campaign creator
    const targetContacts = await db.query.contacts.findMany({
      where: and(
        eq(contacts.whatsappOptIn, true),
        eq(contacts.userId, userId)
      ),
    });

    if (targetContacts.length === 0) {
      console.log('No opted-in contacts found for this user.');
      return { success: true, sentCount: 0 };
    }

    // 3. Send messages in batches
    let sentCount = 0;
    const batchSize = 10;
    
    for (let i = 0; i < targetContacts.length; i += batchSize) {
      const batch = targetContacts.slice(i, i + batchSize);
      const results = await Promise.allSettled(
        batch.map(contact => sendMessage(contact.phone, message, mediaUrl))
      );
      
      const successful = results.filter(r => r.status === 'fulfilled').length;
      sentCount += successful;
      
      // Update job progress
      const progress = Math.round((i + batch.length) / targetContacts.length * 100);
      await job.updateProgress(progress);
    }

    // 4. Update campaign stats
    if (campaignId) {
      await db.update(messageCampaigns)
        .set({ 
          sentCount: sentCount,
          status: 'completed' 
        })
        .where(eq(messageCampaigns.campaignId, campaignId));
    }

    return { success: true, sentCount };
  } catch (error) {
    console.error(`WhatsApp blast failed:`, error);
    throw error;
  }
}, { connection });
