import { SocialPlatform, OAuthTokens, SocialUserProfile } from "./types";

export class TwitterPlatform implements SocialPlatform {
  private clientId = process.env.TWITTER_CLIENT_ID!;
  private clientSecret = process.env.TWITTER_CLIENT_SECRET!;
  private callbackUrl = process.env.TWITTER_CALLBACK_URL!;

  getAuthUrl(state: string): string {
    const scopes = [
      "tweet.read",
      "tweet.write",
      "users.read",
      "offline.access", // Required for refresh token
    ].join(" ");
    
    const params = new URLSearchParams({
      response_type: "code",
      client_id: this.clientId,
      redirect_uri: this.callbackUrl,
      scope: scopes,
      state: state,
      code_challenge: "challenge", // Simplified PKCE for now
      code_challenge_method: "plain",
    });
    
    return `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
  }

  async exchangeCode(code: string): Promise<{ tokens: OAuthTokens; profile: SocialUserProfile }> {
    const response = await fetch("https://api.twitter.com/2/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        code,
        grant_type: "authorization_code",
        redirect_uri: this.callbackUrl,
        code_verifier: "challenge",
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Twitter token exchange failed: ${JSON.stringify(error)}`);
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
    const response = await fetch("https://api.twitter.com/2/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (!response.ok) {
      throw new Error("Twitter token refresh failed");
    }

    const data = await response.json();
    
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
    };
  }

  private async getProfile(accessToken: string): Promise<SocialUserProfile> {
    const response = await fetch("https://api.twitter.com/2/users/me?user.fields=profile_image_url,username", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Twitter profile fetch failed");
    }

    const { data } = await response.json();
    
    return {
      platformUserId: data.id,
      username: data.username,
      avatarUrl: data.profile_image_url,
    };
  }
}
