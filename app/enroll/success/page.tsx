import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div style={{ textAlign: "center", padding: "4rem 2rem", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎉</div>
      <h1 style={{ color: "var(--primary)", fontSize: "2rem", marginBottom: "1rem" }}>Anmeldung erfolgreich!</h1>
      <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", marginBottom: "2rem", lineHeight: "1.6" }}>
        Ihre Einschreibung für die Schulausspeisung wurde erfolgreich an die Gemeinde Bruneck übermittelt. 
        Sie und die Schule erhalten in Kürze eine Zusammenfassung per E-Mail.
      </p>
      <Link href="/" style={{
        display: "inline-block",
        padding: "0.75rem 1.5rem",
        backgroundColor: "var(--primary)",
        color: "white",
        borderRadius: "8px",
        fontWeight: "bold",
        textDecoration: "none",
        transition: "background-color 0.2s"
      }}>
        Zurück zur Startseite
      </Link>
    </div>
  );
}
