import { DefaultSession } from "next-auth";

export type UserRole = "ADMIN" | "USER";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      role: UserRole;
      id: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: UserRole;
    id: string;
  }
}
