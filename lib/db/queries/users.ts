import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getUserByAuthId(authId: string) {
  if (!authId) return null;
  
  const user = await db.query.users.findFirst({
    where: eq(users.authId, authId),
  });
  
  return user || null;
}
