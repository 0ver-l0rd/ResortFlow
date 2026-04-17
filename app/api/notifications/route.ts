import { db } from "@/db";
import { notifications } from "@/db/schema";
import { getDemoUserId } from "@/lib/demo-auth";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const userId = getDemoUserId();

    const user = await db.query.users.findFirst();

    if (!user) return new NextResponse("User not found", { status: 404 });

    const data = await db.query.notifications.findMany({
      where: eq(notifications.userId, user.id),
      orderBy: [desc(notifications.createdAt)],
      limit: 50,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
