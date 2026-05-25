import { getDbUser } from "@/lib/auth";
import { syncPlatformHistoryForUser } from "@/lib/platforms/sync";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const user = await getDbUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { platform } = await request.json();
    const result = await syncPlatformHistoryForUser(user.id, platform);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[Sync API] Error:", error);
    return new NextResponse(error.message, { status: 500 });
  }
}
