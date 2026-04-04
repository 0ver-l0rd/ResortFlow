import { getDemoUserId } from "@/lib/demo-auth";
import { db } from "@/db";
import { agentConversations } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getUserByAuthId } from "@/lib/db/queries/users";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authId = getDemoUserId();

    const user = await getUserByAuthId(authId);
    if (!user) return new NextResponse("User not found", { status: 404 });

    const { id } = await params;

    const conversation = await db.query.agentConversations.findFirst({
      where: and(eq(agentConversations.id, id), eq(agentConversations.userId, user.id)),
    });

    if (!conversation) return new NextResponse("Not found", { status: 404 });

    return NextResponse.json(conversation);
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authId = getDemoUserId();

    const user = await getUserByAuthId(authId);
    if (!user) return new NextResponse("User not found", { status: 404 });

    const { id } = await params;

    await db.delete(agentConversations).where(
      and(eq(agentConversations.id, id), eq(agentConversations.userId, user.id))
    );

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}
