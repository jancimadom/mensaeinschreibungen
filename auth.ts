import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

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

        // 2. Whitelist Prüfung
        // Entweder über Vercel Environment Variable (ADMIN_EMAILS="mail1,mail2") oder direkt im Code
        const envAdmins = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase()) : [];
        const codeAdmins: string[] = [
          // "beispiel@sspbruneck1.it", <-- Fügen Sie hier Ihre E-Mail ein falls Sie kein Env nutzen
        ];
        
        const whitelist = [...envAdmins, ...codeAdmins];

        // Wenn die Whitelist leer ist, lassen wir vorerst alle der Domain durch (als Schutz vor versehentlichem Aussperren).
        // Sobald E-Mails definiert sind, wird streng geprüft.
        if (whitelist.length > 0) {
          return whitelist.includes(email.toLowerCase());
        }

        return true;
      }
      return false;
    },
  }
})
