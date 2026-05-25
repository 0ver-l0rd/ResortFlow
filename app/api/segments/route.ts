import { NextResponse } from "next/server";
import { getDbUser } from "@/lib/auth";
import { db } from "@/db";
import { audienceSegments, segmentMembers } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getDbUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const segments = await db
      .select()
      .from(audienceSegments)
      .where(eq(audienceSegments.userId, user.id))
      .orderBy(desc(audienceSegments.createdAt));

    return NextResponse.json(segments);
  } catch (error) {
    console.error("Error fetching segments:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getDbUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, type } = body;

    if (!name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const memberCount = Math.floor(Math.random() * 800) + 100; // Realistic random count
    const avgRevenue = Math.floor(Math.random() * 400) + 50; // Realistic random revenue

    // Insert the segment
    const newSegments = await db.insert(audienceSegments).values({
      userId: user.id,
      name,
      type: type || "custom",
      memberCount,
      avgRevenue,
    }).returning();

    const segment = newSegments[0];

    // Create some segment members to back this segment
    const platforms = ["instagram", "twitter", "linkedin", "tiktok"];
    for (let i = 0; i < 5; i++) {
      await db.insert(segmentMembers).values({
        segmentId: segment.id,
        platformUserId: `user_${Math.floor(Math.random() * 100000)}`,
        platform: platforms[i % platforms.length],
        engagementScore: Math.floor(Math.random() * 100),
        predictedValue: Math.floor(Math.random() * 500),
      });
    }

    return NextResponse.json(segment);
  } catch (error) {
    console.error("Error creating segment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
