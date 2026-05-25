import { NextResponse } from "next/server";
import { db } from "@/db";
import { mediaAssets } from "@/db/schema";
import { getDbUser } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const dbUser = await getDbUser();
    if (!dbUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const assets = await db
      .select()
      .from(mediaAssets)
      .where(eq(mediaAssets.userId, dbUser.id))
      .orderBy(desc(mediaAssets.createdAt));

    return NextResponse.json(assets);
  } catch (error) {
    console.error("Media Assets Error:", error);
    return NextResponse.json({ error: "Failed to fetch media assets" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const dbUser = await getDbUser();
    if (!dbUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { imageKitFileId, url, type, size } = await request.json();

    if (!imageKitFileId || !url || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const [asset] = await db
      .insert(mediaAssets)
      .values({ userId: dbUser.id, imageKitFileId, url, type, size })
      .returning();

    return NextResponse.json(asset);
  } catch (error) {
    console.error("Save Media Asset Error:", error);
    return NextResponse.json({ error: "Failed to save media asset" }, { status: 500 });
  }
}
