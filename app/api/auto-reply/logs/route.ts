import { NextResponse } from "next/server";
import { getDemoUserId } from "@/lib/demo-auth";
import { db } from "@/db";
import { users, autoReplyLogs, autoReplyRules } from "@/db/schema";
import { eq, desc, count } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const authId = getDemoUserId();

    const userRecord = await db.query.users.findFirst({
      where: eq(users.authId, authId),
    });

    if (!userRecord) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");
    const offset = (page - 1) * pageSize;

    const baseQuery = db
      .select({
        id: autoReplyLogs.id,
        ruleId: autoReplyLogs.ruleId,
        commentId: autoReplyLogs.commentId,
        commentText: autoReplyLogs.commentText,
        replyText: autoReplyLogs.replyText,
        status: autoReplyLogs.status,
        repliedAt: autoReplyLogs.repliedAt,
        rule: {
          name: autoReplyRules.name,
          platform: autoReplyRules.platform,
        },
      })
      .from(autoReplyLogs)
      .innerJoin(autoReplyRules, eq(autoReplyLogs.ruleId, autoReplyRules.id))
      .where(eq(autoReplyRules.userId, userRecord.id));

    const logs = await baseQuery
      .orderBy(desc(autoReplyLogs.repliedAt))
      .limit(pageSize)
      .offset(offset);

    // Get total count
    const countResult = await db
      .select({ value: count() })
      .from(autoReplyLogs)
      .innerJoin(autoReplyRules, eq(autoReplyLogs.ruleId, autoReplyRules.id))
      .where(eq(autoReplyRules.userId, userRecord.id));
      
    const totalCount = countResult[0].value;

    return NextResponse.json({
      data: logs,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching auto-reply logs:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
