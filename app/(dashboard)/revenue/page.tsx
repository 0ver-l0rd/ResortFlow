import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users, campaigns } from "@/db/schema";
import { eq, desc, sum } from "drizzle-orm";
import { RevenueClient } from "./RevenueClient";

export const dynamic = "force-dynamic";

export default async function RevenuePage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const [user] = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);
  if (!user) return null;

  const campaignsData = await db
    .select()
    .from(campaigns)
    .where(eq(campaigns.userId, user.id))
    .orderBy(desc(campaigns.createdAt));

  return <RevenueClient campaigns={campaignsData} />;
}
