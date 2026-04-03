import { SocialPlatform, OAuthTokens, SocialUserProfile } from "./types";

/**
 * YouTube / Google Platform OAuth Integration
 * 
 * Required Scopes:
 * - https://www.googleapis.com/auth/youtube.upload: Upload videos
 * - https://www.googleapis.com/auth/youtube: Manage YouTube account
 * - https://www.googleapis.com/auth/youtube.readonly: Read channel data
 * - https://www.googleapis.com/auth/userinfo.profile: Basic profile info
 * 
 * App Setup: https://console.cloud.google.com/apis/credentials
 * Callback URL: /api/social/youtube/callback
 */
export class YouTubePlatform implements SocialPlatform {
  private clientId = process.env.GOOGLE_CLIENT_ID!;
  private clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
  private callbackUrl = process.env.GOOGLE_CALLBACK_URL || `${process.env.NEXT_PUBLIC_APP_URL}/api/social/youtube/callback`;

  getAuthUrl(state: string): string {
    const scopes = [
      "https://www.googleapis.com/auth/youtube.upload",
      "https://www.googleapis.com/auth/youtube.readonly",
      "https://www.googleapis.com/auth/userinfo.profile",
    ].join(" ");

    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.callbackUrl,
      response_type: "code",
      scope: scopes,
      state,
      access_type: "offline",
      prompt: "consent",
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  async exchangeCode(code: string): Promise<{ tokens: OAuthTokens; profile: SocialUserProfile }> {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.callbackUrl,
        grant_type: "authorization_code",
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`YouTube token exchange failed: ${JSON.stringify(error)}`);
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
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (!response.ok) {
      throw new Error("YouTube token refresh failed");
    }

    const data = await response.json();

    return {
      accessToken: data.access_token,
      refreshToken, // Google doesn't always return a new refresh token
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
    };
  }

  private async getProfile(accessToken: string): Promise<SocialUserProfile> {
    // Get YouTube channel info
    const channelResponse = await fetch(
      "https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!channelResponse.ok) {
      throw new Error("YouTube channel fetch failed");
    }

    const channelData = await channelResponse.json();
    const channel = channelData.items?.[0];

    if (!channel) {
      throw new Error("No YouTube channel found for this account");
    }

    return {
      platformUserId: channel.id,
      username: channel.snippet.title,
      avatarUrl: channel.snippet.thumbnails?.default?.url,
    };
  }
}
