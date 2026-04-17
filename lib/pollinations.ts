import { imagekit } from "./imagekit/client";

const POLLINATIONS_ENDPOINT = "https://gen.pollinations.ai";

/**
 * Generate an AI image using Pollinations.ai and store it in ImageKit for persistence.
 * @param prompt Descriptive text for the image
 * @param options Styling options like width, height, seed, etc.
 * @returns The public URL of the uploaded ImageKit asset
 */
export async function generateAndStoreImage(
  prompt: string,
  options: {
    width?: number;
    height?: number;
    seed?: number;
    model?: string;
    nologo?: boolean;
    enhance?: boolean;
  } = {}
): Promise<string> {
  try {
    const {
      width = 1024,
      height = 1024,
      seed = Math.floor(Math.random() * 1000000),
      model = "flux", // High quality model
      nologo = true,
      enhance = true,
    } = options;

    const apiKey = process.env.POLLINATIONS_API_KEY;
    
    // Pollinations image generation URL structure
    // With Auth it uses gen.pollinations.ai but URL pattern is similar
    const pollUrl = `${POLLINATIONS_ENDPOINT}/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&seed=${seed}&model=${model}&nologo=${nologo}&enhance=${enhance}`;

    console.log(`[Pollinations] Generating image: ${prompt.substring(0, 50)}...`);
    
    // Fetch the image from Pollinations
    const response = await fetch(pollUrl, {
      headers: apiKey ? { "Authorization": `Bearer ${apiKey}` } : {},
    });

    if (!response.ok) {
        throw new Error(`Pollinations failed: ${response.statusText}`);
    }

    const imageBuffer = await response.arrayBuffer();

    // Upload to ImageKit for permanent storage
    console.log(`[Pollinations] Uploading to ImageKit...`);
    const uploadResult = await imagekit.upload({
      file: Buffer.from(imageBuffer),
      fileName: `ai-gen-${Date.now()}.png`,
      folder: "/ai-generated",
      useUniqueFileName: true,
      tags: ["pollinations", "ai-generated"],
    });

    console.log(`[Pollinations] Image ready: ${uploadResult.url}`);
    return uploadResult.url;
  } catch (error) {
    console.error(`[Pollinations] Error:`, error);
    // Fallback if everything fails
    return "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80"; // Luxury hotel fallback
  }
}

/**
 * Suggest dimensions based on platform.
 */
export function getOptimizedDimensions(platform: string): { width: number; height: number } {
  const p = platform.toLowerCase();
  if (p === "instagram" || p === "tiktok") {
    return { width: 1080, height: 1350 }; // Portrait/Reel ratio
  }
  if (p === "twitter" || p === "linkedin" || p === "facebook") {
    return { width: 1200, height: 627 }; // Landscape
  }
  return { width: 1024, height: 1024 }; // Square
}
