import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { db } from '../db';
import { contacts, messageCampaigns, campaigns } from '../db/schema';
import { eq, inArray } from 'drizzle-orm';
import { sendMessage } from '../lib/messaging/whatsapp';

const redisUrl = process.env.REDIS_URL;
const connection = redisUrl ? new Redis(redisUrl, { maxRetriesPerRequest: null, lazyConnect: true }) : new Redis({ maxRetriesPerRequest: null, lazyConnect: true });

export const whatsappBlastWorker = new Worker('whatsapp-blast', async (job: Job) => {
  const { campaignId, segmentIds, message, mediaUrl } = job.data;
  console.log(`Processing WhatsApp blast for campaign ${campaignId}`);

  try {
    // 1. Fetch contacts
    // If segmentIds provided, we should filter by them. 
    // For now, we fetch all opted-in contacts for simplicity.
    const targetContacts = await db.query.contacts.findMany({
      where: eq(contacts.whatsappOptIn, true),
    });

    if (targetContacts.length === 0) {
      console.log('No opted-in contacts found.');
      return { success: true, sentCount: 0 };
    }

    // 2. Send messages in batches
    let sentCount = 0;
    const batchSize = 10; // Smaller batches for hackathon stability
    
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

    // 3. Update campaign stats
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
