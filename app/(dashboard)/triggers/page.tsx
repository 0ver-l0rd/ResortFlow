import { getDbUser } from "@/lib/auth";
import { db } from "@/db";
import { users, triggers as triggersTable, triggerLogs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { TriggersClient } from "./TriggersClient";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function TriggersPage() {
  const user = await getDbUser();
  if (!user) redirect("/sign-in");

  const triggersData = await db
    .select()
    .from(triggersTable)
    .where(eq(triggersTable.userId, user.id))
    .orderBy(desc(triggersTable.createdAt));

  return <TriggersClient initialTriggers={triggersData} />;
}
