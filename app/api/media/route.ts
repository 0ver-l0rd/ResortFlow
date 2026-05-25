import { NextResponse } from "next/server";
import { db } from "@/db";
import { mediaAssets } from "@/db/schema";
import { getDemoUserId } from "@/lib/demo-auth";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const userId = getDemoUserId();

    const dbUser = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.authId, userId),
    });
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

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
    const userId = getDemoUserId();

    const dbUser = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.authId, userId),
    });
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

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
