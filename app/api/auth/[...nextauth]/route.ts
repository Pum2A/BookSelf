import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "../../../lib/prisma";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (user && user.password === credentials.password) {
          // Jeśli id jest liczba, rzutuj ją na string
          return { id: String(user.id), email: user.email, password: user.password, createdAt: user.createdAt };
        }

        return null;
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/auth/signin",
  },
};

export default NextAuth(authOptions);
