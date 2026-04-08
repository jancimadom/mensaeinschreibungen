import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Mensaeinschreibungen <br/> <span className={styles.accent}>2026/27</span></h1>
        <p className={styles.subtitle}>
          Willkommen zur Online-Anmeldung für die Schulausspeisung der Stadtgemeinde Bruneck. 
          Bitte halten Sie die Steuernummer und die Daten Ihres Kindes bereit.
        </p>
        
        <div className={styles.card}>
          <h2>Ablauf der Anmeldung</h2>
          <ol className={styles.steps}>
            <li><strong>Verifizierung:</strong> Bestätigen Sie Ihre E-Mail-Adresse.</li>
            <li><strong>Schülerdaten:</strong> Geben Sie die Daten Ihres Kindes ein.</li>
            <li><strong>Tage wählen:</strong> Mensa oder Verlassen der Schule.</li>
            <li><strong>Mensa-Anmeldung:</strong> Ausfüllen des Gemeindeformulars.</li>
          </ol>
          <Link href="/enroll" className={styles.ctaButton}>
            Jetzt Anmeldung starten
          </Link>
        </div>
      </div>
    </div>
  );
}
