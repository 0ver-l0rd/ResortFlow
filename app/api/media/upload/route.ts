import { NextResponse } from "next/server";
import { getDemoUserId } from "@/lib/demo-auth";
import { db } from "@/db";
import { mediaAssets, users } from "@/db/schema";
import { imagekit } from "@/lib/imagekit/client";
import { eq } from "drizzle-orm";
import { uploadMediaToZernio } from "@/lib/zernio";

export async function POST(request: Request) {
  try {
    const userId = getDemoUserId();

    const user = await db.query.users.findFirst();

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert File to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Determine type (image or video)
    const type = file.type.startsWith("video") ? "video" : "image";

    // ── Upload to ImageKit (local media library) ──────────────────────────
    let imagekitUrl = "";
    let imagekitFileId = "";
    try {
      const uploadResponse = await imagekit.upload({
        file: buffer,
        fileName: file.name,
        folder: `/user_${user.id}/uploads`,
        useUniqueFileName: true,
      });
      imagekitUrl = uploadResponse.url;
      imagekitFileId = uploadResponse.fileId;

      // Store in database
      await db.insert(mediaAssets).values({
        userId: user.id,
        imageKitFileId: uploadResponse.fileId,
        url: uploadResponse.url,
        type: type,
        size: file.size,
      });
    } catch (ikErr: any) {
      console.warn("ImageKit upload failed (non-fatal):", ikErr.message);
    }

    // ── Upload to Zernio (for social posting) ─────────────────────────────
    let zernioPublicUrl = "";
    try {
      zernioPublicUrl = await uploadMediaToZernio(
        file.name,
        file.type,
        buffer
      );
      console.log("✅ Zernio media uploaded:", zernioPublicUrl);
    } catch (zErr: any) {
      console.warn("Zernio media upload failed (non-fatal):", zErr.message);
    }

    // Prefer Zernio URL for posting (platforms can fetch it), fall back to ImageKit
    const primaryUrl = zernioPublicUrl || imagekitUrl;

    return NextResponse.json({
      url: primaryUrl,
      imagekitUrl: imagekitUrl || undefined,
      zernioUrl: zernioPublicUrl || undefined,
      fileId: imagekitFileId || `zernio-${Date.now()}`,
      name: file.name,
      type: type,
    });
  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { error: "Failed to upload file", details: error.message },
      { status: 500 }
    );
  }
}
