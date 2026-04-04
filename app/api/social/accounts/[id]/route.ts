import { getDemoUserId } from "@/lib/demo-auth";
import { db } from "@/db";
import { socialAccounts } from "@/db/schema";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const clerkId = getDemoUserId();

  const user = await getUserByClerkId(clerkId);
  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  const { id } = await params;

  try {
    await db
      .delete(socialAccounts)
      .where(
        and(
          eq(socialAccounts.id, id),
          eq(socialAccounts.userId, user.id)
        )
      );

    return new Response(null, { status: 204 });
  } catch (error: any) {
    console.error("Failed to disconnect account:", error);
    return new NextResponse(error.message, { status: 500 });
  }
}
