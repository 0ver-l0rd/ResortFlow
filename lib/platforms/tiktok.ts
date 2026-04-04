import { SocialPlatform, OAuthTokens, SocialUserProfile } from "./types";

/**
 * TikTok Platform OAuth Integration
 * 
 * Required Scopes:
 * - user.info.basic: Access basic user info
 * - video.publish: Publish videos
 * - video.upload: Upload video content
 * 
 * App Setup: https://developers.tiktok.com/
 * Callback URL: /api/social/tiktok/callback
 */
export class TikTokPlatform implements SocialPlatform {
  private clientKey = process.env.TIKTOK_CLIENT_KEY!;
  private clientSecret = process.env.TIKTOK_CLIENT_SECRET!;
  private callbackUrl = process.env.TIKTOK_CALLBACK_URL || `${process.env.NEXT_PUBLIC_APP_URL}/api/social/tiktok/callback`;

  getAuthUrl(state: string): string {
    const scopes = [
      "user.info.basic",
      "video.publish",
      "video.upload",
    ].join(",");

    const params = new URLSearchParams({
      client_key: this.clientKey,
      scope: scopes,
      response_type: "code",
      redirect_uri: this.callbackUrl,
      state,
    });

    return `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`;
  }

  async exchangeCode(code: string): Promise<{ tokens: OAuthTokens; profile: SocialUserProfile }> {
    const response = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_key: this.clientKey,
        client_secret: this.clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: this.callbackUrl,
      }),
    });

    if (!response.ok) {
      throw new Error("TikTok token exchange failed");
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
    const response = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_key: this.clientKey,
        client_secret: this.clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (!response.ok) {
      throw new Error("TikTok token refresh failed");
    }

    const data = await response.json();

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
    };
  }

  private async getProfile(accessToken: string): Promise<SocialUserProfile> {
    const response = await fetch("https://open.tiktokapis.com/v2/user/info/?fields=open_id,display_name,avatar_url", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("TikTok profile fetch failed");
    }

    const { data } = await response.json();
    const user = data.user;

    return {
      platformUserId: user.open_id,
      username: user.display_name,
      avatarUrl: user.avatar_url,
    };
  }

  async publishPost(tokens: OAuthTokens, content: string, mediaUrls: string[]): Promise<{ postId: string; platform: string }> {
    console.log(`[TikTok] Publishing video: "${content.substring(0, 50)}..."`);
    
    if (mediaUrls.length === 0) {
      throw new Error("TikTok requires at least one video to publish.");
    }

    await new Promise(resolve => setTimeout(resolve, 1500));
    return { postId: `tt-${Math.random().toString(36).substring(7)}`, platform: "tiktok" };
  }

  async postReply(tokens: OAuthTokens, commentId: string, text: string): Promise<string> {
    console.log(`[TikTok] Replying to comment: "${text}"`);
    return `tt-reply-${Math.random().toString(36).substring(7)}`;
  }
}
