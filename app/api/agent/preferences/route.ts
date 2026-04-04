import { getDemoUserId } from "@/lib/demo-auth";
import { db } from "@/db";
import { agentPreferences } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const clerkId = getDemoUserId();

    const user = await getUserByClerkId(clerkId);
    if (!user) return new NextResponse("User not found", { status: 404 });

    const prefs = await db.select().from(agentPreferences).where(eq(agentPreferences.userId, user.id));
    const prefMap = prefs.reduce((acc: any, p) => {
      acc[p.key] = p.value;
      return acc;
    }, {});

    return NextResponse.json(prefMap);
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const clerkId = getDemoUserId();

    const user = await getUserByClerkId(clerkId);
    if (!user) return new NextResponse("User not found", { status: 404 });

    const body = await req.json(); // Expected: { key: string, value: string } or Record<string, string>
    
    if (body.key && body.value) {
      // Single update
      await db.delete(agentPreferences).where(
        and(eq(agentPreferences.userId, user.id), eq(agentPreferences.key, body.key))
      );
      await db.insert(agentPreferences).values({ userId: user.id, key: body.key, value: body.value });
    } else {
      // Bulk update
      for (const [key, value] of Object.entries(body)) {
        await db.delete(agentPreferences).where(
          and(eq(agentPreferences.userId, user.id), eq(agentPreferences.key, key))
        );
        await db.insert(agentPreferences).values({ userId: user.id, key, value: String(value) });
      }
    }

    return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}
