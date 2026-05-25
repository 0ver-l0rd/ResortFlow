import { getDbUser } from "@/lib/auth";
import { db } from "@/db";
import { users, audienceSegments } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { SegmentsClient } from "./SegmentsClient";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SegmentsPage() {
  const user = await getDbUser();
  if (!user) redirect("/sign-in");

  const segments = await db
    .select()
    .from(audienceSegments)
    .where(eq(audienceSegments.userId, user.id))
    .orderBy(desc(audienceSegments.memberCount));

  return <SegmentsClient initialSegments={segments} />;
}
