import { db } from "@/db";
import { contacts } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });

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
