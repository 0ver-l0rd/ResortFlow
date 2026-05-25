import { SocialPlatform, OAuthTokens, SocialUserProfile } from "./types";

export class LinkedInPlatform implements SocialPlatform {
  private clientId = process.env.LINKEDIN_CLIENT_ID!;
  private clientSecret = process.env.LINKEDIN_CLIENT_SECRET!;
  private callbackUrl = process.env.LINKEDIN_CALLBACK_URL!;

  getAuthUrl(state: string): string {
    const scopes = [
      "w_member_social", // Required for posting
      "email",
      "openid",
      "profile",
    ].join(" ");
    
    const params = new URLSearchParams({
      response_type: "code",
      client_id: this.clientId,
      redirect_uri: this.callbackUrl,
      state: state,
      scope: scopes,
    });
    
    return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
  }

  async exchangeCode(code: string): Promise<{ tokens: OAuthTokens; profile: SocialUserProfile }> {
    const response = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: this.callbackUrl,
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }),
    });

    if (!response.ok) {
      throw new Error("LinkedIn token exchange failed");
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
    const response = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }),
    });

    if (!response.ok) {
      throw new Error("LinkedIn token refresh failed");
    }

    const data = await response.json();
    
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
    };
  }

  private async getProfile(accessToken: string): Promise<SocialUserProfile> {
    // Using OpenID Connect UserInfo endpoint
    const response = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("LinkedIn profile fetch failed");
    }

    const data = await response.json();
    
    return {
      platformUserId: data.sub,
      username: data.name,
      avatarUrl: data.picture,
    };
  }

  async publishPost(tokens: OAuthTokens, content: string, mediaUrls: string[]): Promise<{ postId: string; platform: string }> {
    console.log(`[LinkedIn] Publishing post to profile: "${content.substring(0, 50)}..."`);
    
    // Simulate LinkedIn's UGC Post API
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      postId: `li-${Math.random().toString(36).substring(7)}`,
      platform: "linkedin"
    };
  }

  async postReply(tokens: OAuthTokens, commentId: string, text: string): Promise<string> {
    console.log(`[LinkedIn] Posting comment: "${text}"`);
    return `li-comment-${Math.random().toString(36).substring(7)}`;
  }

  async fetchPostHistory(tokens: OAuthTokens, platformUserId: string): Promise<any[]> {
    console.log(`[LinkedIn] Fetching history for user: ${platformUserId}`);
    return [];
  }
}
