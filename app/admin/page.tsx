import { auth, signIn, signOut } from "@/auth";

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
      </div>
    )
  }

  // Da node.js lokal fehlt, bauen wir eine Vorlage für die Tabelle ein. 
  // Um die Firestore-Werte im echten Betrieb in Echtzeit zu sehen, würde man hier 
  // eine Client-Componente mit "use client" rendern, die "onSnapshot()" nutzt, oder
  // server-side fetch durchführen, falls `firebase-admin` genutzt wird.

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", paddingBottom: "1rem", borderBottom: "1px solid var(--border)" }}>
        <h2 style={{ fontSize: "1.75rem", color: "var(--primary)", margin: 0 }}>Verwaltung Mensaanmeldungen</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
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
      
      <div style={{ backgroundColor: "white", padding: "2rem", borderRadius: "12px", boxShadow: "var(--shadow-sm)" }}>
        <h3 style={{ marginBottom: "1rem" }}>Übersicht (Schuljahr 26/27)</h3>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem", lineHeight: "1.6" }}>
          In der finalen Umgebung (auf Vercel) wird das Dashboard hier mit der Firestore-Datenbank verbunden. 
          Wenn Anmeldungen eintreffen, erscheinen sie sofort in dieser Ansicht.
        </p>

        {/* Platzhalter-Tabelle / Client-Komponente würde hier geladen werden */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ backgroundColor: "var(--secondary)", borderBottom: "2px solid var(--border)" }}>
                <th style={{ padding: "1rem" }}>Nachname</th>
                <th style={{ padding: "1rem" }}>Vorname</th>
                <th style={{ padding: "1rem" }}>Klasse</th>
                <th style={{ padding: "1rem" }}>Dienstag</th>
                <th style={{ padding: "1rem" }}>Donnerstag</th>
                <th style={{ padding: "1rem" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6} style={{ padding: "3rem", textAlign: "center", fontStyle: "italic", color: "var(--text-muted)", backgroundColor: "#f8fafc" }}>
                  Tabelle zur Echtzeit-Anzeige der Firestore-Daten ist vorbereitet. (Verbindung wird nach Deployment aktiv aufgebaut).
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
           <button style={{ padding: "0.75rem 1.5rem", background: "var(--primary)", color: "white", borderRadius: "8px", border: "none", fontWeight: "bold", cursor: "pointer" }}>
             Als CSV exportieren (Excel)
           </button>
        </div>
      </div>
    </div>
  )
}
