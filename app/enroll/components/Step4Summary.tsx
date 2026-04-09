"use client";
import React, { useState } from 'react';
import { useEnroll } from '../EnrollContext';
import styles from '../enroll.module.css';
import { useRouter } from 'next/navigation';

export default function Step4Summary() {
  const { data, prevStep, setStep } = useEnroll();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const isMensaSelected = data.tuesdayOption === "mensa" || data.thursdayOption === "mensa";

  const getOptionLabel = (val: string) => {
    switch (val) {
      case "mensa": return "Mensa (Arma)";
      case "brotmensa": return "Brotmensa (Essen von zu Hause)";
      case "heim": return "Verlassen der Schule";
      default: return "-";
    }
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
         const errorData = await response.json().catch(() => ({}));
         console.error("Backend Error:", errorData);
         setError(errorData.error || "Fehler beim Senden. Bitte Server-Logs oder Vercel kontrollieren.");
         setIsSubmitting(false);
         return;
      }
      
      router.push('/enroll/success');

    } catch (err: any) {
      console.error("Fetch Error:", err);
      setError("Verbindung zum Server fehlgeschlagen. " + err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: "1.5rem", color: "var(--primary)", marginBottom: "0.5rem" }}>Zusammenfassung</h2>
      <p style={{ marginBottom: "1.5rem", color: "var(--text-muted)" }}>
        Bitte überprüfen Sie alle Angaben vor der endgültigen Bestätigung und Absendung an die Schule.
      </p>

      <div style={{ backgroundColor: "var(--background)", padding: "1.5rem", borderRadius: "8px", marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem", borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem" }}>Schülerdaten</h3>
        <p style={{ marginBottom: "0.5rem" }}><strong>Name:</strong> {data.firstName} {data.lastName}</p>
        <p style={{ marginBottom: "0.5rem" }}><strong>Klasse:</strong> {data.grade}. Klasse, Zug {data.zug}</p>
        <p style={{ marginBottom: "0.5rem" }}><strong>E-Mail:</strong> {data.email}</p>

        <h3 style={{ fontSize: "1.1rem", marginTop: "1.5rem", marginBottom: "1rem", borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem" }}>Tage & Optionen</h3>
        <p style={{ marginBottom: "0.5rem" }}><strong>Dienstag:</strong> {getOptionLabel(data.tuesdayOption)}</p>
        <p style={{ marginBottom: "0.5rem" }}><strong>Donnerstag:</strong> {getOptionLabel(data.thursdayOption)}</p>

        {isMensaSelected && (
          <>
            <h3 style={{ fontSize: "1.1rem", marginTop: "1.5rem", marginBottom: "1rem", borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem" }}>Gemeindefeld (Mensa)</h3>
            <p style={{ marginBottom: "0.5rem" }}><strong>Geboren:</strong> {data.birthDate ? new Date(data.birthDate).toLocaleDateString('de-DE') : '-'} in {data.birthPlace || '-'}</p>
            <p style={{ marginBottom: "0.5rem" }}><strong>Steuernummer Kind:</strong> {data.taxCode || '-'}</p>
            <p style={{ marginBottom: "0.5rem" }}><strong>Steuernummer Elternteil:</strong> {data.parentTaxCode || '-'}</p>
            <p style={{ marginBottom: "0.5rem" }}><strong>Adresse:</strong> {data.address || '-'}</p>
            <p style={{ marginBottom: "0.5rem" }}><strong>Telefon:</strong> {data.phone || '-'}</p>
            <p style={{ marginBottom: "0.5rem" }}><strong>Diätanforderungen:</strong> {data.dietaryNeeds ? "Ja (siehe unten)" : "Keine"}</p>
            {data.dietaryNeeds && <p style={{ fontStyle: "italic", marginTop: "0.5rem", marginBottom: "0.5rem" }}>"{data.dietaryNeeds}"</p>}
            {data.medicalCertificate && (
              <p style={{ marginBottom: "0.5rem", color: "green", fontSize: "0.9rem" }}>
                ✓ Zeugnis angehängt: {data.medicalCertificate.name}
              </p>
            )}
          </>
        )}
      </div>

      <div style={{ backgroundColor: "#eff6ff", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
        <strong>Datenschutzhinweis gemäß EU-Verordnung 679/2016:</strong><br/>
        Ich bestätige die Datenschutzbestimmungen gelesen zu haben und damit einverstanden zu sein. Im Sinne der Wirkungen der Art. 12, 13 und 14 der EU-Verordnung 679/2016 sind die Datenschutzinformationen unter gemeinde.bruneck.bz.it/de/Verwaltung/Web/Datenschutz einsehbar.
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.buttonGroup}>
        <button type="button" className={styles.btn} onClick={() => isMensaSelected ? prevStep() : setStep(2)} disabled={isSubmitting}>
          Zurück (Bearbeiten)
        </button>
        <button type="button" onClick={submitForm} className={`${styles.btn} ${styles.btnPrimary}`} disabled={isSubmitting}>
          {isSubmitting ? "Wird gesendet..." : "Verbindlich anmelden"}
        </button>
      </div>
    </div>
  );
}
