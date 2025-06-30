import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";
export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl;
        if (
          pathname.startsWith("/api/auth") ||
          pathname === "/login" ||
          pathname === "/register"
        ) {
          return true; // Allow access to auth routes
        }
        if (pathname === "/" || pathname.startsWith("/api/videos")) {
          return true; // Allow access to home and video API routes
        }
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    // Match all paths except for the login page
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
