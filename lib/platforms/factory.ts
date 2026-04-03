import { SocialPlatform } from "./types";
import { TwitterPlatform } from "./twitter";
import { InstagramPlatform } from "./instagram";
import { LinkedInPlatform } from "./linkedin";

export function getPlatform(platformName: string): SocialPlatform {
  switch (platformName.toLowerCase()) {
    case "twitter":
      return new TwitterPlatform();
    case "instagram":
      return new InstagramPlatform();
    case "linkedin":
      return new LinkedInPlatform();
    default:
      throw new Error(`Platform ${platformName} not supported yet.`);
  }
}
