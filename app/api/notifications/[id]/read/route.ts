import { db } from "@/db";
import { notifications } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });

    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.clerkId, clerkId),
    });

    if (!user) return new NextResponse("User not found", { status: 404 });

    const { id } = await params;

    await db.update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.id, id), eq(notifications.userId, user.id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
