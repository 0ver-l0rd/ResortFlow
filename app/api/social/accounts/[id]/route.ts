import { getDbUser } from "@/lib/auth";
import { db } from "@/db";
import { socialAccounts } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getDbUser();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
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
