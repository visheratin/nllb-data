import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "_error", "_not-found"],
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next|_error|_not-found).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
