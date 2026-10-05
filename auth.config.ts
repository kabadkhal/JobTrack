import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },

  callbacks: {
    authorized({
      auth,
      request: { nextUrl },
    }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      const isPublicRoute =
        pathname === "/login" ||
        pathname === "/register";

      if (isPublicRoute) {
        return true;
      }

      return isLoggedIn;
    },
  },

  providers: [],
} satisfies NextAuthConfig;