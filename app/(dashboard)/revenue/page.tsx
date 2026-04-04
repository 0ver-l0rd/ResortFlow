import { getDemoUserId } from "@/lib/demo-auth";
import { db } from "@/db";
import { users, campaigns } from "@/db/schema";
import { eq, desc, sum } from "drizzle-orm";
import { RevenueClient } from "./RevenueClient";

export const dynamic = "force-dynamic";

export default async function RevenuePage() {
  const authId = getDemoUserId();

  const [user] = await db.select().from(users).limit(1);
  if (!user) return <div>No user found</div>;

  const campaignsData = await db
    .select()
    .from(campaigns)
    .where(eq(campaigns.userId, user.id))
    .orderBy(desc(campaigns.createdAt));

  return <RevenueClient campaigns={campaignsData} />;
}
