import { auth } from "@clerk/nextjs/server";
import { getPlatform } from "@/lib/platforms/factory";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { platform: string } }
) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { platform } = params;
  
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
