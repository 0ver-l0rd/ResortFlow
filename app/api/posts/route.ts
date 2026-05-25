import { NextResponse } from "next/server";
import { db } from "@/db";
import { posts, postPlatformResults, users } from "@/db/schema";
import { getDemoUserId } from "@/lib/demo-auth";
import { eq, desc, and, gte, lte, or } from "drizzle-orm";
import {
  createZernioPost,
  getZernioAccountId,
  ZernioPlatformTarget,
  ZernioMediaItem,
} from "@/lib/zernio";

export async function GET(request: Request) {
  try {
    const userId = getDemoUserId();

    let dbUser = await db.query.users.findFirst();
    
    if (!dbUser) {
      return NextResponse.json({ error: "No users found in DB. Run seeds." }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const platform = searchParams.get("platform");
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");

    const conditions: any[] = [eq(posts.userId, dbUser.id)];
    
    if (startDate && endDate) {
      conditions.push(
        or(
          and(gte(posts.scheduledAt, new Date(startDate)), lte(posts.scheduledAt, new Date(endDate))),
          and(gte(posts.createdAt, new Date(startDate)), lte(posts.createdAt, new Date(endDate)))
        )
      );
    } else if (startDate) {
      conditions.push(
        or(gte(posts.scheduledAt, new Date(startDate)), gte(posts.createdAt, new Date(startDate)))
      );
    } else if (endDate) {
      conditions.push(
        or(lte(posts.scheduledAt, new Date(endDate)), lte(posts.createdAt, new Date(endDate)))
      );
    }

    let query = db
      .select()
      .from(posts)
      .where(and(...conditions))
      .orderBy(desc(posts.createdAt));

    const rows = await query;

    const filtered = rows.filter((p) => {
      if (status && p.status !== status) return false;
      if (platform && !p.platforms.includes(platform)) return false;
      return true;
    });

    return NextResponse.json(filtered);
  } catch (error) {
    console.error("List Posts Error:", error);
    return NextResponse.json({ error: "Failed to list posts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = getDemoUserId();

    let dbUser = await db.query.users.findFirst();

    if (!dbUser) {
      return NextResponse.json({ error: "No users found in database" }, { status: 404 });
    }

    const { content, mediaUrls, platforms, scheduledAt, status, isAiGenerated, aiPrompt } = await request.json();

    if (!content && (!mediaUrls || mediaUrls.length === 0)) {
      return NextResponse.json({ error: "Content or media is required" }, { status: 400 });
    }

    if (!platforms || platforms.length === 0) {
      return NextResponse.json({ error: "At least one platform is required" }, { status: 400 });
    }

    // Insert post into local database
    const [newPost] = await db.insert(posts).values({
      userId: dbUser.id,
      content: content || "",
      mediaUrls: mediaUrls || [],
      platforms: platforms,
      status: status || "draft",
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      isAiGenerated: !!isAiGenerated,
      aiPrompt: aiPrompt || null,
    }).returning();

    // ── Publish via Zernio ──────────────────────────────────────────────────
    if (status === "published" || status === "scheduled") {
      try {
        // Map app platform names → Zernio account IDs
        const zernioPlatforms: ZernioPlatformTarget[] = [];
        const skippedPlatforms: string[] = [];

        for (const p of platforms) {
          const accountId = getZernioAccountId(p);
          if (accountId) {
            zernioPlatforms.push({ platform: p, accountId });
          } else {
            skippedPlatforms.push(p);
          }
        }

        if (skippedPlatforms.length > 0) {
          console.warn(`Zernio: skipped platforms without account IDs: ${skippedPlatforms.join(", ")}`);
        }

        if (zernioPlatforms.length > 0) {
          // Build media items from uploaded URLs
          const zernioMedia: ZernioMediaItem[] = (mediaUrls || []).map((url: string) => {
            const isVideo = /\.(mp4|mov|avi|webm)$/i.test(url);
            return { url, type: isVideo ? "video" : "image" } as ZernioMediaItem;
          });

          const zernioPost = await createZernioPost({
            content: content || "",
            platforms: zernioPlatforms,
            mediaItems: zernioMedia.length > 0 ? zernioMedia : undefined,
            publishNow: status === "published",
            scheduledFor: status === "scheduled" && scheduledAt ? scheduledAt : undefined,
            timezone: "Asia/Dubai", // GMT+4 matching user's locale
          });

          console.log(`✅ Zernio post created: ${zernioPost._id}`);

          // Store results per platform
          for (const p of zernioPlatforms) {
            await db.insert(postPlatformResults).values({
              postId: newPost.id,
              platform: p.platform,
              status: "success",
              platformPostId: zernioPost._id,
            });
          }

          // Update local post status
          await db.update(posts)
            .set({
              status: status === "published" ? "published" : "scheduled",
              publishedAt: status === "published" ? new Date() : undefined,
              updatedAt: new Date(),
            })
            .where(eq(posts.id, newPost.id));
        }

        // Record mock results for skipped platforms
        for (const p of skippedPlatforms) {
          await db.insert(postPlatformResults).values({
            postId: newPost.id,
            platform: p,
            status: "error",
            error: `Platform "${p}" is not connected on Zernio. Connect it at https://zernio.com/dashboard.`,
          });
        }
      } catch (zernioErr: any) {
        console.error("Zernio publish error:", zernioErr);

        // Still save the post locally, but mark as failed
        await db.update(posts)
          .set({ status: "failed", updatedAt: new Date() })
          .where(eq(posts.id, newPost.id));

        // Record failure for each platform
        for (const p of platforms) {
          await db.insert(postPlatformResults).values({
            postId: newPost.id,
            platform: p,
            status: "error",
            error: zernioErr.message || "Zernio API error",
          });
        }

        return NextResponse.json({
          post: { ...newPost, status: "failed" },
          error: `Post saved locally but failed to publish via Zernio: ${zernioErr.message}`,
        }, { status: 207 });
      }
    }

    return NextResponse.json({ post: newPost });
  } catch (error) {
    console.error("Create Post Error:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
