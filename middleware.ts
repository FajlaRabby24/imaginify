import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 👇 Add all public routes here
const isPublicRoute = createRouteMatcher([
  "/", // home page (optional)
  "/sign-in(.*)", // Clerk sign-in page
  "/sign-up(.*)", // Clerk sign-up page
  "/api/webhooks/clerk", // your webhook route
]);
export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
