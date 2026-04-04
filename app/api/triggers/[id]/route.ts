import { db } from "@/db";
import { triggers } from "@/db/schema";
import { getDemoUserId } from "@/lib/demo-auth";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const clerkId = getDemoUserId();

    const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.clerkId, clerkId),
    });
    if (!user) return new NextResponse("User not found", { status: 404 });

    const body = await req.json();
    const { isActive, condition, name } = body;

    const { id } = await params;

    const [updatedTrigger] = await db.update(triggers)
      .set({ 
        isActive, 
        condition, 
        name,
        updatedAt: new Date(),
      })
      .where(and(eq(triggers.id, id), eq(triggers.userId, user.id)))
      .returning();

    if (!updatedTrigger) return new NextResponse("Trigger not found", { status: 404 });

    return NextResponse.json(updatedTrigger);
  } catch (error) {
    console.error('Failed to update trigger:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const clerkId = getDemoUserId();

    const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.clerkId, clerkId),
    });
    if (!user) return new NextResponse("User not found", { status: 404 });

    const { id } = await params;
    await db.delete(triggers)
      .where(and(eq(triggers.id, id), eq(triggers.userId, user.id)));

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete trigger:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
