import { DefaultSession } from "next-auth";
import { Role, UserInfo } from "@prisma/client";

export type UserRole = Role;

declare module "next-auth" {
  interface User {
    role: UserRole;
    id: string;
    testGroupIdx: UserInfo.testGroupIdx;
  }

  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: User & DefaultSession["user"];
  }
}
