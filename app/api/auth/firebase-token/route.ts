import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { adminAuth } from "@/lib/firebase-admin";

// Diese Route generiert immer einen frischen Firebase Custom Token,
// da gespeicherte Tokens nach 1 Stunde ablaufen.
export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const firebaseToken = await adminAuth.createCustomToken(session.user.email);
    return NextResponse.json({ firebaseToken });
  } catch (err) {
    console.error("[firebase-token] Failed to create custom token:", err);
    return NextResponse.json({ error: "Failed to create Firebase token" }, { status: 500 });
  }
}
