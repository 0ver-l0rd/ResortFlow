import { db } from "@/db";
import { contacts } from "@/db/schema";
import { getDbUser } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getDbUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

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
