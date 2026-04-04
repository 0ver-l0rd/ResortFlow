import { SocialPlatform, OAuthTokens, SocialUserProfile } from "./types";

/**
 * Pinterest Platform OAuth Integration
 * 
 * Required Scopes:
 * - boards:read: Read board data
 * - pins:read: Read pin data
 * - pins:write: Create and manage pins
 * - user_accounts:read: Access basic profile info
 * 
 * App Setup: https://developers.pinterest.com/apps/
 * Callback URL: /api/social/pinterest/callback
 */
export class PinterestPlatform implements SocialPlatform {
  private clientId = process.env.PINTEREST_CLIENT_ID!;
  private clientSecret = process.env.PINTEREST_CLIENT_SECRET!;
  private callbackUrl = process.env.PINTEREST_CALLBACK_URL || `${process.env.NEXT_PUBLIC_APP_URL}/api/social/pinterest/callback`;

  getAuthUrl(state: string): string {
    const scopes = [
      "boards:read",
      "pins:read",
      "pins:write",
      "user_accounts:read",
    ].join(",");

    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.callbackUrl,
      response_type: "code",
      scope: scopes,
      state,
    });

    return `https://www.pinterest.com/oauth/?${params.toString()}`;
  }

  async exchangeCode(code: string): Promise<{ tokens: OAuthTokens; profile: SocialUserProfile }> {
    const response = await fetch("https://api.pinterest.com/v5/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: this.callbackUrl,
      }),
    });

    if (!response.ok) {
      throw new Error("Pinterest token exchange failed");
    }

    const data = await response.json();

    const tokens: OAuthTokens = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
    };

    const profile = await this.getProfile(tokens.accessToken);

    return { tokens, profile };
  }

  async refreshToken(refreshToken: string): Promise<OAuthTokens> {
    const response = await fetch("https://api.pinterest.com/v5/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error("Pinterest token refresh failed");
    }

    const data = await response.json();

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
    };
  }

  private async getProfile(accessToken: string): Promise<SocialUserProfile> {
    const response = await fetch("https://api.pinterest.com/v5/user_account", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Pinterest profile fetch failed");
    }

    const data = await response.json();

    return {
      platformUserId: data.id || data.username,
      username: data.username,
      avatarUrl: data.profile_image,
    };
  }

  async publishPost(tokens: OAuthTokens, content: string, mediaUrls: string[]): Promise<{ postId: string; platform: string }> {
    console.log(`[Pinterest] Publishing Pin: "${content.substring(0, 50)}..."`);
    
    if (mediaUrls.length === 0) {
      throw new Error("Pinterest requires at least one image or video for a Pin.");
    }

    await new Promise(resolve => setTimeout(resolve, 1200));
    return { postId: `pin-${Math.random().toString(36).substring(7)}`, platform: "pinterest" };
  }

  async postReply(tokens: OAuthTokens, commentId: string, text: string): Promise<string> {
    console.log(`[Pinterest] Replying to pin comment ${commentId}: "${text}"`);
    return `pin-reply-${Math.random().toString(36).substring(7)}`;
  }
}
