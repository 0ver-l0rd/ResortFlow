import { db } from "@/db";
import { contacts } from "@/db/schema";
import { getDemoUserId } from "@/lib/demo-auth";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const clerkId = getDemoUserId();

    const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.clerkId, clerkId),
    });
    if (!user) return new NextResponse("User not found", { status: 404 });

    const data = await db.query.contacts.findMany({
      where: eq(contacts.userId, user.id),
      orderBy: (contacts, { desc }) => [desc(contacts.createdAt)],
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch contacts:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
