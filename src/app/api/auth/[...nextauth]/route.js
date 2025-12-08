import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabase } from "../../../../lib/supabaseClient";

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        // Check if user already exists in the database
        const { data: existingUser, error: fetchError } = await supabase
          .from("users")
          .select("id")
          .eq("email", user.email)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") {
          // PGRST116 = no rows returned, which is expected for new users
          console.error("Error checking for existing user:", fetchError);
          return true; // Still allow sign in even if check fails
        }

        // If user doesn't exist, create them
        if (!existingUser) {
          const { error: insertError } = await supabase.from("users").insert({
            id: crypto.randomUUID(),
            email: user.email,
            name: user.name,
            image: user.image,
            provider: account.provider,
            provider_account_id: account.providerAccountId,
            created_at: new Date().toISOString(),
          });

          if (insertError) {
            console.error("Error creating user in Supabase:", insertError);
            // Still allow sign in even if insert fails
          }
        }

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return true; // Allow sign in even if there's an error
      }
    },
    async session({ session, token }) {
      // Add user id to session
      session.user.id = token.sub;
      return session;
    },
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
  // Using default NextAuth sign-in page
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };

