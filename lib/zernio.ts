/**
 * Zernio (Late) API Client
 * Unified social media publishing API
 * Docs: https://docs.zernio.com
 */

const ZERNIO_BASE_URL = "https://zernio.com/api/v1";

function getApiKey(): string {
  const key = process.env.ZERNIO_API_KEY;
  if (!key) throw new Error("ZERNIO_API_KEY is not set");
  return key;
}

// ── Account ID mapping ───────────────────────────────────────────────────────

/**
 * Maps a platform name (used in the app UI) to the Zernio account ID
 * stored in .env. Returns null if the platform isn't connected on Zernio.
 */
export function getZernioAccountId(platform: string): string | null {
  const map: Record<string, string | undefined> = {
    twitter: process.env.ZERNIO_TWITTER_ACCOUNT_ID,
    instagram: process.env.ZERNIO_INSTAGRAM_ACCOUNT_ID,
    // Add more as you connect them on Zernio dashboard
    // linkedin: process.env.ZERNIO_LINKEDIN_ACCOUNT_ID,
    // facebook: process.env.ZERNIO_FACEBOOK_ACCOUNT_ID,
    // tiktok:   process.env.ZERNIO_TIKTOK_ACCOUNT_ID,
    // youtube:  process.env.ZERNIO_YOUTUBE_ACCOUNT_ID,
    // pinterest: process.env.ZERNIO_PINTEREST_ACCOUNT_ID,
  };
  return map[platform.toLowerCase()] ?? null;
}

// ── Types ────────────────────────────────────────────────────────────────────

export interface ZernioPlatformTarget {
  platform: string;
  accountId: string;
}

export interface ZernioMediaItem {
  url: string;
  type: "image" | "video";
}

export interface ZernioCreatePostOptions {
  content: string;
  platforms: ZernioPlatformTarget[];
  mediaItems?: ZernioMediaItem[];
  publishNow?: boolean;
  scheduledFor?: string;   // ISO 8601 datetime
  timezone?: string;       // e.g. "America/New_York"
}

export interface ZernioPost {
  _id: string;
  content: string;
  status: string;
  platforms: any[];
  createdAt: string;
  [key: string]: any;
}

export interface ZernioAccount {
  _id: string;
  platform: string;
  username?: string;
  displayName?: string;
  avatarUrl?: string;
  status?: string;
  createdAt?: string;
  [key: string]: any;
}

export interface ZernioPresignResult {
  uploadUrl: string;
  publicUrl: string;
  expires: string;
}

// ── API helpers ──────────────────────────────────────────────────────────────

async function zernioFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${ZERNIO_BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg =
      (body as any)?.error?.message ||
      (body as any)?.message ||
      (body as any)?.error ||
      res.statusText;
    throw new Error(`Zernio API ${res.status}: ${msg}`);
  }

  return body as T;
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Create (and optionally publish / schedule) a post via Zernio.
 */
export async function createZernioPost(
  opts: ZernioCreatePostOptions
): Promise<ZernioPost> {
  const payload: Record<string, any> = {
    content: opts.content,
    platforms: opts.platforms,
  };

  if (opts.mediaItems && opts.mediaItems.length > 0) {
    payload.mediaItems = opts.mediaItems;
  }

  if (opts.publishNow) {
    payload.publishNow = true;
  } else if (opts.scheduledFor) {
    payload.scheduledFor = opts.scheduledFor;
    if (opts.timezone) payload.timezone = opts.timezone;
  }

  const result = await zernioFetch<{ post: ZernioPost }>("/posts", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return result.post;
}

/**
 * List all connected social accounts on Zernio.
 */
export async function listZernioAccounts(): Promise<ZernioAccount[]> {
  const result = await zernioFetch<{ accounts: ZernioAccount[] }>("/accounts");
  return result.accounts;
}

/**
 * List posts from Zernio.
 */
export async function listZernioPosts(): Promise<ZernioPost[]> {
  const result = await zernioFetch<{ posts: ZernioPost[] }>("/posts");
  return result.posts;
}

/**
 * Get a presigned upload URL from Zernio for media uploads.
 */
export async function getZernioPresignedUrl(
  fileName: string,
  fileType: string
): Promise<ZernioPresignResult> {
  const result = await zernioFetch<ZernioPresignResult>("/media/presign", {
    method: "POST",
    body: JSON.stringify({ fileName, fileType }),
  });
  return result;
}

/**
 * Upload a file buffer to a Zernio presigned URL.
 * Returns the public URL for use in posts.
 */
export async function uploadToZernioPresigned(
  uploadUrl: string,
  fileBuffer: Buffer,
  contentType: string
): Promise<void> {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: new Uint8Array(fileBuffer),
  });

  if (!res.ok) {
    throw new Error(`Zernio media upload failed: ${res.status} ${res.statusText}`);
  }
}

/**
 * Convenience: presign + upload in one call. Returns the public URL.
 */
export async function uploadMediaToZernio(
  fileName: string,
  fileType: string,
  fileBuffer: Buffer
): Promise<string> {
  const { uploadUrl, publicUrl } = await getZernioPresignedUrl(fileName, fileType);
  await uploadToZernioPresigned(uploadUrl, fileBuffer, fileType);
  return publicUrl;
}
