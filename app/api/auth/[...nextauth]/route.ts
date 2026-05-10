export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

const handler = NextAuth({
  session: { strategy: "jwt" as const },
  pages: { signIn: "/login" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize() { return null; },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) { if (user) token.id = user.id; return token; },
    async session({ session, token }: any) {
      if (session.user && token.id) (session.user as any).id = token.id;
      return session;
    },
  },
} as any);

export const GET = (req: any) => handler.handlers.GET(req);
export const POST = (req: any) => handler.handlers.POST(req);
