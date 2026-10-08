import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "user" | "admin";
      accessToken: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: "user" | "admin";
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "user" | "admin";
    accessToken: string;
  }
}