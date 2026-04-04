import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users, audienceSegments } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { SegmentsClient } from "./SegmentsClient";

export const dynamic = "force-dynamic";

export default async function SegmentsPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const [user] = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);
  if (!user) return null;

  const segments = await db
    .select()
    .from(audienceSegments)
    .where(eq(audienceSegments.userId, user.id))
    .orderBy(desc(audienceSegments.memberCount));

  return <SegmentsClient initialSegments={segments} />;
}
