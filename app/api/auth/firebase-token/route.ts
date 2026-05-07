import { NextResponse } from "next/server";
import { auth } from "@/auth";

// Diese Route gibt den Firebase Custom Token aus der Session zurück,
// damit der Client sich damit bei Firebase Auth anmelden kann.
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const firebaseToken = (session as any).firebaseToken;
  if (!firebaseToken) {
    return NextResponse.json({ error: "No Firebase token in session" }, { status: 500 });
  }
  return NextResponse.json({ firebaseToken });
}
