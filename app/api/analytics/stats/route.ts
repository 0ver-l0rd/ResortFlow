import { NextResponse } from "next/server";
import { getDemoUserId } from "@/lib/demo-auth";
import { db } from "@/db";
import { 
  socialAccounts, 
  posts, 
  postPlatformResults, 
  contacts, 
  segmentMembers,
  audienceSegments
} from "@/db/schema";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { eq, and, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const userId = getDemoUserId();

    const user = await getUserByClerkId(userId);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { searchParams } = new URL(request.url);
    const platform = searchParams.get("platform") || "All Platforms";

    // 1. Total Reach (Contacts + Segment Members)
    const contactsCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(contacts)
      .where(eq(contacts.userId, user.id));
    
    // In a real app, we'd filter segment members by platform if needed
    const segmentMembersCount = await db
      .select({ count: sql<number>`count(distinct platform_user_id)` })
      .from(segmentMembers)
      .innerJoin(audienceSegments, eq(segmentMembers.segmentId, audienceSegments.id))
      .where(eq(audienceSegments.userId, user.id));

    const totalReach = (contactsCount[0]?.count || 0) + (segmentMembersCount[0]?.count || 0);

    // 2. Avg Engagement (Scale 0-100 to 0-10%)
    const avgEngagementRes = await db
      .select({ avg: sql<number>`avg(engagement_score)` })
      .from(segmentMembers)
      .innerJoin(audienceSegments, eq(segmentMembers.segmentId, audienceSegments.id))
      .where(
        platform === "All Platforms" 
          ? eq(audienceSegments.userId, user.id)
          : and(eq(audienceSegments.userId, user.id), eq(segmentMembers.platform, platform.toLowerCase()))
      );
    
    const avgEngagement = avgEngagementRes[0]?.avg ? (avgEngagementRes[0].avg / 10).toFixed(2) : "0.00";

    // 3. Total Followers (Sum of member counts)
    const followersRes = await db
      .select({ sum: sql<number>`sum(member_count)` })
      .from(audienceSegments)
      .where(eq(audienceSegments.userId, user.id));
    
    const totalFollowers = followersRes[0]?.sum || 0;

    // 4. Growth Rate (Based on success vs total post attempts)
    const postResults = await db
      .select({ 
        status: postPlatformResults.status,
        count: sql<number>`count(*)`
      })
      .from(postPlatformResults)
      .innerJoin(posts, eq(postPlatformResults.postId, posts.id))
      .where(
        platform === "All Platforms"
          ? eq(posts.userId, user.id)
          : and(eq(posts.userId, user.id), eq(postPlatformResults.platform, platform.toLowerCase()))
      )
      .groupBy(postPlatformResults.status);

    const successful = postResults.find(r => r.status === "success")?.count || 0;
    const totalPosts = postResults.reduce((acc, r) => acc + r.count, 0);
    const growthRate = totalPosts > 0 ? ((successful / totalPosts) * 10).toFixed(1) : "0.0";

    return NextResponse.json({
      reach: totalReach,
      engagement: `${avgEngagement}%`,
      followers: totalFollowers,
      growth: `${growthRate}%`,
      raw: {
        successful,
        totalPosts,
        contacts: contactsCount[0]?.count || 0,
        segments: segmentMembersCount[0]?.count || 0
      }
    });
  } catch (error) {
    console.error("Analytics Stats Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
