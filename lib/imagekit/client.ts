import ImageKit from "imagekit";

/**
 * ImageKit Server-side SDK Initialization
 * This is used for server-side uploads, transformations, and asset management.
 */

const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT || process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

if (!publicKey || !privateKey || !urlEndpoint) {
  console.warn("ImageKit environment variables are missing. Some media functionality may be restricted.");
}

let _imagekit: ImageKit | null = null;

function getImageKitInstance(): ImageKit {
  if (!_imagekit) {
    const pk = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "dummy_public_key";
    const sk = process.env.IMAGEKIT_PRIVATE_KEY || "dummy_private_key";
    const url = process.env.IMAGEKIT_URL_ENDPOINT || process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/dummy";

    _imagekit = new ImageKit({
      publicKey: pk,
      privateKey: sk,
      urlEndpoint: url,
    });
  }
  return _imagekit;
}

export const imagekit = new Proxy({} as ImageKit, {
  get(target, prop) {
    const instance = getImageKitInstance();
    const value = (instance as any)[prop];
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  }
});

/**
 * AI Transformation Helpers
 * Generates an optimized URL with ImageKit's real-time AI transformations.
 */
export const getTransformedUrl = (path: string, options: {
  width?: number;
  height?: number;
  aspectRatio?: string;
  focus?: "auto" | "face";
  blur?: number;
  effect?: "sepia" | "grayscale" | "sharpen";
  raw?: string; // e.g., "tr=w-400,ar-1-1,fo-auto"
} = {}) => {
  if (!path) return "";
  
  const transformations = [];
  if (options.width) transformations.push(`w-${options.width}`);
  if (options.height) transformations.push(`h-${options.height}`);
  if (options.aspectRatio) transformations.push(`ar-${options.aspectRatio}`);
  if (options.focus) transformations.push(`fo-${options.focus}`);
  if (options.blur) transformations.push(`bl-${options.blur}`);
  if (options.effect) transformations.push(`e-${options.effect}`);
  
  const transformationString = transformations.join(",") + (options.raw ? `,${options.raw}` : "");
  
  return imagekit.url({
    path,
    transformation: transformationString ? [{ format: "auto", quality: "auto" }, { raw: transformationString }] : [{ format: "auto", quality: "auto" }]
  });
};

/**
 * AI Specialized Transformations
 * These require ImageKit's AI extensions to be active on the account.
 */
export const getAITransformedUrl = (path: string, effect: "background-remove" | "object-detection" | "smart-crop") => {
  if (!path) return "";
  
  const tr = effect === "background-remove" ? "bg-remove" : effect === "object-detection" ? "oi-auto" : "fo-auto";
  
  return imagekit.url({
    path,
    transformation: [{ raw: tr }, { format: "auto", quality: "auto" }]
  });
};
