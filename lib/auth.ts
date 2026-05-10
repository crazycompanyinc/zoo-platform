import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

const memoryAdapter = () => ({
  createUser: async (data: any) => ({ id: crypto.randomUUID(), ...data }),
  getUser: async (id: string) => null,
  getUserByEmail: async (email: string) => null,
  getUserByAccount: async (providerAccountId: any) => null,
  updateUser: async (data: any) => data,
  deleteUser: async (id: string) => null,
  linkAccount: async (data: any) => data,
  unlinkAccount: async (data: any) => null,
  getSessionAndUser: async (sessionToken: string) => null,
  createSession: async (data: any) => data,
  updateSession: async (data: any) => data,
  deleteSession: async (sessionToken: string) => null,
  createVerificationToken: async (data: any) => data,
  useVerificationToken: async (identifier_token: any) => null,
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: memoryAdapter(),
  session: { strategy: "jwt" as const },
  pages: { signIn: "/login", newUser: "/dashboard" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      allowDangerousEmailAccountLinking: true,
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
