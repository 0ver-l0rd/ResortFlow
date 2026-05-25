import { NextResponse } from "next/server";
import { getDemoUserId } from "@/lib/demo-auth";
import { db } from "@/db";
import { campaigns, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const authId = getDemoUserId();

    const user = await db.query.users.findFirst({
      where: eq(users.authId, authId)
    });
    if (!user) return new NextResponse("User not found", { status: 404 });

    const data = await db.query.campaigns.findMany({
      where: eq(campaigns.userId, user.id),
      orderBy: [desc(campaigns.createdAt)],
      with: {
        posts: true,
        messages: true,
      }
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
