import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define matchers for paths that require authentication
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/compose(.*)",
  "/calendar(.*)",
  "/campaigns(.*)",
  "/triggers(.*)",
  "/segments(.*)",
  "/revenue(.*)",
  "/connections(.*)",
  "/auto-reply(.*)",
  "/contacts(.*)",
  "/analytics(.*)",
  "/agent(.*)",
  // Protect all API routes except public webhooks and Inngest
  "/api/(?!webhooks|inngest)(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html|css|js|gif|svg|png|jpg|jpeg|webp|woff2?|ico|csv|docx|xlsx|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
