import { imagekit } from "./imagekit/client";

const POLLINATIONS_ENDPOINT = "https://gen.pollinations.ai";

/**
 * Generate an AI image using Pollinations.ai and store it in ImageKit for persistence.
 * @param prompt Descriptive text for the image
 * @param options Styling options like width, height, seed, etc.
 * @returns The public URL of the uploaded ImageKit asset
 */
export interface ImageGenerationResult {
  url: string;
  status: "success" | "fallback" | "failed";
  error?: string;
}

/**
 * Generate an AI image using Pollinations.ai and store it in ImageKit for persistence.
 * @param prompt Descriptive text for the image
 * @param options Styling options like width, height, seed, etc.
 * @returns An object containing the public URL, the generation status, and optional error details.
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
    allowFallback?: boolean;
  } = {}
): Promise<ImageGenerationResult> {
  const {
    width = 1024,
    height = 1024,
    seed = Math.floor(Math.random() * 1000000),
    model = "flux", // High quality model
    nologo = true,
    enhance = true,
    allowFallback = true,
  } = options;

  const fallbackUrl = "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80"; // Luxury hotel fallback

  // Check ImageKit configuration
  const ikPublicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
  const ikPrivateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const ikUrlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT || process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

  if (!ikPublicKey || !ikPrivateKey || !ikUrlEndpoint) {
    const errorMsg = "ImageKit environment variables are missing. Server-side media upload is unavailable.";
    console.warn(`[Pollinations] ${errorMsg}`);
    if (allowFallback) {
      console.log("[Pollinations] Falling back to default Unsplash luxury hotel image.");
      return {
        url: fallbackUrl,
        status: "fallback",
        error: errorMsg,
      };
    } else {
      return {
        url: "",
        status: "failed",
        error: errorMsg,
      };
    }
  }

  try {
    const apiKey = process.env.POLLINATIONS_API_KEY;
    if (!apiKey) {
      console.log("[Pollinations] POLLINATIONS_API_KEY is not set. Using public/anonymous generation endpoint.");
    }

    // Correct Pollinations endpoint: gen.pollinations.ai/image/{prompt}
    // Also support passing key in query params for reliability
    let pollUrl = `${POLLINATIONS_ENDPOINT}/image/${encodeURIComponent(prompt)}?width=${width}&height=${height}&seed=${seed}&model=${model}&nologo=${nologo}&enhance=${enhance}`;
    if (apiKey) {
      pollUrl += `&key=${apiKey}`;
    }

    console.log(`[Pollinations] Generating image via URL: ${pollUrl.split("&key=")[0]} (key hidden)`);
    
    // Fetch the image from Pollinations
    const response = await fetch(pollUrl, {
      headers: apiKey ? { "Authorization": `Bearer ${apiKey}` } : {},
    });

    if (!response.ok) {
        throw new Error(`Pollinations API failed with status ${response.status}: ${response.statusText}`);
    }

    const imageBuffer = await response.arrayBuffer();

    if (!imageBuffer || imageBuffer.byteLength === 0) {
      throw new Error("Received empty image buffer from Pollinations API.");
    }

    // Upload to ImageKit for permanent storage
    console.log(`[Pollinations] Uploading to ImageKit...`);
    const uploadResult = await imagekit.upload({
      file: Buffer.from(imageBuffer),
      fileName: `ai-gen-${Date.now()}.png`,
      folder: "/ai-generated",
      useUniqueFileName: true,
      tags: ["pollinations", "ai-generated"],
    });

    if (!uploadResult || !uploadResult.url) {
      throw new Error("ImageKit upload response did not return a valid URL.");
    }

    console.log(`[Pollinations] Image ready: ${uploadResult.url}`);
    return {
      url: uploadResult.url,
      status: "success",
    };
  } catch (error: any) {
    const errMsg = error?.message || String(error);
    console.error(`[Pollinations] Error:`, error);
    
    if (allowFallback) {
      console.log("[Pollinations] Falling back to default Unsplash luxury hotel image.");
      return {
        url: fallbackUrl,
        status: "fallback",
        error: errMsg,
      };
    } else {
      return {
        url: "",
        status: "failed",
        error: errMsg,
      };
    }
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
