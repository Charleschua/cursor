import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Force Node.js runtime (not Edge)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Debug: Log env var status (not values for security)
console.log("NEXTAUTH_SECRET exists:", !!process.env.NEXTAUTH_SECRET);
console.log("GOOGLE_CLIENT_ID exists:", !!process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET exists:", !!process.env.GOOGLE_CLIENT_SECRET);
console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
  debug: true,
});

export { handler as GET, handler as POST };
