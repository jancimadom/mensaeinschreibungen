"use client";
import React from 'react';
import { useEnroll, EnrollmentData } from '../EnrollContext';
import styles from '../enroll.module.css';

export default function Step3Gemeinde() {
  const { data, updateData, nextStep, prevStep } = useEnroll();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    updateData({ [e.target.name]: e.target.value } as Partial<EnrollmentData>);
  };

  return (
    <div>
      <h2 style={{ fontSize: "1.5rem", color: "var(--primary)", marginBottom: "0.5rem" }}>Antrag auf Schulausspeisung</h2>
      <p style={{ marginBottom: "1.5rem", color: "var(--text-muted)" }}>
        Diese Daten werden für die offizielle Anmeldung bei der Stadtgemeinde Bruneck benötigt.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Geboren am (Geburtsdatum) *</label>
            <input 
              type="date" 
              name="birthDate"
              className={styles.input} 
              value={data.birthDate} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>in (Geburtsort/-gemeinde) *</label>
            <input 
              type="text" 
              name="birthPlace"
              className={styles.input} 
              value={data.birthPlace} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Steuernummer des Kindes *</label>
          <input 
            type="text" 
            name="taxCode"
            className={styles.input} 
            value={data.taxCode} 
            onChange={(e) => updateData({ taxCode: e.target.value.toUpperCase() })} 
            required 
            maxLength={16}
            placeholder="Zu finden auf der Gesundheitskarte"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Vollständige Adresse (PLZ, Ort, Straße, Hausnummer) *</label>
          <input 
            type="text" 
            name="address"
            className={styles.input} 
            value={data.address} 
            onChange={handleChange} 
            required 
            placeholder="z.B. 39031 Bruneck, Rathausplatz 1"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Telefonnummer Erziehungsberechtigte/r *</label>
          <input 
            type="tel" 
            name="phone"
            className={styles.input} 
            value={data.phone} 
            onChange={handleChange} 
            required 
            placeholder="+39 3XX XXXXXXX"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Spezielle Diätanforderungen</label>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
            (Nur bei Vorlage eines medizinisch begründeten ärztlichen Zeugnisses, ausgestellt vom Hausarzt oder Kinderarzt, berücksichtigt)
          </p>
          <textarea 
            name="dietaryNeeds"
            className={styles.input} 
            value={data.dietaryNeeds} 
            onChange={handleChange} 
            rows={2}
            placeholder="Falls vorhanden, hier eintragen. Ansonsten leer lassen."
            style={{ resize: "vertical" }}
          />
        </div>

        <div className={styles.buttonGroup}>
          <button type="button" className={styles.btn} onClick={prevStep}>
            Zurück
          </button>
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
            Weiter zur Zusammenfassung
          </button>
        </div>
      </form>
    </div>
  );
}
