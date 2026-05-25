import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Resolves the authenticated user from Clerk and returns their local database record.
 * Automatically synchronizes Clerk identities to the local database on first sign-in.
 */
export async function getDbUser() {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  // Attempt to find the user by their Clerk ID in the local database
  let dbUser = await db.query.users.findFirst({
    where: eq(users.authId, userId),
  });

  // If the user does not exist in the database yet, sync them on demand
  if (!dbUser) {
    try {
      const clerkUser = await currentUser();
      if (!clerkUser) {
        return null;
      }
      
      const email = clerkUser.emailAddresses[0]?.emailAddress || "";

      const [newUser] = await db
        .insert(users)
        .values({
          authId: userId,
          email,
          plan: "free",
        })
        .returning();
      
      dbUser = newUser;
      console.log(`Synced new user ${email} (${userId}) to local database.`);
    } catch (error) {
      console.error("Error syncing Clerk user to database:", error);
      return null;
    }
  }

  return dbUser;
}
