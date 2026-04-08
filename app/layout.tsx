import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import styles from "./layout.module.css";

export const metadata: Metadata = {
  title: "Schulanmeldung & Mensa | SSP Bruneck 1",
  description: "Offizielle Online-Anmeldung für die Schulausspeisung der Stadtgemeinde Bruneck für das Schuljahr 2026/27.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>
        <header className={styles.header}>
          <div className={styles.logoContainer}>
            {/* Fallback falls Logo nicht existiert, sonst Next/Image */}
            <h1 className={styles.logoText}>SSP Bruneck 1</h1>
          </div>
          <nav>
            <Link href="/admin" className={styles.adminLink}>
              Admin-Bereich
            </Link>
          </nav>
        </header>
        <main className={styles.main}>
          {children}
        </main>
      </body>
    </html>
  );
}
