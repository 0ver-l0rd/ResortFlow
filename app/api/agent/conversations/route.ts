import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { agentConversations } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });

    const user = await getUserByClerkId(clerkId);
    if (!user) return new NextResponse("User not found", { status: 404 });

    const conversations = await db
      .select({
        id: agentConversations.id,
        title: agentConversations.title,
        updatedAt: agentConversations.updatedAt,
      })
      .from(agentConversations)
      .where(eq(agentConversations.userId, user.id))
      .orderBy(desc(agentConversations.updatedAt))
      .limit(50);

    // Derive a title from the first user message if none stored
    const withTitles = conversations.map((c) => ({
      ...c,
      title: c.title || "Untitled conversation",
    }));

    return NextResponse.json(withTitles);
  } catch (error: any) {
    console.error("[Conversations GET]", error);
    return new NextResponse(error.message, { status: 500 });
  }
}
