import { getDbUser } from "@/lib/auth";
import { db } from "@/db";
import { users, campaigns } from "@/db/schema";
import { eq, desc, sum } from "drizzle-orm";
import { RevenueClient } from "./RevenueClient";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function RevenuePage() {
  const user = await getDbUser();
  if (!user) redirect("/sign-in");

  const campaignsData = await db
    .select()
    .from(campaigns)
    .where(eq(campaigns.userId, user.id))
    .orderBy(desc(campaigns.createdAt));

  return <RevenueClient campaigns={campaignsData} />;
}
