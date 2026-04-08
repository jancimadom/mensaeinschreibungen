import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider(),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        // Zugang nur für @sspbruneck1.it Accounts erlauben
        return profile?.email?.endsWith("@sspbruneck1.it") ?? false;
      }
      return false;
    },
  }
})
