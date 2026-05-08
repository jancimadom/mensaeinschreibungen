import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { adminDb, adminAuth } from "@/lib/firebase-admin";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        const email = profile?.email;
        if (!email) return false;

        // 1. Domain prüfen
        const isAllowedDomain = email.endsWith("@sspbruneck1.it");
        if (!isAllowedDomain) return false;

        // 2. Statische Whitelist
        const envAdmins = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase()) : [];
        const codeAdmins: string[] = [
          "jan.cimadom@sspbruneck1.it",
          "erika.innerbichler@sspbruneck1.it",
        ];
        const staticWhitelist = [...envAdmins, ...codeAdmins];

        console.log(`[Auth] Sign-in attempt: ${email}`);

        if (staticWhitelist.includes(email.toLowerCase())) {
          return true;
        }

        // 3. Firestore Whitelist (über Admin SDK — sicher, umgeht Regeln)
        try {
          const snapshot = await adminDb
            .collection("admins")
            .where("email", "==", email.toLowerCase())
            .get();
          if (!snapshot.empty) {
            console.log(`[Auth] User ${email} found in Firestore admins.`);
            return true;
          }
        } catch (dbError) {
          console.error("[Auth] Error checking Firestore admins:", dbError);
        }

        console.warn(`[Auth] Access denied for ${email}. Not in any whitelist.`);
        return false;
      }
      return false;
    },

    async jwt({ token, account, profile }) {
      // Beim ersten Login: Firebase Custom Token generieren und im JWT speichern
      if (account?.provider === "google" && profile?.email) {
        try {
          const firebaseToken = await adminAuth.createCustomToken(profile.email);
          token.firebaseToken = firebaseToken;
        } catch (err) {
          console.error("[Auth] Failed to create Firebase custom token:", err);
        }
      }
      // Bei jedem JWT-Refresh: bestehenden Firebase Token weiterführen
      // (ohne das geht er bei Session-Erneuerungen verloren)
      return token;
    },

    async session({ session, token }) {
      // Firebase Token an die Client-Session weitergeben
      if (token.firebaseToken) {
        (session as any).firebaseToken = token.firebaseToken;
      }
      return session;
    },
  }
})
