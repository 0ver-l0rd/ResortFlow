import { Queue } from 'bullmq';
import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL;
const connection = redisUrl ? new Redis(redisUrl, { maxRetriesPerRequest: null }) : new Redis({ maxRetriesPerRequest: null });

export const postPublishQueue = new Queue('post-publish', { connection });
export const autoReplyQueue = new Queue('auto-reply', { connection });
export const tokenRefreshQueue = new Queue('token-refresh', { connection });
