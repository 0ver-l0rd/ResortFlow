import { NextResponse } from "next/server";
import { getDbUser } from "@/lib/auth";
import { db } from "@/db";
import { posts, postPlatformResults } from "@/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";

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

    const formattedPosts = Array.from(postMap.values()).map((post: any) => {
      return {
        id: post.id,
        content: post.content,
        platform: post.platform.charAt(0).toUpperCase() + post.platform.slice(1),
        isSimulated: post.isSimulated,
        likes: "N/A",
        comments: "N/A",
        shares: "N/A",
        date: post.publishedAt 
          ? new Date(post.publishedAt).toLocaleDateString() 
          : "Recently",
        engagement: "N/A",
        mediaUrls: post.mediaUrls,
      };
    });

    return NextResponse.json(formattedPosts.slice(0, 5));
  } catch (error) {
    console.error("Top Posts API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
