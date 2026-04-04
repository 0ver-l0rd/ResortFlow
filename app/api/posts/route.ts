import { NextResponse } from "next/server";
import { db } from "@/db";
import { posts, mediaAssets, users } from "@/db/schema";
import { getDemoUserId } from "@/lib/demo-auth";
import { eq, desc, and, gte, lte, or } from "drizzle-orm";
import { inngest } from "@/lib/inngest/client";

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

    // Insert post into database
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

    // If it's scheduled to publish, trigger Inngest
    if (status === "scheduled" || status === "published") {
      await inngest.send({
        name: "post/created",
        data: {
          postId: newPost.id,
          scheduledAt: newPost.scheduledAt,
        }
      });
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
