export interface OAuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
}

export interface SocialUserProfile {
  platformUserId: string;
  username: string;
  avatarUrl?: string;
}

export interface SocialPlatform {
  getAuthUrl(state: string): string;
  exchangeCode(code: string): Promise<{ tokens: OAuthTokens; profile: SocialUserProfile }>;
  refreshToken(refreshToken: string): Promise<OAuthTokens>;
  
  /**
   * Publishes a post to the platform.
   */
  publishPost(tokens: OAuthTokens, content: string, mediaUrls: string[]): Promise<{ postId: string; platform: string }>;
  
  /**
   * Posts a reply to a specific comment.
   */
  /**
   * Fetches recent post history from the platform.
   */
  fetchPostHistory(tokens: OAuthTokens, platformUserId: string): Promise<any[]>;
}
