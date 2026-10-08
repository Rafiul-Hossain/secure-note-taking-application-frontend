import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },

  pages: { signIn: "/signin" },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password");
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          }
        );

        const response = await res.json();
        if (!res.ok) throw new Error(response?.message || "Login failed");

        const { user, token } = response.data;
        return {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          accessToken: token,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id,
        role: token.role,
        accessToken: token.accessToken,
      };
      return session;
    },
  },
};