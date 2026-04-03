import { NextResponse } from "next/server";
import { db } from "@/db";
import { posts, mediaAssets, users } from "@/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq, desc, and, gte, lte } from "drizzle-orm";
// import { publishQueue } from "@/lib/queue";

export async function GET(request: Request) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = clerkUser.id;

    let dbUser = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.clerkId, userId),
    });
    
    // Auto-sync user if they don't exist yet but are authenticated in Clerk
    if (!dbUser) {
      const email = clerkUser.emailAddresses[0]?.emailAddress || "no-email@example.com";
      const [newUser] = await db.insert(users).values({
        clerkId: userId,
        email: email,
      }).returning();
      dbUser = newUser;
    }

    if (!dbUser) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const platform = searchParams.get("platform");
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");

    const conditions = [eq(posts.userId, dbUser.id)];
    
    if (startDate) {
      conditions.push(gte(posts.scheduledAt, new Date(startDate)));
    }
    if (endDate) {
      conditions.push(lte(posts.scheduledAt, new Date(endDate)));
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
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = clerkUser.id;

    let dbUser = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.clerkId, userId),
    });

    // Auto-sync user if they don't exist yet but are authenticated in Clerk
    if (!dbUser) {
      const email = clerkUser.emailAddresses[0]?.emailAddress || "no-email@example.com";
      const [newUser] = await db.insert(users).values({
        clerkId: userId,
        email: email,
      }).returning();
      dbUser = newUser;
    }

    if (!dbUser) {
      return NextResponse.json({ error: "User not found in database" }, { status: 404 });
    }

    const { content, mediaUrls, platforms, scheduledAt, status } = await request.json();

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
    }).returning();

    // If it's scheduled to publish, add to BullMQ queue
    // if (status === "scheduled" && scheduledAt) {
    //   const delay = new Date(scheduledAt).getTime() - Date.now();
    //   await publishQueue.add("publish-post", { postId: newPost.id }, { delay });
    // }

    return NextResponse.json({ post: newPost });
  } catch (error) {
    console.error("Create Post Error:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
