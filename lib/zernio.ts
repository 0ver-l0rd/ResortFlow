/**
 * Zernio (Late) API Client
 * Unified social media publishing API
 * Docs: https://docs.zernio.com
 */

import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { agentPreferences, socialAccounts } from "@/db/schema";
import { decrypt } from "@/lib/encryption";

const ZERNIO_BASE_URL = "https://zernio.com/api/v1";

export async function getUserZernioApiKey(userId: string): Promise<string | null> {
  const pref = await db.query.agentPreferences.findFirst({
    where: and(
      eq(agentPreferences.userId, userId),
      eq(agentPreferences.key, "zernio_api_key")
    ),
  });

  if (!pref?.value) {
    return null;
  }

  return decrypt(pref.value).trim();
}

/**
 * Maps a platform name (used in the app UI) to the Zernio account ID
 * stored in the database. Returns null if the platform isn't connected.
 */
export async function getUserZernioAccountId(userId: string, platform: string): Promise<string | null> {
  const record = await db.query.socialAccounts.findFirst({
    where: and(
      eq(socialAccounts.userId, userId),
      eq(socialAccounts.platform, platform.toLowerCase())
    ),
  });
  return record?.platformUserId ?? null;
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
  platforms: Array<Record<string, unknown> | string>;
  createdAt: string;
  [key: string]: unknown;
}

export interface ZernioAccount {
  _id: string;
  platform: string;
  username?: string;
  displayName?: string;
  avatarUrl?: string;
  status?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export interface ZernioPresignResult {
  uploadUrl: string;
  publicUrl: string;
  expires: string;
}

// ── API helpers ──────────────────────────────────────────────────────────────

async function zernioFetch<T>(
  path: string,
  options: RequestInit = {},
  apiKey?: string
): Promise<T> {
  const url = `${ZERNIO_BASE_URL}${path}`;
  
  if (!apiKey) {
    throw new Error("Zernio API key is required. Please connect your Zernio account in settings.");
  }

  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const body: Record<string, unknown> = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorObject =
      typeof body.error === "object" && body.error !== null
        ? (body.error as Record<string, unknown>)
        : null;
    const msg =
      (typeof errorObject?.message === "string" ? errorObject.message : undefined) ||
      (typeof body.message === "string" ? body.message : undefined) ||
      (typeof body.error === "string" ? body.error : undefined) ||
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
  opts: ZernioCreatePostOptions,
  apiKey?: string
): Promise<ZernioPost> {
  const payload: Record<string, unknown> = {
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
  }, apiKey);

  return result.post;
}

/**
 * List all connected social accounts on Zernio for a user.
 */
export async function listUserZernioAccounts(userId: string): Promise<ZernioAccount[]> {
  const apiKey = await getUserZernioApiKey(userId);
  if (!apiKey) {
    return [];
  }

  const result = await zernioFetch<{ accounts: ZernioAccount[] }>("/accounts", {}, apiKey);
  return result.accounts;
}

/**
 * List posts from Zernio for a user.
 */
export async function listUserZernioPosts(userId: string): Promise<ZernioPost[]> {
  const apiKey = await getUserZernioApiKey(userId);
  if (!apiKey) {
    return [];
  }

  const result = await zernioFetch<{ posts: ZernioPost[] }>("/posts", {}, apiKey);
  return result.posts;
}

/**
 * Get a presigned upload URL from Zernio for media uploads.
 */
export async function getZernioPresignedUrl(
  fileName: string,
  fileType: string,
  apiKey?: string
): Promise<ZernioPresignResult> {
  const result = await zernioFetch<ZernioPresignResult>("/media/presign", {
    method: "POST",
    body: JSON.stringify({ fileName, fileType }),
  }, apiKey);
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

export interface ZernioAccountAnalytics {
  platform: string;
  followers?: number;
  follower_count?: number;
  impressions?: number;
  reach?: number;
  clicks?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  engagementRate?: number;
  [key: string]: unknown;
}

export interface ZernioPostAnalytics {
  impressions?: number;
  likes?: number;
  clicks?: number;
  shares?: number;
  comments?: number;
  [key: string]: unknown;
}

/**
 * Convenience: presign + upload in one call. Returns the public URL.
 */
export async function uploadMediaToZernio(
  fileName: string,
  fileType: string,
  fileBuffer: Buffer,
  apiKey?: string
): Promise<string> {
  const { uploadUrl, publicUrl } = await getZernioPresignedUrl(fileName, fileType, apiKey);
  await uploadToZernioPresigned(uploadUrl, fileBuffer, fileType);
  return publicUrl;
}

/**
 * Get analytics for a specific connected account via Zernio.
 */
export async function getZernioAccountAnalytics(
  accountId: string,
  startDate?: string,
  endDate?: string,
  apiKey?: string
): Promise<ZernioAccountAnalytics> {
  let query = "";
  const params: string[] = [];
  if (startDate) params.push(`startDate=${startDate}`);
  if (endDate) params.push(`endDate=${endDate}`);
  if (params.length > 0) {
    query = `?${params.join("&")}`;
  }
  const result = await zernioFetch<{ analytics: ZernioAccountAnalytics }>(
    `/analytics/account/${accountId}${query}`,
    {},
    apiKey
  );
  return result.analytics;
}

export interface ZernioProfile {
  _id: string;
  name: string;
}

export async function getZernioProfiles(apiKey: string): Promise<ZernioProfile[]> {
  const result = await zernioFetch<{ profiles: ZernioProfile[] }>("/profiles", {}, apiKey);
  return result.profiles;
}

export async function createZernioProfile(name: string, apiKey: string): Promise<ZernioProfile> {
  const result = await zernioFetch<{ profile: ZernioProfile }>("/profiles", {
    method: "POST",
    body: JSON.stringify({ name }),
  }, apiKey);
  return result.profile;
}

export async function getZernioConnectUrl(
  platform: string,
  redirectUrl: string,
  apiKey: string,
  profileId?: string
): Promise<string> {
  let url = `/connect/${platform}?redirect_url=${encodeURIComponent(redirectUrl)}`;
  if (profileId) {
    url += `&profileId=${profileId}`;
  }
  const result = await zernioFetch<{ authUrl: string }>(
    url,
    { method: "GET" },
    apiKey
  );
  return result.authUrl;
}
export async function getZernioPostAnalytics(
  postId: string,
  apiKey?: string
): Promise<ZernioPostAnalytics> {
  const result = await zernioFetch<{ analytics: ZernioPostAnalytics }>(
    `/analytics/${postId}`,
    {},
    apiKey
  );
  return result.analytics;
}
