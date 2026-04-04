import { db } from "@/db";
import { campaigns, users } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { CampaignsClient } from "./CampaignsClient";

export default async function CampaignsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  if (!user) redirect("/sign-in");

  const userCampaigns = await db.query.campaigns.findMany({
    where: eq(campaigns.userId, user.id),
    orderBy: [desc(campaigns.createdAt)],
    with: {
      posts: true,
      messages: true,
    }
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#8792a2] mb-1">
            Autopilot
          </p>
          <h1 className="text-2xl font-bold tracking-[-0.02em] text-[#1a1f36]">
            Active Campaigns
          </h1>
          <p className="text-sm text-[#8792a2] mt-1">
            Track your autonomous marketing runs in real-time.
          </p>
        </div>
      </div>

      <CampaignsClient initialCampaigns={JSON.parse(JSON.stringify(userCampaigns))} />
    </div>
  );
}
