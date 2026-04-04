import { db } from "@/db";
import { contacts } from "@/db/schema";
import { getDemoUserId } from "@/lib/demo-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const clerkId = getDemoUserId();

    const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.clerkId, clerkId),
    });
    if (!user) return new NextResponse("User not found", { status: 404 });

    const body = await req.json();
    const { csvContent } = body;

    if (!csvContent) {
      return new NextResponse("No CSV content provided", { status: 400 });
    }

    const lines = csvContent.split('\n');
    if (lines.length < 2) {
       return new NextResponse("CSV is empty or missing headers", { status: 400 });
    }

    const header = lines[0].split(',').map((h: string) => h.trim().toLowerCase());
    
    const phoneIdx = header.indexOf('phone');
    const nameIdx = header.indexOf('name');
    
    if (phoneIdx === -1) {
      return new NextResponse("CSV must contain a 'phone' column", { status: 400 });
    }

    const newContacts = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const cols = line.split(',').map((c: string) => c.trim());
      const phone = cols[phoneIdx];
      const name = nameIdx !== -1 ? cols[nameIdx] : null;

      if (phone) {
        newContacts.push({
          userId: user.id,
          phone,
          name,
          whatsappOptIn: true,
          smsOptIn: true,
        });
      }
    }

    if (newContacts.length > 0) {
      // Chunking inserts if more than 100 for safety
      const chunkSize = 100;
      for (let i = 0; i < newContacts.length; i += chunkSize) {
          await db.insert(contacts).values(newContacts.slice(i, i + chunkSize));
      }
    }

    return NextResponse.json({ success: true, count: newContacts.length });
  } catch (error) {
    console.error('Failed to import contacts:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
