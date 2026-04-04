import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { campaigns, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId)
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
