import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users, triggers as triggersTable, triggerLogs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { TriggersClient } from "./TriggersClient";

export const dynamic = "force-dynamic";

export default async function TriggersPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const [user] = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);
  if (!user) return null;

  const triggersData = await db
    .select()
    .from(triggersTable)
    .where(eq(triggersTable.userId, user.id))
    .orderBy(desc(triggersTable.createdAt));

  return <TriggersClient initialTriggers={triggersData} />;
}
