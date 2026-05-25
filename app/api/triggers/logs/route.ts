import { db } from "@/db";
import { triggerLogs, triggers } from "@/db/schema";
import { getDbUser } from "@/lib/auth";
import { eq, and, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getDbUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

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
