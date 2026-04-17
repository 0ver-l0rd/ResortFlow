import { NextResponse } from "next/server";
import { getDemoUserId } from "@/lib/demo-auth";
import { db } from "@/db";
import { campaigns, campaignPosts, posts as postsTable, postPlatformResults } from "@/db/schema";
import { createZernioPost, getZernioAccountId } from "@/lib/zernio";
import { generateAndStoreImage, getOptimizedDimensions } from "@/lib/pollinations";

export async function POST(req: Request) {
  try {
    const user = await db.query.users.findFirst();
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
        
        // RESTRICTION: Only post on accounts that are actually connected
        const accountId = getZernioAccountId(post.platform);
        if (!accountId) {
          console.log(`[Autopilot] Skipping ${post.platform} because it is not connected.`);
          continue; // Move to the next post
        }

        const scheduledTime = new Date(post.scheduledAt);
        const isPublishNow = post.publishNow !== false; // Default to true if not specified

        // ── AI Image Generation (New) ─────────────────────────────────────────
        let mediaUrls: string[] = [];
        if (post.imagePrompt) {
            console.log(`[Autopilot] Generating visual for ${post.platform}...`);
            const dims = getOptimizedDimensions(post.platform);
            const imageUrl = await generateAndStoreImage(post.imagePrompt, {
                width: dims.width,
                height: dims.height,
                enhance: true
            });
            mediaUrls = [imageUrl];
        }

        // 1. Save local post draft
        const [newPost] = await db.insert(postsTable).values({
          userId: user.id,
          content: post.content || "",
          mediaUrls: mediaUrls,
          platforms: [post.platform],
          status: isPublishNow ? "published" : "scheduled",
          scheduledAt: isPublishNow ? new Date() : scheduledTime,
          isAiGenerated: true,
          aiPrompt: `Campaign: ${goal}`,
        }).returning();

        // 2. Link post to the campaign
        await db.insert(campaignPosts).values({
          campaignId: campaign.id,
          postId: newPost.id,
          platform: post.platform,
          status: isPublishNow ? "published" : "scheduled",
        });

        // 3. Dispatch straight to Zernio API for true scheduling
        try {
          const zernioConfig: any = {
            content: post.content,
            platforms: [{ platform: post.platform, accountId }],
            mediaItems: mediaUrls.length > 0 ? mediaUrls.map(url => ({ url, type: "image" })) : undefined,
          };
          if (isPublishNow) zernioConfig.publishNow = true;
          else {
            zernioConfig.scheduledFor = scheduledTime.toISOString();
            zernioConfig.timezone = "Asia/Dubai";
          }

          const zernioPost = await createZernioPost(zernioConfig);

          await db.insert(postPlatformResults).values({
            postId: newPost.id,
            platform: post.platform,
            status: "success",
            platformPostId: zernioPost._id,
          });

        } catch (err: any) {
          console.error(`Zernio schedule failure for ${post.platform}:`, err);
          await db.insert(postPlatformResults).values({
            postId: newPost.id,
            platform: post.platform,
            status: "error",
            error: err.message || "Failed to schedule on Zernio",
          });
        }
      }
    }

    return NextResponse.json({ success: true, campaignId: campaign.id });
  } catch (error) {
    console.error("Autopilot launch error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
