import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getUserByClerkId(clerkId: string) {
  // Demo mode: Return the first user in the database if no user matches the clerkId
  // This allows zero-auth dashboard access during development/demos.
  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, clerkId),
  });
  
  if (!user) {
    return await db.query.users.findFirst();
  }
  
  return user;
}
