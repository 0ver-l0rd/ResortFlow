import { NextResponse } from "next/server";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { getDbUser } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const dbUser = await getDbUser();
    if (!dbUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
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
    const dbUser = await getDbUser();
    if (!dbUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    await db
      .delete(posts)
      .where(and(eq(posts.id, id), eq(posts.userId, dbUser.id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete Post Error:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
