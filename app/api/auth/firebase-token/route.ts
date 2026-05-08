import { NextResponse } from "next/server";
import { auth } from "@/auth";

// Lazy import damit der Fehler nicht beim Start wirft, wenn die Env-Var fehlt
let adminAuthInstance: any = null;
async function getAdminAuth() {
  if (adminAuthInstance) return adminAuthInstance;
  try {
    const { adminAuth } = await import("@/lib/firebase-admin");
    adminAuthInstance = adminAuth;
    return adminAuthInstance;
  } catch (e) {
    return null;
  }
}

// Gibt einen Firebase Custom Token zurück.
// Strategie: Zuerst frisch via Admin SDK generieren (bevorzugt).
// Fallback: Token aus der JWT-Session verwenden (falls Admin SDK nicht verfügbar).
export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Versuch 1: Frischen Token via Admin SDK generieren
  try {
    const adminAuth = await getAdminAuth();
    if (adminAuth) {
      const firebaseToken = await adminAuth.createCustomToken(session.user.email);
      return NextResponse.json({ firebaseToken });
    }
  } catch (err: any) {
    console.error("[firebase-token] Admin SDK createCustomToken failed:", err.message);
  }

  // Fallback: Token aus der Session nehmen (gesetzt beim Login in auth.ts)
  const sessionToken = (session as any).firebaseToken;
  if (sessionToken) {
    console.warn("[firebase-token] Falling back to session token (Admin SDK unavailable).");
    return NextResponse.json({ firebaseToken: sessionToken });
  }

  // Diagnose-Hilfe im Log
  console.error("[firebase-token] Kein Token verfügbar. Prüfe:", {
    hasServiceAccount: !!process.env.FIREBASE_SERVICE_ACCOUNT_JSON,
    userEmail: session.user.email,
  });

  return NextResponse.json(
    { error: "Firebase-Token konnte nicht erstellt werden. Ist FIREBASE_SERVICE_ACCOUNT_JSON in Vercel gesetzt?" },
    { status: 500 }
  );
}
