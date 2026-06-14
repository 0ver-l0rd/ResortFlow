import { NextResponse } from "next/server";
import { getDbUser } from "@/lib/auth";
import { db } from "@/db";
import { 
  socialAccounts, 
  posts, 
  postPlatformResults, 
  contacts, 
  segmentMembers,
  audienceSegments
} from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { getUserZernioApiKey, getZernioAccountAnalytics } from "@/lib/zernio";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const user = await getDbUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const platform = searchParams.get("platform") || "All Platforms";
    const isAllPlatforms = platform === "All Platforms";
    const normalizedPlatform = platform.toLowerCase().split("/")[0].trim();

    // 1. Fetch user's local social accounts
    const userAccounts = await db.query.socialAccounts.findMany({
      where: eq(socialAccounts.userId, user.id)
    });
    const userZernioApiKey = await getUserZernioApiKey(user.id);

    let zernioReach = 0;
    let zernioFollowers = 0;
    let zernioLikes = 0;
    let zernioComments = 0;
    let zernioShares = 0;
    let zernioImpressions = 0;
    let hasRealZernioData = false;

    if (userZernioApiKey) {
      for (const acc of userAccounts) {
        if (!isAllPlatforms && acc.platform.toLowerCase() !== normalizedPlatform) {
          continue;
        }

        if (!acc.platformUserId) {
          continue;
        }

        try {
          const analytics = await getZernioAccountAnalytics(
            acc.platformUserId,
            undefined,
            undefined,
            userZernioApiKey
          );
          if (analytics) {
            zernioFollowers += Number(analytics.followers || analytics.follower_count || 0);
            zernioReach += Number(analytics.reach || 0);
            zernioLikes += Number(analytics.likes || 0);
            zernioComments += Number(analytics.comments || 0);
            zernioShares += Number(analytics.shares || 0);
            zernioImpressions += Number(analytics.impressions || 0);
            hasRealZernioData = true;
          }
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "Unknown error";
          console.warn(`[Zernio Stats API] Failed to fetch analytics for account ${acc.platformUserId}:`, message);
        }
      }
    }

    // 2. Database Fallback: Total Reach (Contacts + Segment Members)
    const contactsCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(contacts)
      .where(eq(contacts.userId, user.id));
    
    const segmentMembersCount = await db
      .select({ count: sql<number>`count(distinct platform_user_id)` })
      .from(segmentMembers)
      .innerJoin(audienceSegments, eq(segmentMembers.segmentId, audienceSegments.id))
      .where(eq(audienceSegments.userId, user.id));

    const dbReach = (contactsCount[0]?.count || 0) + (segmentMembersCount[0]?.count || 0);

    // 3. Database Fallback: Avg Engagement (Scale 0-100 to 0-10%)
    const avgEngagementRes = await db
      .select({ avg: sql<number>`avg(engagement_score)` })
      .from(segmentMembers)
      .innerJoin(audienceSegments, eq(segmentMembers.segmentId, audienceSegments.id))
      .where(
        isAllPlatforms
          ? eq(audienceSegments.userId, user.id)
          : and(eq(audienceSegments.userId, user.id), eq(segmentMembers.platform, normalizedPlatform))
      );
    
    const dbEngagement = avgEngagementRes[0]?.avg ? (avgEngagementRes[0].avg / 10).toFixed(2) : "0.00";

    // 4. Database Fallback: Total Followers (Sum of member counts)
    const followersRes = await db
      .select({ sum: sql<number>`sum(member_count)` })
      .from(audienceSegments)
      .where(eq(audienceSegments.userId, user.id));
    
    const dbFollowers = followersRes[0]?.sum || 0;

    // 5. Growth Rate (Based on success vs total post attempts)
    const postResults = await db
      .select({ 
        status: postPlatformResults.status,
        count: sql<number>`count(*)`
      })
      .from(postPlatformResults)
      .innerJoin(posts, eq(postPlatformResults.postId, posts.id))
      .where(
        isAllPlatforms
          ? eq(posts.userId, user.id)
          : and(eq(posts.userId, user.id), eq(postPlatformResults.platform, normalizedPlatform))
      )
      .groupBy(postPlatformResults.status);

    const successful = postResults.find(r => r.status === "success")?.count || 0;
    const totalPosts = postResults.reduce((acc, r) => acc + r.count, 0);
    const growthRate = totalPosts > 0 ? ((successful / totalPosts) * 10).toFixed(1) : "0.0";

    // Merge Zernio Metrics & Database metrics
    let reach = dbReach;
    let followers = dbFollowers;
    let engagement = `${dbEngagement}%`;

    if (hasRealZernioData) {
      if (zernioReach > 0) reach = zernioReach;
      if (zernioFollowers > 0) followers = zernioFollowers;

      const totalActions = zernioLikes + zernioComments + zernioShares;
      if (totalActions > 0 && zernioImpressions > 0) {
        engagement = `${((totalActions / zernioImpressions) * 100).toFixed(2)}%`;
      } else if (totalActions > 0 && zernioFollowers > 0) {
        engagement = `${((totalActions / zernioFollowers) * 100).toFixed(2)}%`;
      }
    }

    return NextResponse.json({
      reach,
      engagement,
      followers,
      growth: `${growthRate}%`,
      raw: {
        successful,
        totalPosts,
        contacts: contactsCount[0]?.count || 0,
        segments: segmentMembersCount[0]?.count || 0,
        source: hasRealZernioData ? "zernio" : "local_db"
      }
    });
  } catch (error) {
    console.error("Analytics Stats Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
