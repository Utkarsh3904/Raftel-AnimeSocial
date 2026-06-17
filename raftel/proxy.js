import { clerkMiddleware } from "@clerk/nextjs/server"

// Clerk session wiring only — route protection lives in server pages.
const proxy = clerkMiddleware()

export default proxy
export { proxy }

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
}
