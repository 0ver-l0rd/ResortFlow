import { getDemoUserId } from "@/lib/demo-auth";
import { getPlatform } from "@/lib/platforms/factory";
import { db } from "@/db";
import { socialAccounts } from "@/db/schema";
import { getUserByAuthId } from "@/lib/db/queries/users";
import { encrypt } from "@/lib/encryption";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ platform: string }> }
) {
  const authId = getDemoUserId();

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const { platform } = await params;

  if (error) {
    return new NextResponse(`OAuth Error: ${error}`, { status: 400 });
  }

  if (!code) {
    return new NextResponse("No code provided", { status: 400 });
  }

  try {
    const user = await getUserByAuthId(authId);
    if (!user) {
      return new NextResponse("User not found in DB", { status: 404 });
    }

    const platformInstance = getPlatform(platform);
    const { tokens, profile } = await platformInstance.exchangeCode(code);

    // Check if account already exists for this user and platform
    const existingAccount = await db.query.socialAccounts.findFirst({
      where: and(
        eq(socialAccounts.userId, user.id),
        eq(socialAccounts.platform, platform),
        eq(socialAccounts.platformUserId, profile.platformUserId)
      ),
    });

    const accountData = {
      userId: user.id,
      platform,
      accessToken: encrypt(tokens.accessToken),
      refreshToken: tokens.refreshToken ? encrypt(tokens.refreshToken) : null,
      platformUserId: profile.platformUserId,
      username: profile.username,
      avatarUrl: profile.avatarUrl,
      expiresAt: tokens.expiresAt,
    };

    if (existingAccount) {
      await db
        .update(socialAccounts)
        .set(accountData)
        .where(eq(socialAccounts.id, existingAccount.id));
    } else {
      await db.insert(socialAccounts).values(accountData);
    }

    // Trigger historical sync immediately
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    try {
      // Internal fetch or just call the sync logic if we exported it.
      // For simplicity in a hackathon, let's just trigger the API route.
      // We don't block the redirect for this.
      fetch(`${baseUrl}/api/social/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform }),
      }).catch(e => console.error("Auto-sync trigger failed:", e));
    } catch (e) {
      console.error("Failed to trigger initial sync:", e);
    }

    // Redirect back to connections page
    return NextResponse.redirect(`${baseUrl}/connections?success=true`);
  } catch (err: any) {
    console.error(`Failed to handle ${platform} callback:`, err);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return NextResponse.redirect(`${baseUrl}/connections?error=${encodeURIComponent(err.message)}`);
  }
}
