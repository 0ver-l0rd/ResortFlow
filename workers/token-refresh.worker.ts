import { Worker } from 'bullmq';
import Redis from 'ioredis';
import { db } from '@/db';
import { socialAccounts } from '@/db/schema';
import { lt, and, eq } from 'drizzle-orm';
import { getPlatform } from '@/lib/platforms/factory';
import { decrypt, encrypt } from '@/lib/encryption';

const redisUrl = process.env.REDIS_URL;
const connection = redisUrl ? new Redis(redisUrl, { maxRetriesPerRequest: null }) : new Redis({ maxRetriesPerRequest: null });

export const tokenRefreshWorker = new Worker('token-refresh', async (job) => {
  console.log('Starting token-refresh job');

  // Find accounts where tokens are expiring in the next 24 hours
  const now = new Date();
  const threshold = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const expiringAccounts = await db.query.socialAccounts.findMany({
    where: and(
      lt(socialAccounts.expiresAt, threshold),
      eq(socialAccounts.platform, 'twitter') // Start with Twitter as it has the refresh strategy
    ),
  });

  console.log(`Found ${expiringAccounts.length} expiring accounts`);

  for (const account of expiringAccounts) {
    if (!account.refreshToken) continue;

    try {
      const platform = getPlatform(account.platform);
      const decryptedRefreshToken = decrypt(account.refreshToken);

      const newTokens = await platform.refreshToken(decryptedRefreshToken);

      await db.update(socialAccounts)
        .set({
          accessToken: encrypt(newTokens.accessToken),
          refreshToken: newTokens.refreshToken ? encrypt(newTokens.refreshToken) : account.refreshToken,
          expiresAt: newTokens.expiresAt,
        })
        .where(eq(socialAccounts.id, account.id));

      console.log(`Successfully refreshed token for ${account.platform} account ${account.id}`);
    } catch (error) {
      console.error(`Failed to refresh token for account ${account.id}:`, error);
      // In a real app, you might want to mark the account as 'disconnected' or notify the user
    }
  }
}, { connection });
