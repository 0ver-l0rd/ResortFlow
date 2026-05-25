import { db } from "@/db";
import { triggers } from "@/db/schema";
import { getDbUser } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getDbUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    const data = await db.query.triggers.findMany({
      where: eq(triggers.userId, user.id),
      orderBy: (triggers, { desc }) => [desc(triggers.createdAt)],
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = await getDbUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

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
