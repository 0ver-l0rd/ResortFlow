import { getDbUser } from "@/lib/auth";
import { db } from "@/db";
import { agentConversations } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getDbUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

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
    const user = await getDbUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    const { id } = await params;

    await db.delete(agentConversations).where(
      and(eq(agentConversations.id, id), eq(agentConversations.userId, user.id))
    );

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}
