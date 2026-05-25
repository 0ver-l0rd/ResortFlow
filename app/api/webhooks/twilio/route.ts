import { NextResponse } from "next/server";
import twilio from "twilio";

export async function POST(req: Request) {
  try {
    const signature = req.headers.get("x-twilio-signature") || "";
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    const formData = await req.formData();
    const messageStatus = formData.get("MessageStatus") as string;
    const messageSid = formData.get("MessageSid") as string;

    // Perform signature check in production/sandbox when token is set
    if (authToken && signature) {
      // Reconstruct full request URL (handling proxy headers)
      const protocol = req.headers.get("x-forwarded-proto") || "http";
      const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
      const url = `${protocol}://${host}/api/webhooks/twilio`;

      const params: Record<string, string> = {};
      formData.forEach((value, key) => {
        params[key] = value.toString();
      });

      const isValid = twilio.validateRequest(authToken, signature, url, params);
      if (!isValid) {
        console.warn(`[Twilio Webhook] Signature validation failed for messageSid: ${messageSid}`);
        return new NextResponse("Unauthorized", { status: 401 });
      }
    }

    console.log(`Twilio webhook received: Message ${messageSid} is now ${messageStatus}`);

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("Twilio webhook error:", error);
    return new NextResponse("Webhook processing failed", { status: 500 });
  }
}
