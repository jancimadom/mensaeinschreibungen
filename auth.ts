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
          "jan.cimadom@sspbruneck1.it",
          "erika.innerbichler@sspbruneck1.it",
        ];
        
        const whitelist = [...envAdmins, ...codeAdmins];

        console.log(`[Auth] Sign-in attempt: ${email}, Whitelist:`, whitelist);

        // Wenn die Whitelist leer ist, lassen wir vorerst alle der Domain durch (als Schutz vor versehentlichem Aussperren).
        // Sobald E-Mails definiert sind, wird streng geprüft.
        if (whitelist.length > 0) {
          const isAllowed = whitelist.includes(email.toLowerCase());
          if (!isAllowed) {
            console.warn(`[Auth] Access denied for ${email}. Not in whitelist.`);
          }
          return isAllowed;
        }

        return true;
      }
      return false;
    },
  }
})
