import { auth } from "@/auth";

export const proxy = auth((request) => {
  const isLoggedIn = !!request.auth;
  const pathname = request.nextUrl.pathname;

  const isPublicRoute =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/api/auth") ||
    pathname === "/api/register";

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(
      new URL("/login", request.nextUrl.origin)
    );
  }

  if (
    isLoggedIn &&
    (pathname === "/login" ||
      pathname === "/register")
  ) {
    return Response.redirect(
      new URL("/", request.nextUrl.origin)
    );
  }
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};