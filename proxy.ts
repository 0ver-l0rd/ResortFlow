import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

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
]);

export const proxy = clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;
  const isPublicApiRoute = pathname.startsWith("/api/webhooks") || pathname.startsWith("/api/inngest");
  const isProtectedApiRoute = pathname.startsWith("/api/") && !isPublicApiRoute;

  if (isProtectedRoute(req) || isProtectedApiRoute) {
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
