// Demo auth helper — replaces Clerk's auth() for hackathon demo mode.
// Returns a hardcoded userId so all API routes and pages work without Clerk.

const DEMO_USER_ID = "demo_user_resortflow";

export function getDemoUserId(): string {
  return DEMO_USER_ID;
}
