import { getDemoUserId } from "@/lib/demo-auth";
import { db } from "@/db";
import { users, audienceSegments } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { SegmentsClient } from "./SegmentsClient";

export const dynamic = "force-dynamic";

export default async function SegmentsPage() {
  const clerkId = getDemoUserId();

  const [user] = await db.select().from(users).limit(1);
  if (!user) return <div>No user found</div>;

  const segments = await db
    .select()
    .from(audienceSegments)
    .where(eq(audienceSegments.userId, user.id))
    .orderBy(desc(audienceSegments.memberCount));

  return <SegmentsClient initialSegments={segments} />;
}
