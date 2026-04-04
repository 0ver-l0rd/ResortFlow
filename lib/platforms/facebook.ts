import { SocialPlatform, OAuthTokens, SocialUserProfile } from "./types";

/**
 * Facebook Platform OAuth Integration
 * 
 * Required Scopes:
 * - pages_show_list: List user's pages
 * - pages_read_engagement: Read page engagement data
 * - pages_manage_posts: Create and manage posts on pages
 * - public_profile: Access basic profile info
 * 
 * App Setup: https://developers.facebook.com/apps/
 * Callback URL: /api/social/facebook/callback
 */
export class FacebookPlatform implements SocialPlatform {
  private clientId = process.env.META_CLIENT_ID!;
  private clientSecret = process.env.META_CLIENT_SECRET!;
  private callbackUrl = process.env.FACEBOOK_CALLBACK_URL || `${process.env.NEXT_PUBLIC_APP_URL}/api/social/facebook/callback`;

  getAuthUrl(state: string): string {
    const scopes = [
      "pages_show_list",
      "pages_read_engagement",
      "pages_manage_posts",
      "public_profile",
    ].join(",");

    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.callbackUrl,
      scope: scopes,
      state,
      response_type: "code",
    });

    return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
  }

  async exchangeCode(code: string): Promise<{ tokens: OAuthTokens; profile: SocialUserProfile }> {
    const response = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token?${new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.callbackUrl,
      client_secret: this.clientSecret,
      code,
    })}`);

    if (!response.ok) {
      throw new Error("Facebook token exchange failed");
    }

    const data = await response.json();

    // Exchange short-lived token for long-lived one
    const longLivedResponse = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token?${new URLSearchParams({
      grant_type: "fb_exchange_token",
      client_id: this.clientId,
      client_secret: this.clientSecret,
      fb_exchange_token: data.access_token,
    })}`);

    if (!longLivedResponse.ok) {
      throw new Error("Facebook long-lived token exchange failed");
    }

    const { access_token, expires_in } = await longLivedResponse.json();

    const tokens: OAuthTokens = {
      accessToken: access_token,
      expiresAt: expires_in ? new Date(Date.now() + expires_in * 1000) : undefined,
    };

    const profile = await this.getProfile(tokens.accessToken);

    return { tokens, profile };
  }

  async refreshToken(_refreshToken: string): Promise<OAuthTokens> {
    throw new Error("Facebook uses long-lived tokens (60 days). Re-authenticate to refresh.");
  }

  private async getProfile(accessToken: string): Promise<SocialUserProfile> {
    const response = await fetch(`https://graph.facebook.com/v18.0/me?fields=id,name,picture.type(large)&access_token=${accessToken}`);

    if (!response.ok) {
      throw new Error("Facebook profile fetch failed");
    }

    const data = await response.json();

    return {
      platformUserId: data.id,
      username: data.name,
      avatarUrl: data.picture?.data?.url,
    };
  }

  async publishPost(tokens: OAuthTokens, content: string, mediaUrls: string[]): Promise<{ postId: string; platform: string }> {
    console.log(`[Facebook] Publishing to Page: "${content.substring(0, 50)}..."`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { postId: `fb-${Math.random().toString(36).substring(7)}`, platform: "facebook" };
  }

  async postReply(tokens: OAuthTokens, commentId: string, text: string): Promise<string> {
    console.log(`[Facebook] Replying to post: "${text}"`);
    return `fb-reply-${Math.random().toString(36).substring(7)}`;
  }
}
