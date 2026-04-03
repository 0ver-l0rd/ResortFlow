import { auth } from "@clerk/nextjs/server";
import { getPlatform } from "@/lib/platforms/factory";
import { db } from "@/db";
import { socialAccounts } from "@/db/schema";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { encrypt } from "@/lib/encryption";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

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
    const user = await getUserByClerkId(clerkId);
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

    // Redirect back to connections page
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return NextResponse.redirect(`${baseUrl}/connections?success=true`);
  } catch (err: any) {
    console.error(`Failed to handle ${platform} callback:`, err);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return NextResponse.redirect(`${baseUrl}/connections?error=${encodeURIComponent(err.message)}`);
  }
}
