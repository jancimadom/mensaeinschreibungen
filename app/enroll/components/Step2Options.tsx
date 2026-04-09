"use client";
import React from 'react';
import { useEnroll } from '../EnrollContext';
import styles from '../enroll.module.css';

export default function Step2Options() {
  const { data, updateData, nextStep, prevStep, setStep } = useEnroll();

  const isFirstGrade = data.grade === "1";

    ? [
        { label: "Mensa (Arma)", value: "mensa" },
        { label: "Brotmensa (nur 1. Klassen)", value: "brotmensa" },
        { label: "Verlassen der Schule in Eigenverantwortung", value: "heim" },
      ]
    : [
        { label: "Mensa (Arma)", value: "mensa" },
        { label: "Verlassen der Schule in Eigenverantwortung", value: "heim" },
      ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.tuesdayOption !== "mensa" && data.thursdayOption !== "mensa") {
      setStep(4);
    } else {
      nextStep();
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: "1.5rem", color: "var(--primary)", marginBottom: "0.5rem" }}>
        {isFirstGrade ? "Tage wählen: 1. Klasse" : `Tage wählen: ${data.grade ? data.grade + '. Klasse' : ''}`}
      </h2>
      <p style={{ marginBottom: "1.5rem", color: "var(--text-muted)" }}>
        Die Schulausspeisung wird ausschließlich am Dienstag und am Donnerstag angeboten. Bitte wählen Sie für jeden Tag eine Option.
      </p>

      <div style={{ marginBottom: "2rem", padding: "1rem", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "0.9rem", color: "#334155" }}>
        <h3 style={{ marginTop: 0, color: "var(--primary)", fontSize: "1.1rem" }}>Informationen zur Schulausspeisung Mittelschule Röd - Schuljahr 2026/27</h3>
        <ol style={{ paddingLeft: "1.2rem", margin: "0.5rem 0 0 0", display: "flex", flexDirection: "column", gap: "0.5rem", wordBreak: "break-word" }}>
          <li>In den Mittelschulen können nur jene Schüler/Schülerinnen den Schulausspeisungsdienst beanspruchen, welche am Nachmittag einer schulischen Tätigkeit nachgehen. Die Schulausspeisung wird ausschließlich am Dienstag und am Donnerstag angeboten.</li>
          <li>Der Antrag ist in der Mittelschule „Dr. Josef Röd“ bis spätestens 22. Mai 2026 einzureichen.</li>
          <li>Das Mittagessen besteht aus einer warmen Hauptspeise mit Gemüse und/oder Salat sowie einer Nachspeise in Form von Obst. Die Stadtgemeinde Bruneck ist bemüht, den Kindern ein gesundes, abwechslungsreiches und frisches Essen anzubieten.<br/>Der Menüplan wird auf folgender Internetseite veröffentlicht: <strong>https://www.gemeinde.bruneck.bz.it/de/Verwaltung/Gemeindeaemter/Bekanntmachungen/Schulausspeisung</strong> (Änderungen vorbehalten).<br/>Spezielle Diätanforderungen werden nur bei Vorlage eines medizinisch, wissenschaftlich fundierten ärztlichen Zeugnisses, ausgestellt vom Hausarzt oder Kinderarzt, berücksichtigt.</li>
          <li>Die Kosten pro Mittagessen für die Schüler betragen 4,50 €. Es besteht die Möglichkeit, eine Tarifreduzierung zu beantragen. Die weiteren Informationen dazu werden im Herbst mitgeteilt.</li>
          <li>Für die Schulausspeisung wird ein Fixbetrag pro Schuljahr in Rechnung gestellt, kurzfristige Abwesenheiten können demzufolge nicht berücksichtigt werden. Herbst- und Maiausflug sowie andere freie Tage werden nicht berechnet. Im Schuljahr 2026/27 werden circa 35 Dienstage und 35 Donnerstage berechnet.</li>
          <li>Die Berechnung der Kosten nimmt die Dienststelle Steuern und Gebühren der Stadtgemeinde Bruneck vor. Der Beitrag wird einmal im Schuljahr eingehoben. Die Rechnungsstellung erfolgt im Frühjahr 2027.</li>
          <li>Anmeldungen und Abmeldungen zur Schulausspeisung sind an die Stadtgemeinde Bruneck, Dienststelle Steuern und Gebühren, zu richten. Für Abmeldungen nach dem 1. Oktober 2026 wird eine Bearbeitungsgebühr von 20,00 € verrechnet.</li>
        </ol>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "2rem" }}>
          
          {/* DIENSTAG */}
          <div className={styles.formGroup} style={{ marginBottom: "1.5rem", padding: "1.5rem", backgroundColor: "var(--secondary)", border: "1px solid var(--border)", borderRadius: "8px" }}>
            <label className={styles.label} style={{ fontSize: "1.1rem" }}>Dienstag *</label>
            <div className={styles.radioGroup}>
              {options.map((opt) => (
                <label key={`tue-${opt.value}`} className={styles.radioLabel}>
                  <input 
                    type="radio" 
                    name="tuesdayOption" 
                    value={opt.value} 
                    checked={data.tuesdayOption === opt.value}
                    onChange={(e) => updateData({ tuesdayOption: e.target.value })}
                    required
                  />
                  <span style={{ marginLeft: "0.5rem" }}>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* DONNERSTAG */}
          <div className={styles.formGroup} style={{ padding: "1.5rem", backgroundColor: "var(--secondary)", border: "1px solid var(--border)", borderRadius: "8px" }}>
            <label className={styles.label} style={{ fontSize: "1.1rem" }}>Donnerstag *</label>
            <div className={styles.radioGroup}>
              {options.map((opt) => (
                <label key={`thu-${opt.value}`} className={styles.radioLabel}>
                  <input 
                    type="radio" 
                    name="thursdayOption" 
                    value={opt.value} 
                    checked={data.thursdayOption === opt.value}
                    onChange={(e) => updateData({ thursdayOption: e.target.value })}
                    required
                  />
                  <span style={{ marginLeft: "0.5rem" }}>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

        </div>

        <div className={styles.buttonGroup}>
          <button type="button" className={styles.btn} onClick={prevStep}>
            Zurück
          </button>
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
            Weiter zur Mensa-Anmeldung
          </button>
        </div>
      </form>
    </div>
  );
}
