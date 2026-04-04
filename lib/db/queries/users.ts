import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getUserByAuthId(authId: string) {
  // Demo mode: Return the first user in the database if no user matches the authId
  // This allows zero-auth dashboard access during development/demos.
  const user = await db.query.users.findFirst({
    where: eq(users.authId, authId),
  });
  
  if (!user) {
    return await db.query.users.findFirst();
  }
  
  return user;
}
