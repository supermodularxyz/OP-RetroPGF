import type { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { AuthOptions, type Session } from "next-auth";
import { type JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SiweMessage } from "siwe";

const providers = [
  CredentialsProvider({
    name: "Ethereum",
    credentials: {
      message: {
        label: "Message",
        type: "text",
        placeholder: "0x0",
      },
      signature: {
        label: "Signature",
        type: "text",
        placeholder: "0x0",
      },
    },
    async authorize(credentials, req) {
      try {
        const siwe = new SiweMessage(
          JSON.parse(credentials?.message ?? "{}") as object
        );
        const nextAuthUrl = new URL(process.env.NEXTAUTH_URL!);

        const result = await siwe.verify({
          signature: credentials?.signature ?? "",
          domain: nextAuthUrl.host,
          nonce: await getCsrfToken({ req }),
        });

        if (result.success) {
          return {
            id: siwe.address,
          };
        }
        return null;
      } catch (e) {
        return null;
      }
    },
  }),
];

export const authOptions: AuthOptions = {
  providers,
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET!,
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      (session.user ?? { name: "" }).name = token.sub;
      return session;
    },
  },
};

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const isDefaultSigninPage =
    req.method === "GET" && req.query.nextauth?.includes("signin");

  // Hide Sign-In with Ethereum from default sign page
  if (isDefaultSigninPage) {
    providers.pop();
  }

  /* eslint-disable @typescript-eslint/no-unsafe-return */
  return await NextAuth(req, res, authOptions);
}
