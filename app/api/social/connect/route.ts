import { getDbUser } from "@/lib/auth";
import { getUserZernioApiKey, getZernioProfiles, createZernioProfile, getZernioConnectUrl } from "@/lib/zernio";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const user = await getDbUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const platform = searchParams.get("platform");

    if (!platform) {
      return new NextResponse("Platform is required", { status: 400 });
    }

    const apiKey = await getUserZernioApiKey(user.id);
    if (!apiKey) {
      return new NextResponse("Zernio API key is missing. Please save it in settings.", { status: 400 });
    }

    // Get or create a profile
    let profiles = await getZernioProfiles(apiKey);
    if (!profiles || profiles.length === 0) {
      const newProfile = await createZernioProfile("Default Profile", apiKey);
      profiles = [newProfile];
    }
    
    const profileId = profiles[0]._id;

    // Build the redirect URL that Zernio will send the user back to
    // Use the origin of the current request
    const origin = new URL(request.url).origin;
    const redirectUrl = `${origin}/connections?success=true`;

    // Get the auth URL from Zernio
    const authUrl = await getZernioConnectUrl(platform, redirectUrl, apiKey, profileId);

    // Redirect the user to the Zernio OAuth URL
    return NextResponse.redirect(authUrl);
  } catch (error: any) {
    console.error("Failed to generate Zernio connect URL:", error);
    // Redirect back with error
    const origin = new URL(request.url).origin;
    return NextResponse.redirect(`${origin}/connections?error=${encodeURIComponent(error.message)}`);
  }
}