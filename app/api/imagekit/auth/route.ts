import { NextResponse } from "next/server";
import { imagekit } from "@/lib/imagekit/client";
import { getDbUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getDbUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

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
