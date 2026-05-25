import { NextResponse } from "next/server";
import { getDbUser } from "@/lib/auth";
import { db } from "@/db";
import { campaigns } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const user = await getDbUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    const data = await db.query.campaigns.findMany({
      where: eq(campaigns.userId, user.id),
      orderBy: [desc(campaigns.createdAt)],
      with: {
        posts: true,
        messages: true,
      }
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
