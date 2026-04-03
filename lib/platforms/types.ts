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
  // For later phases
  // publishPost(tokens: OAuthTokens, content: string, mediaUrls: string[]): Promise<string>;
  // postReply(tokens: OAuthTokens, commentId: string, text: string): Promise<string>;
}
