import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/esqueci-senha");

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/app", req.url));
      }
      return null;
    }

    if (!isAuth) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (req.nextUrl.pathname.startsWith("/admin") && token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/app", req.url));
    }

    return null;
  },
  {
    callbacks: {
      authorized({ req, token }) {
        // Allow public access to auth pages, let the middleware function handle the logic
        if (req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/esqueci-senha")) {
          return true;
        }
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/app/:path*", "/login", "/esqueci-senha"],
};
