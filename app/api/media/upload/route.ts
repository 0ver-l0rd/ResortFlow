import { NextResponse } from "next/server";
import { getDemoUserId } from "@/lib/demo-auth";
import { db } from "@/db";
import { mediaAssets, users } from "@/db/schema";
import { imagekit } from "@/lib/imagekit/client";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const userId = getDemoUserId();

    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, userId),
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert File to Buffer for ImageKit SDK
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: file.name,
      folder: `/user_${user.id}/uploads`,
      useUniqueFileName: true,
    });

    // Determine type (image or video)
    const type = file.type.startsWith("video") ? "video" : "image";

    // Store in database
    await db.insert(mediaAssets).values({
      userId: user.id,
      imageKitFileId: uploadResponse.fileId,
      url: uploadResponse.url,
      type: type,
      size: file.size,
    });

    return NextResponse.json({
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
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
