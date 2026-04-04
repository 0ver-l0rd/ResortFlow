import { NextResponse } from "next/server";
import { getDemoUserId } from "@/lib/demo-auth";
import { db } from "@/db";
import { users, autoReplyRules } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const authId = getDemoUserId();

    const userRecord = await db.query.users.findFirst({
      where: eq(users.authId, authId),
    });

    if (!userRecord) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const rules = await db.query.autoReplyRules.findMany({
      where: eq(autoReplyRules.userId, userRecord.id),
      orderBy: [desc(autoReplyRules.createdAt)],
      with: {
        logs: {
          columns: {
            id: true,
          },
        },
      },
    });

    // Map to include replyCount
    const mappedRules = rules.map((rule) => ({
      ...rule,
      replyCount: rule.logs.length,
      logs: undefined, // remove logs array from response
    }));

    return NextResponse.json(mappedRules);
  } catch (error) {
    console.error("Error fetching auto-reply rules:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authId = getDemoUserId();

    const userRecord = await db.query.users.findFirst({
      where: eq(users.authId, authId),
    });

    if (!userRecord) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { name, platform, triggerType, keywords, replyTemplate, useAI, aiPrompt, isActive } = body;

    if (!name || !platform || !triggerType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newRules = await db.insert(autoReplyRules).values({
      userId: userRecord.id,
      name,
      platform,
      triggerType,
      keywords: keywords || [],
      replyTemplate: replyTemplate || null,
      useAI: !!useAI,
      aiPrompt: aiPrompt || null,
      isActive: isActive !== undefined ? isActive : true,
    }).returning();

    return NextResponse.json(newRules[0]);
  } catch (error) {
    console.error("Error creating auto-reply rule:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
