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

  async publishPost(tokens: OAuthTokens, content: string, mediaUrls: string[]): Promise<{ postId: string; platform: string; simulated?: boolean; mediaUrls?: string[] }> {
    console.log(`[Twitter] Attempting to publish: "${content.substring(0, 50)}..." with ${mediaUrls.length} media items.`);

    if (content.length > 280) {
      throw new Error("Twitter content exceeds 280 characters.");
    }

    try {
      const mediaIds: string[] = [];
      
      // 1. Upload Media if provided
      if (mediaUrls.length > 0) {
        for (const url of mediaUrls) {
          try {
            const mediaId = await this.uploadMedia(tokens.accessToken, url);
            if (mediaId) mediaIds.push(mediaId);
          } catch (uploadError: any) {
            console.error("[Twitter] Media Upload Failed. Checking for simulation fallback...", uploadError.message);
            // If media upload fails due to limits, we trigger simulation
            if (uploadError.message.includes("403") || uploadError.message.includes("402") || uploadError.message.includes("429")) {
               throw uploadError; // Re-throw to handle in outer catch
            }
          }
        }
      }

      // 2. Create Tweet
      const body: any = { text: content };
      if (mediaIds.length > 0) {
        body.media = { media_ids: mediaIds };
      }

      const response = await fetch("https://api.twitter.com/2/tweets", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${tokens.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        console.error("[Twitter] API Error Details:", JSON.stringify(errorBody, null, 2));
        
        // Handle Credits Depleted (402) or Forbidden/Limit (403/429) for DEMO mode
        if (response.status === 402 || response.status === 403 || response.status === 429) {
          console.warn(`[Twitter] ${response.status} Error: API exhausted. Falling back to Simulation Mode [Free Method].`);
          
          return {
            postId: `sim_${Math.random().toString(36).substring(7)}`,
            platform: "twitter",
            simulated: true,
            mediaUrls: mediaUrls // Preserve for the dashboard
          };
        }

        if (response.status === 401) {
          throw new Error("Twitter 401: Unauthorized. Token might be invalid or expired.");
        }

        throw new Error(`Twitter Post Failed (${response.status}): ${errorBody.detail || errorBody.message || response.statusText}`);
      }

      const result = await response.json();
      console.log("[Twitter] Successfully published post:", result.data.id);

      return {
        postId: result.data.id,
        platform: "twitter",
        mediaUrls: mediaUrls
      };
    } catch (error: any) {
      // Catch-all for simulation fallback if it's a known credit/limit issue
      if (error.message.includes("402") || error.message.includes("403") || error.message.includes("429")) {
        return {
          postId: `sim_${Math.random().toString(36).substring(7)}`,
          platform: "twitter",
          simulated: true,
          mediaUrls: mediaUrls
        };
      }
      console.error("[Twitter] Execution Error:", error.message);
      throw error;
    }
  }

  /**
   * Internal helper to upload media to X v1.1
   */
  private async uploadMedia(accessToken: string, mediaUrl: string): Promise<string> {
    const response = await fetch(mediaUrl);
    if (!response.ok) throw new Error("Failed to download media for upload.");
    const blob = await response.blob();

    const formData = new FormData();
    formData.append("media", blob);

    const uploadRes = await fetch("https://upload.twitter.com/1.1/media/upload.json", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!uploadRes.ok) {
      const error = await uploadRes.json().catch(() => ({}));
      throw new Error(`X Media Upload Failed (${uploadRes.status}): ${JSON.stringify(error)}`);
    }

    const data = await uploadRes.json();
    return data.media_id_string;
  }

  async fetchPostHistory(tokens: OAuthTokens, platformUserId: string): Promise<any[]> {
    console.log(`[Twitter] Fetching history for user: ${platformUserId}`);
    
    // Fetch last 50 tweets, excluding retweets and replies for a clean dashboard
    const params = new URLSearchParams({
      "tweet.fields": "created_at,public_metrics,text",
      "max_results": "50",
      "exclude": "retweets,replies"
    });

    try {
      const response = await fetch(`https://api.twitter.com/2/users/${platformUserId}/tweets?${params.toString()}`, {
        headers: {
          "Authorization": `Bearer ${tokens.accessToken}`,
        },
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        console.error("[Twitter] Fetch History Error:", errorBody);
        
        // If we hit limits while syncing, just return empty instead of crashing
        if (response.status === 402 || response.status === 403 || response.status === 429) {
          return [];
        }
        throw new Error("Failed to fetch Twitter history");
      }

      const { data = [] } = await response.json();
      
      return data.map((tweet: any) => ({
        id: tweet.id,
        content: tweet.text,
        createdAt: new Date(tweet.created_at),
        metrics: {
          likes: tweet.public_metrics?.like_count || 0,
          shares: tweet.public_metrics?.retweet_count || 0,
          replies: tweet.public_metrics?.reply_count || 0,
          impressions: tweet.public_metrics?.impression_count || 0,
        }
      }));
    } catch (error: any) {
      console.error("[Twitter] Fetch History Error:", error.message);
      return [];
    }
  }

  async postReply(tokens: OAuthTokens, commentId: string, text: string): Promise<string> {
    console.log(`[Twitter] Real Reply to ${commentId}: "${text}"`);
    
    const response = await fetch("https://api.twitter.com/2/tweets", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${tokens.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
        reply: {
          in_reply_to_tweet_id: commentId
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Twitter Reply Failed: ${errorData.detail || response.statusText}`);
    }

    const { data } = await response.json();
    return data.id;
  }
}
