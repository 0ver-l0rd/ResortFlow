import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users, autoReplyRules } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRecord = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });

    if (!userRecord) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify rule belongs to user
    const existingRule = await db.query.autoReplyRules.findFirst({
      where: and(eq(autoReplyRules.id, id), eq(autoReplyRules.userId, userRecord.id)),
    });

    if (!existingRule) {
      return NextResponse.json({ error: "Rule not found" }, { status: 404 });
    }

    const body = await req.json();

    const updatedRules = await db.update(autoReplyRules)
      .set({
        ...body,
        // Ensure userId isn't overwritten
        userId: userRecord.id,
      })
      .where(eq(autoReplyRules.id, id))
      .returning();

    return NextResponse.json(updatedRules[0]);
  } catch (error) {
    console.error("Error updating auto-reply rule:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRecord = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });

    if (!userRecord) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Since we check userRecord.id, it's safe to just delete with 'and' condition
    const deletedRules = await db.delete(autoReplyRules)
      .where(and(eq(autoReplyRules.id, id), eq(autoReplyRules.userId, userRecord.id)))
      .returning();

    if (!deletedRules.length) {
      return NextResponse.json({ error: "Rule not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error("Error deleting auto-reply rule:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
