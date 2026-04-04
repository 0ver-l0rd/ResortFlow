import { NextResponse } from "next/server";
import { getDemoUserId } from "@/lib/demo-auth";
import { db } from "@/db";
import { campaigns, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getDemoUserId();

    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId)
    });
    if (!user) return new NextResponse("User not found", { status: 404 });
    const resolvedParams = await params;

    const campaign = await db.query.campaigns.findFirst({
      where: and(
        eq(campaigns.id, resolvedParams.id),
        eq(campaigns.userId, user.id)
      ),
      with: {
        posts: true,
        messages: true,
      }
    });

    if (!campaign) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(campaign);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getDemoUserId();

    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId)
    });
    if (!user) return new NextResponse("User not found", { status: 404 });

    const { actualRevenue, status } = await req.json();
    const resolvedParams = await params;

    const updateData: any = {};
    if (actualRevenue !== undefined) updateData.actualRevenue = actualRevenue;
    if (status) {
      updateData.status = status;
      if (status === "completed" || status === "failed") {
         updateData.completedAt = new Date();
      }
    }

    const [updated] = await db.update(campaigns)
      .set(updateData)
      .where(and(
        eq(campaigns.id, resolvedParams.id),
        eq(campaigns.userId, user.id)
      ))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
