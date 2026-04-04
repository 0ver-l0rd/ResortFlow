import { NextResponse } from "next/server";
import { getDemoUserId } from "@/lib/demo-auth";
import { db } from "@/db";
import { campaigns, campaignPosts, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authId = getDemoUserId();

    const user = await db.query.users.findFirst({
      where: eq(users.authId, authId)
    });
    if (!user) return new NextResponse("User not found", { status: 404 });
    const resolvedParams = await params;

    const campaign = await db.query.campaigns.findFirst({
      where: and(
        eq(campaigns.id, resolvedParams.id),
        eq(campaigns.userId, user.id)
      )
    });

    if (!campaign) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // This is mocked for UI display - in reality we would aggregate metrics
    const expectedMax = Math.max(1, campaign.predictedRevenue || 1);
    const mockActual = Math.floor(Math.random() * expectedMax);

    // Provide some simulated live changes to the "actualRevenue" for demo effect
    return NextResponse.json({
      actualRevenue: mockActual,
      postsPublished: Math.floor(Math.random() * 3),
      messagesSent: Math.floor(Math.random() * 50),
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
