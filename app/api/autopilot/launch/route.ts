import { NextResponse } from "next/server";
import { getDemoUserId } from "@/lib/demo-auth";
import { db } from "@/db";
import { campaigns, campaignPosts, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { postPublishQueue } from "@/lib/queue";

export async function POST(req: Request) {
  try {
    const userId = getDemoUserId();

    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId)
    });
    if (!user) return new NextResponse("User not found", { status: 404 });

    const { goal, plan } = await req.json();

    const [campaign] = await db.insert(campaigns).values({
      userId: user.id,
      goal: goal.substring(0, 200),
      goalText: goal,
      status: "active",
      planJson: plan,
      predictedRevenue: plan.predictedRevenue?.mid || 0,
      startedAt: new Date(),
    }).returning();

    if (plan.posts && plan.posts.length > 0) {
      for (const post of plan.posts) {
        // Here we just insert a record for the campaign post wrapper
        await db.insert(campaignPosts).values({
          campaignId: campaign.id,
          platform: post.platform,
          status: "pending",
        });
        
        // In a real flow, we'd also create an actual `posts` record here
        // and enqueue real jobs to BullMQ.
        const delay = Math.max(0, new Date(post.scheduledAt).getTime() - Date.now());
        
        // Example mock queue add
        // await postPublishQueue.add('publish-autopilot-post', {
        //   campaignId: campaign.id,
        //   content: post.content,
        //   platform: post.platform
        // }, { delay });
      }
    }

    return NextResponse.json({ success: true, campaignId: campaign.id });
  } catch (error) {
    console.error("Autopilot launch error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
