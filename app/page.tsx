import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Meldung Mittagspause <br/> <span className={styles.accent}>2026/27</span></h1>
        
        <div className={styles.card}>
          <h2>Ablauf der Anmeldung</h2>
          <ol className={styles.steps}>
            <li><strong>Verifizierung:</strong> Bestätigen Sie Ihre E-Mail-Adresse.</li>
            <li><strong>Schülerdaten:</strong> Geben Sie die Daten Ihres Kindes ein.</li>
            <li><strong>Tage wählen:</strong> Mensa, Brotmensa (nur 1. Klassen) oder Verlassen der Schule</li>
          </ol>
          <Link href="/enroll" className={styles.ctaButton}>
            Jetzt Anmeldung starten
          </Link>
        </div>
      </div>
    </div>
  );
}
