import { db } from "./db";
import { users } from "./db/schema";

async function main() {
  console.log("Checking for existing users...");
  
  const existing = await db.query.users.findFirst();
  if (!existing) {
    console.log("No users found. Users will be created automatically when they sign in via Clerk.");
  } else {
    console.log(`Found existing user: ${existing.email}`);
  }
}

main().catch(console.error).finally(() => process.exit(0));
