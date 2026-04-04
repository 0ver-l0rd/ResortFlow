import { Queue } from 'bullmq';
import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL;
const connection = redisUrl ? new Redis(redisUrl, { maxRetriesPerRequest: null, lazyConnect: true }) : new Redis({ maxRetriesPerRequest: null, lazyConnect: true });

export const postPublishQueue = new Queue('post-publish', { connection });
export const autoReplyQueue = new Queue('auto-reply', { connection });
export const tokenRefreshQueue = new Queue('token-refresh', { connection });
export const triggerEvalQueue = new Queue('trigger-eval', { connection });
export const whatsappBlastQueue = new Queue('whatsapp-blast', { connection });
