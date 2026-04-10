import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

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

        // 1. Zuerst die Domain prüfen
        const isAllowedDomain = email.endsWith("@sspbruneck1.it");
        if (!isAllowedDomain) return false;

        // 2. Whitelist Prüfung (Statisch & Env)
        const envAdmins = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase()) : [];
        const codeAdmins: string[] = [
          "jan.cimadom@sspbruneck1.it",
          "erika.innerbichler@sspbruneck1.it",
        ];
        
        const staticWhitelist = [...envAdmins, ...codeAdmins];

        console.log(`[Auth] Sign-in attempt: ${email}`);

        // Wenn in statischer Whitelist, direkt durchlassen
        if (staticWhitelist.includes(email.toLowerCase())) {
          return true;
        }

        // 3. Firestore Whitelist Prüfung (Dynamisch)
        try {
          const q = query(collection(db, 'admins'), where('email', '==', email.toLowerCase()));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
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
  }
})
