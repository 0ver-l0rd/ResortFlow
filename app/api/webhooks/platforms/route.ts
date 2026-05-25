import { NextResponse } from "next/server";
import { db } from "@/db";
import { autoReplyRules, socialAccounts } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { autoReplyQueue } from "@/lib/queue";

// Helper to determine if comment matches keyword rules
function matchesKeywords(commentText: string, keywords: string[] | null): boolean {
  if (!keywords || keywords.length === 0) return false;
  const lowerComment = commentText.toLowerCase();
  return keywords.some(keyword => lowerComment.includes(keyword.toLowerCase()));
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.json();
    
    // Abstracting payload parsing. Different platforms have different webhook payloads.
    // For this example, we assume a normalized payload, or you can add platform-specific parsers here.
    const { 
      platform, 
      platformUserId, 
      commentId, 
      commentText 
    } = rawBody;

    if (!platform || !platformUserId || !commentId || !commentText) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Find the user ID by looking up the social account
    const account = await db.query.socialAccounts.findFirst({
      where: and(
        eq(socialAccounts.platform, platform),
        eq(socialAccounts.platformUserId, platformUserId)
      )
    });

    if (!account) {
      console.log(`No linked account found for platform ${platform} and user ID ${platformUserId}`);
      return NextResponse.json({ success: true, message: "Ignored: No linked account" });
    }

    // 2. Fetch active rules for this user and platform
    const rules = await db.query.autoReplyRules.findMany({
      where: and(
        eq(autoReplyRules.userId, account.userId),
        eq(autoReplyRules.platform, platform),
        eq(autoReplyRules.isActive, true)
      )
    });

    if (rules.length === 0) {
      return NextResponse.json({ success: true, message: "Ignored: No active rules" });
    }

    // 3. Find if any rule matches the trigger
    const matchedRule = rules.find((rule: any) => {
      if (rule.triggerType === "any_comment") return true;
      if (rule.triggerType === "keyword") {
        return matchesKeywords(commentText, rule.keywords as string[]);
      }
      return false;
    });

    if (!matchedRule) {
      return NextResponse.json({ success: true, message: "Ignored: No rules matched trigger" });
    }

    // 4. Enqueue auto-reply job
    console.log(`Matched rule ${matchedRule.id} for comment ${commentId}. Enqueuing job...`);
    
    await autoReplyQueue.add('auto-reply', {
      ruleId: matchedRule.id,
      commentId,
      commentText,
      platform
    });

    return NextResponse.json({ success: true, message: "Webhook processed, reply queued" });
  } catch (error) {
    console.error("Error processing platform webhook:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
