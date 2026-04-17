import { db } from "./db";
import { users } from "./db/schema";
import { getDemoUserId } from "./lib/demo-auth";

async function main() {
  console.log("Seeding Demo User...");
  const authId = getDemoUserId();
  
  const existing = await db.query.users.findFirst();
  if (!existing) {
    await db.insert(users).values({
      authId,
      email: "demo@resortflow.com",
      plan: "pro",
    });
    console.log("User seeded!");
  } else {
    console.log("User already exists.");
  }
}

main().catch(console.error).finally(() => process.exit(0));
