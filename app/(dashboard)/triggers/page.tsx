import { getDemoUserId } from "@/lib/demo-auth";
import { db } from "@/db";
import { users, triggers as triggersTable, triggerLogs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { TriggersClient } from "./TriggersClient";

export const dynamic = "force-dynamic";

export default async function TriggersPage() {
  const clerkId = getDemoUserId();

  const [user] = await db.select().from(users).limit(1);
  if (!user) return <div>No user found</div>;

  const triggersData = await db
    .select()
    .from(triggersTable)
    .where(eq(triggersTable.userId, user.id))
    .orderBy(desc(triggersTable.createdAt));

  return <TriggersClient initialTriggers={triggersData} />;
}
