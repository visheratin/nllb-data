import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/"],
});

export const config = {
  matcher: ["/((?!_next|_error|_not-found).)*", "/", "/(api|trpc)(.*)"],
};
