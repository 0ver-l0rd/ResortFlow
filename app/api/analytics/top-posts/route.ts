import { NextResponse } from "next/server";
import { getDbUser } from "@/lib/auth";
import { db } from "@/db";
import { posts, postPlatformResults } from "@/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { getZernioPostAnalytics } from "@/lib/zernio";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getDbUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Fetch the 5 most recently published posts with their platform results
    const results = await db
      .select({
        id: posts.id,
        content: posts.content,
        publishedAt: posts.publishedAt,
        platforms: posts.platforms,
        mediaUrls: posts.mediaUrls,
        platformResultId: postPlatformResults.id,
        platform: postPlatformResults.platform,
        error: postPlatformResults.error,
        platformPostId: postPlatformResults.platformPostId,
      })
      .from(posts)
      .leftJoin(postPlatformResults, eq(posts.id, postPlatformResults.postId))
      .where(
        and(
          eq(posts.userId, user.id),
          eq(posts.status, "published")
        )
      )
      .orderBy(desc(posts.publishedAt))
      .limit(10); // Fetch more to allow for multi-platform filtering

    // Grouping results by post
    const postMap = new Map();
    results.forEach((row: any) => {
      if (!postMap.has(row.id)) {
        postMap.set(row.id, {
          ...row,
          platform: row.platform || (Array.isArray(row.platforms) ? row.platforms[0] : "Twitter"),
          isSimulated: row.error === "SIMULATED_SUCCESS",
        });
      }
    });

    const postsList = Array.from(postMap.values());
    const formattedPosts = [];

    for (const post of postsList) {
      let likes = "N/A";
      let comments = "N/A";
      let shares = "N/A";
      let engagement = "N/A";

      // If we have a real Zernio platform post ID, fetch actual analytics
      if (post.platformPostId && !post.isSimulated) {
        try {
          const metrics = await getZernioPostAnalytics(post.platformPostId);
          if (metrics) {
            likes = metrics.likes !== undefined ? String(metrics.likes) : "0";
            comments = metrics.comments !== undefined ? String(metrics.comments) : "0";
            shares = metrics.shares !== undefined ? String(metrics.shares) : "0";

            const impressions = metrics.impressions || 1;
            const actions = (metrics.likes || 0) + (metrics.comments || 0) + (metrics.shares || 0);
            engagement = `${((actions / impressions) * 100).toFixed(1)}%`;
          }
        } catch (err: any) {
          console.warn(`[Zernio Top Posts API] Failed to fetch analytics for post ${post.platformPostId}:`, err.message);
        }
      }

      formattedPosts.push({
        id: post.id,
        content: post.content,
        platform: post.platform.charAt(0).toUpperCase() + post.platform.slice(1),
        isSimulated: post.isSimulated,
        likes,
        comments,
        shares,
        date: post.publishedAt 
          ? new Date(post.publishedAt).toLocaleDateString() 
          : "Recently",
        engagement,
        mediaUrls: post.mediaUrls,
      });
    }

    return NextResponse.json(formattedPosts.slice(0, 5));
  } catch (error) {
    console.error("Top Posts API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
