import { auth, signIn, signOut } from "@/auth";
import Link from 'next/link';
import AdminDashboard from "./components/AdminDashboard";

export const metadata = {
  title: "Admin-Bereich | Mensaeinschreibungen",
};

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div style={{ maxWidth: "400px", margin: "4rem auto", padding: "2rem", backgroundColor: "white", borderRadius: "12px", boxShadow: "var(--shadow-md)", textAlign: "center" }}>
        <h2 style={{ color: "var(--primary)", marginBottom: "1rem" }}>Lehrpersonen Login</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem", lineHeight: "1.5" }}>
          Der Zugriff auf diesen Bereich ist auf Lehrkräfte mit einer <strong>@sspbruneck1.it</strong> E-Mailadresse beschränkt.
        </p>
        <form action={async () => {
          "use server"
          await signIn("google")
        }}>
          <button type="submit" style={{ 
            width: "100%", 
            padding: "0.75rem 1.5rem", 
            borderRadius: "8px", 
            backgroundColor: "var(--primary)", 
            color: "white", 
            border: "none", 
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "1rem",
            transition: "background-color 0.2s"
          }}>
            Mit Google anmelden
          </button>
        </form>
        <div style={{ marginTop: "1.5rem" }}>
          <Link href="/" style={{ color: "var(--text-muted)", textDecoration: "underline", fontSize: "0.95rem" }}>
            Zurück zur Startseite
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", paddingBottom: "1rem", borderBottom: "1px solid var(--border)" }}>
        <h2 style={{ fontSize: "1.75rem", color: "var(--primary)", margin: 0 }}>Verwaltung Mensaanmeldungen</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <Link href="/" style={{ padding: "0.5rem 1rem", borderRadius: "8px", backgroundColor: "#f1f5f9", color: "var(--primary)", textDecoration: "none", fontWeight: "600", transition: "background-color 0.2s" }}>
            Zur Startseite
          </Link>
          <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
            Angemeldet als <strong>{session.user.email}</strong>
          </span>
          <form action={async () => {
            "use server"
            await signOut()
          }}>
            <button type="submit" style={{ padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #dc2626", color: "#dc2626", background: "white", cursor: "pointer", fontWeight: "600", transition: "background-color 0.2s" }}>
              Abmelden
            </button>
          </form>
        </div>
      </div>
      
      <AdminDashboard />
    </div>
  )
}
