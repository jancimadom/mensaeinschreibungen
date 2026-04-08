"use client";
import React from 'react';
import { useEnroll } from '../EnrollContext';
import styles from '../enroll.module.css';

export default function Step2Options() {
  const { data, updateData, nextStep, prevStep } = useEnroll();

  const isFirstGrade = data.grade === "1";

  const options = isFirstGrade 
    ? [
        { label: "Mensa (Arma)", value: "mensa" },
        { label: "Brotmensa (Essen von zu Hause mitgebracht)", value: "brotmensa" },
        { label: "Verlassen der Schule in Eigenverantwortung", value: "heim" },
      ]
    : [
        { label: "Mensa (Arma)", value: "mensa" },
        { label: "Verlassen der Schule in Eigenverantwortung", value: "heim" },
      ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <div>
      <h2 style={{ fontSize: "1.5rem", color: "var(--primary)", marginBottom: "0.5rem" }}>
        {isFirstGrade ? "Tage wählen: 1. Klasse" : `Tage wählen: ${data.grade ? data.grade + '. Klasse' : ''}`}
      </h2>
      <p style={{ marginBottom: "1.5rem", color: "var(--text-muted)" }}>
        Die Schulausspeisung wird ausschließlich am Dienstag und am Donnerstag angeboten. Bitte wählen Sie für jeden Tag eine Option.
      </p>

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
