import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { socialAccounts } from "@/db/schema";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const user = await getUserByClerkId(clerkId);
  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  const { id } = params;

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
