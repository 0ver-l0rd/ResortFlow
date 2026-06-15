import { Queue } from 'bullmq';
import Redis from 'ioredis';

let connection: Redis | null = null;

function getConnection() {
  if (!connection) {
    const redisUrl = process.env.REDIS_URL;
    connection = redisUrl 
      ? new Redis(redisUrl, { maxRetriesPerRequest: null, lazyConnect: true })
      : new Redis({ maxRetriesPerRequest: null, lazyConnect: true, host: '127.0.0.1', port: 6379 });
  }
  return connection;
}

export let postPublishQueue: Queue | null = null;
export let autoReplyQueue: Queue | null = null;
export let tokenRefreshQueue: Queue | null = null;
export let triggerEvalQueue: Queue | null = null;
export let whatsappBlastQueue: Queue | null = null;

export function getPostPublishQueue() {
  if (!postPublishQueue) {
    postPublishQueue = new Queue('post-publish', { connection: getConnection() });
  }
  return postPublishQueue;
}

export function getAutoReplyQueue() {
  if (!autoReplyQueue) {
    autoReplyQueue = new Queue('auto-reply', { connection: getConnection() });
  }
  return autoReplyQueue;
}

export function getTokenRefreshQueue() {
  if (!tokenRefreshQueue) {
    tokenRefreshQueue = new Queue('token-refresh', { connection: getConnection() });
  }
  return tokenRefreshQueue;
}

export function getTriggerEvalQueue() {
  if (!triggerEvalQueue) {
    triggerEvalQueue = new Queue('trigger-eval', { connection: getConnection() });
  }
  return triggerEvalQueue;
}

export function getWhatsappBlastQueue() {
  if (!whatsappBlastQueue) {
    whatsappBlastQueue = new Queue('whatsapp-blast', { connection: getConnection() });
  }
  return whatsappBlastQueue;
}
