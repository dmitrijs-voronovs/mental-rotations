import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import Auth0Provider from "next-auth/providers/auth0";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@lib/prisma";
import { createUserCallback } from "@utils/auth/createUserCallback";

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID!,
      clientSecret: process.env.AUTH0_CLIENT_SECRET!,
      issuer: process.env.AUTH0_ISSUER,
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      const { testGroup, info } = (await prisma.userInfo.findUnique({
        where: {
          userId: user.id,
        },
        select: {
          testGroup: true,
          info: true,
        },
      }))!;
      if (session.user) {
        session.user.role = user.role;
        session.user.id = user.id;
        session.user.testGroup = testGroup;
        session.user.infoFilled = Boolean(
          info && Object.entries(info).length > 0
        );
      }
      console.log({ session });
      return session;
    },
  },
  events: {
    async createUser(message) {
      await createUserCallback(message);
    },
  },
});
