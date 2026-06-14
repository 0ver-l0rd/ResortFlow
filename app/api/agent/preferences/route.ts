import { getDbUser } from "@/lib/auth";
import { db } from "@/db";
import { agentPreferences } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { encrypt } from "@/lib/encryption";

const SENSITIVE_PREFERENCE_KEYS = new Set(["zernio_api_key"]);

function serializePreferenceValue(key: string, value: string) {
  return SENSITIVE_PREFERENCE_KEYS.has(key) ? encrypt(value) : value;
}

function deserializePreferenceValue(key: string, value: string) {
  if (!SENSITIVE_PREFERENCE_KEYS.has(key)) {
    return value;
  }

  return "__stored__";
}

export async function GET() {
  try {
    const user = await getDbUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    const prefs = await db.select().from(agentPreferences).where(eq(agentPreferences.userId, user.id));
    const prefMap = prefs.reduce<Record<string, string>>((acc, p) => {
      acc[p.key] = deserializePreferenceValue(p.key, p.value);
      return acc;
    }, {});

    return NextResponse.json(prefMap);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return new NextResponse(message, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getDbUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json(); // Expected: { key: string, value: string } or Record<string, string>
    
    if (body.key && body.value) {
      // Single update
      await db.delete(agentPreferences).where(
        and(eq(agentPreferences.userId, user.id), eq(agentPreferences.key, body.key))
      );
      await db.insert(agentPreferences).values({ userId: user.id, key: body.key, value: serializePreferenceValue(body.key, body.value) });
    } else {
      // Bulk update
      for (const [key, value] of Object.entries(body)) {
        await db.delete(agentPreferences).where(
          and(eq(agentPreferences.userId, user.id), eq(agentPreferences.key, key))
        );
        await db.insert(agentPreferences).values({ userId: user.id, key, value: serializePreferenceValue(key, String(value)) });
      }
    }

    return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return new NextResponse(message, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getDbUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    const { key } = await req.json();
    if (!key || typeof key !== "string") {
      return new NextResponse("Preference key is required", { status: 400 });
    }

    await db.delete(agentPreferences).where(
      and(eq(agentPreferences.userId, user.id), eq(agentPreferences.key, key))
    );

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return new NextResponse(message, { status: 500 });
  }
}
