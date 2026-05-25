import { NextResponse } from "next/server";
import { imagekit } from "@/lib/imagekit/client";

export async function GET() {
  try {
    const authenticationParameters = imagekit.getAuthenticationParameters();
    return NextResponse.json(authenticationParameters);
  } catch (error: any) {
    console.error("ImageKit Auth Error:", error);
    return NextResponse.json(
      { error: "Failed to authenticate ImageKit", details: error.message },
      { status: 500 }
    );
  }
}
