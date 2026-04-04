import { db } from "@/db";
import { triggerLogs, triggers } from "@/db/schema";
import { getDemoUserId } from "@/lib/demo-auth";
import { eq, and, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const authId = getDemoUserId();

    const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.authId, authId),
    });
    if (!user) return new NextResponse("User not found", { status: 404 });

    const data = await db.select({
      id: triggerLogs.id,
      triggerId: triggerLogs.triggerId,
      triggerName: triggers.name,
      firedAt: triggerLogs.firedAt,
      conditionSnapshot: triggerLogs.conditionSnapshot,
      actionTaken: triggerLogs.actionTaken,
      result: triggerLogs.result,
      revenueGenerated: triggerLogs.revenueGenerated,
    })
    .from(triggerLogs)
    .innerJoin(triggers, eq(triggerLogs.triggerId, triggers.id))
    .where(eq(triggers.userId, user.id))
    .orderBy(desc(triggerLogs.firedAt))
    .limit(50);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch trigger logs:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
