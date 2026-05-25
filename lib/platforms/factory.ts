import { SocialPlatform } from "./types";
import { TwitterPlatform } from "./twitter";
import { InstagramPlatform } from "./instagram";
import { LinkedInPlatform } from "./linkedin";
import { FacebookPlatform } from "./facebook";
import { TikTokPlatform } from "./tiktok";
import { YouTubePlatform } from "./youtube";
import { PinterestPlatform } from "./pinterest";

export function getPlatform(platformName: string): SocialPlatform {
  switch (platformName.toLowerCase()) {
    case "twitter":
    case "x":
      return new TwitterPlatform();
    case "instagram":
      return new InstagramPlatform();
    case "linkedin":
      return new LinkedInPlatform();
    case "facebook":
      return new FacebookPlatform();
    case "tiktok":
      return new TikTokPlatform();
    case "youtube":
      return new YouTubePlatform();
    case "pinterest":
      return new PinterestPlatform();
    default:
      throw new Error(`Platform "${platformName}" is not supported.`);
  }
}
