import { db } from "@/db";
import { triggers } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });

  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.clerkId, clerkId),
  });

  if (!user) return new NextResponse("User not found", { status: 404 });

  const data = await db.query.triggers.findMany({
    where: eq(triggers.userId, user.id),
    orderBy: (triggers, { desc }) => [desc(triggers.createdAt)],
  });

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });

  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.clerkId, clerkId),
  });

  if (!user) return new NextResponse("User not found", { status: 404 });

  const body = await req.json();
  const { type, name, condition, action } = body;

  const [newTrigger] = await db.insert(triggers).values({
    userId: user.id,
    type,
    name,
    condition,
    action,
    isActive: true,
  }).returning();

  return NextResponse.json(newTrigger);
}
