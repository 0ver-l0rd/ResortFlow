import { SocialPlatform, OAuthTokens, SocialUserProfile } from "./types";

export class InstagramPlatform implements SocialPlatform {
  private clientId = process.env.META_CLIENT_ID!;
  private clientSecret = process.env.META_CLIENT_SECRET!;
  private callbackUrl = process.env.META_CALLBACK_URL!;

  getAuthUrl(state: string): string {
    const scopes = [
      "instagram_basic",
      "instagram_content_publish",
      "instagram_manage_comments",
      "instagram_manage_insights",
      "pages_show_list", // Required for Business API
      "pages_read_engagement",
    ].join(",");

    // Using Facebook Login for Business to get Instagram credentials
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.callbackUrl,
      scope: scopes,
      state: state,
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
      throw new Error("Instagram token exchange failed");
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
      throw new Error("Instagram long-lived token exchange failed");
    }

    const { access_token, expires_in } = await longLivedResponse.json();

    const tokens: OAuthTokens = {
      accessToken: access_token,
      expiresAt: expires_in ? new Date(Date.now() + expires_in * 1000) : undefined,
    };

    const profile = await this.getProfile(tokens.accessToken);

    return { tokens, profile };
  }

  async refreshToken(refreshToken: string): Promise<OAuthTokens> {
    // For Facebook/Instagram, we typically use the long-lived token and manually refresh it.
    // Long-lived tokens last 60 days.
    throw new Error("Instagram token refresh strategy: long-lived tokens must be manually refreshed or updated on login.");
  }

  private async getProfile(accessToken: string): Promise<SocialUserProfile> {
    // 1. Get Accounts (Pages)
    const accountsResponse = await fetch(`https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`);
    const { data: accounts } = await accountsResponse.json();

    if (!accounts || accounts.length === 0) {
      throw new Error("No Facebook Pages found associated with this account.");
    }

    // 2. Find Instagram Business Account for the first Page
    const pageId = accounts[0].id;
    const instagramResponse = await fetch(`https://graph.facebook.com/v18.0/${pageId}?fields=instagram_business_account{id,username,profile_picture_url}&access_token=${accessToken}`);
    const { instagram_business_account: igAccount } = await instagramResponse.json();

    if (!igAccount) {
      throw new Error("No Instagram Business account linked to this Facebook Page.");
    }

    return {
      platformUserId: igAccount.id,
      username: igAccount.username,
      avatarUrl: igAccount.profile_picture_url,
    };
  }

  async publishPost(tokens: OAuthTokens, content: string, mediaUrls: string[]): Promise<{ postId: string; platform: string }> {
    console.log(`[Instagram] Publishing to IG Business: "${content.substring(0, 50)}..." with ${mediaUrls.length} media items.`);
    
    // Instagram requires at least one media item
    if (mediaUrls.length === 0) {
      throw new Error("Instagram requires at least one image or video for posting.");
    }

    // Simulate Instagram's Two-Step Publishing (Container Creation -> Publishing)
    await new Promise(resolve => setTimeout(resolve, 1200));

    return {
      postId: `ig-${Math.random().toString(36).substring(7)}`,
      platform: "instagram"
    };
  }

  async postReply(tokens: OAuthTokens, commentId: string, text: string): Promise<string> {
    console.log(`[Instagram] Replying to comment ${commentId}: "${text}"`);
    return `ig-reply-${Math.random().toString(36).substring(7)}`;
  }

  async fetchPostHistory(tokens: OAuthTokens, platformUserId: string): Promise<any[]> {
    console.log(`[Instagram] Fetching history for user: ${platformUserId}`);
    return [];
  }
}
