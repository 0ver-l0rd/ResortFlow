import { db } from "@/db";
import { messageCampaigns } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const messageStatus = formData.get("MessageStatus") as string;
    const messageSid = formData.get("MessageSid") as string;

    console.log(`Twilio webhook received: Message ${messageSid} is now ${messageStatus}`);

    // If we were tracking individual messaging logs, we'd update them here.
    // For now, we can update overall delivered counts if the status is 'delivered'.
    if (messageStatus === "delivered") {
        // In a real app, we'd map messageSid to a campaignId.
        // For this hackathon, we'll just log it.
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("Twilio webhook error:", error);
    return new NextResponse("Webhook processing failed", { status: 500 });
  }
}
