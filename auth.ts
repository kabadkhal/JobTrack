import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

import clientPromise from "@/lib/mongodb";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,

  secret: process.env.AUTH_SECRET,

  providers: [
    Credentials({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email)
          .trim()
          .toLowerCase();

        const password = String(credentials.password);

        try {
          const client = await clientPromise;

          const db = client.db(
            process.env.MONGODB_DB || "jobtrack"
          );

          const user = await db
            .collection("users")
            .findOne({ email });

          if (!user) {
            return null;
          }

          const passwordMatches = await compare(
            password,
            String(user.passwordHash)
          );

          if (!passwordMatches) {
            return null;
          }

          return {
            id: user._id.toString(),
            name: String(user.name),
            email: String(user.email),
            role: String(user.role || "user"),
          };
        } catch (error) {
          console.error(
            "Authentication error:",
            error
          );

          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({
      token,
      user,
      trigger,
      session,
    }) {
      /*
       * Initial login
       */
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
      }

      /*
       * Update the JWT when the client
       * updates the session.
       */
      if (
        trigger === "update" &&
        session?.name
      ) {
        token.name = String(session.name);
      }

      return token;
    },

    async session({
      session,
      token,
    }) {
      if (session.user) {
        session.user.id = String(
          token.id
        );

        session.user.role = String(
          token.role || "user"
        );

        session.user.name = String(
          token.name || ""
        );

        session.user.email = String(
          token.email || ""
        );
      }

      return session;
    },
  },
});