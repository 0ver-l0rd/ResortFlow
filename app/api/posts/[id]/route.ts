import { NextResponse } from "next/server";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { getDemoUserId } from "@/lib/demo-auth";
import { eq, and } from "drizzle-orm";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getDemoUserId();

    const { id } = await params;

    const dbUser = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.clerkId, userId),
    });
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const body = await request.json();
    const { content, mediaUrls, platforms, scheduledAt, status } = body;

    const [updated] = await db
      .update(posts)
      .set({
        ...(content !== undefined && { content }),
        ...(mediaUrls !== undefined && { mediaUrls }),
        ...(platforms !== undefined && { platforms }),
        ...(scheduledAt !== undefined && { scheduledAt: scheduledAt ? new Date(scheduledAt) : null }),
        ...(status !== undefined && { status }),
        updatedAt: new Date(),
      })
      .where(and(eq(posts.id, id), eq(posts.userId, dbUser.id)))
      .returning();

    if (!updated) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    return NextResponse.json({ post: updated });
  } catch (error) {
    console.error("Update Post Error:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getDemoUserId();

    const { id } = await params;

    const dbUser = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.clerkId, userId),
    });
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    await db
      .delete(posts)
      .where(and(eq(posts.id, id), eq(posts.userId, dbUser.id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete Post Error:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
