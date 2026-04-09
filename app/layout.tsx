import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import styles from "./layout.module.css";
import { Footer } from "../components/Footer";

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
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <header className={styles.header}>
          <div className={styles.logoContainer} style={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src="https://www.sspbruneck1.it/wp-content/uploads/sites/101/2023/11/Logo-SSP-Bruneck-1.webp" 
              alt="SSP Bruneck Logo" 
              style={{ maxHeight: '60px', width: 'auto' }}
            />
          </div>
          <nav>
            <Link href="/admin" className={styles.adminLink}>
              Admin-Bereich
            </Link>
          </nav>
        </header>
        <main className={styles.main} style={{ flexGrow: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
