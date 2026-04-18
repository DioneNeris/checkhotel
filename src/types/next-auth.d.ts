import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      requiresNewPassword: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
    requiresNewPassword: boolean;
  }
}
