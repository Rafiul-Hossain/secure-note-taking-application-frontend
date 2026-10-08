import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
    if (isAdminRoute && req.nextauth.token?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: { authorized: ({ token }) => !!token },
    pages: { signIn: "/signin" },
  }
);

// "/" (my notes) and everything under /admin need a login.
// /signin, /signup and /posts/[userId] stay public.
export const config = { matcher: ["/", "/admin/:path*"] };