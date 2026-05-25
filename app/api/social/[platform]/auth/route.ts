import { getDemoUserId } from "@/lib/demo-auth";
import { getPlatform } from "@/lib/platforms/factory";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ platform: string }> }
) {
  const authId = getDemoUserId();

  const { platform } = await params;
  
  try {
    const platformInstance = getPlatform(platform);
    
    // In a real app, you'd store the state in a cookie or DB to verify on callback
    const state = Math.random().toString(36).substring(7);
    const authUrl = platformInstance.getAuthUrl(state);
    
    return NextResponse.redirect(authUrl);
  } catch (error: any) {
    console.error(`Failed to initiate ${platform} auth:`, error);
    return new NextResponse(error.message, { status: 400 });
  }
}
