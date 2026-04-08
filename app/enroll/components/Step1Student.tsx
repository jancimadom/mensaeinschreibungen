"use client";
import React from 'react';
import { useEnroll, EnrollmentData } from '../EnrollContext';
import styles from '../enroll.module.css';

export default function Step1Student() {
  const { data, updateData, nextStep, prevStep } = useEnroll();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    updateData({ [e.target.name]: e.target.value } as Partial<EnrollmentData>);
  };

  return (
    <div>
      <h2 style={{ fontSize: "1.5rem", color: "var(--primary)", marginBottom: "0.5rem" }}>Schülerdaten</h2>
      <p style={{ marginBottom: "1.5rem", color: "var(--text-muted)" }}>
        Bitte geben Sie die Daten des Kindes samt geplanter Klasse und Zug für das Schuljahr 2026/27 ein.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Vorname Schüler*in *</label>
            <input 
              type="text" 
              name="firstName"
              className={styles.input} 
              value={data.firstName} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Nachname Schüler*in *</label>
            <input 
              type="text" 
              name="lastName"
              className={styles.input} 
              value={data.lastName} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Klasse im kommenden Schuljahr *</label>
            <select 
              name="grade"
              className={styles.select}
              value={data.grade}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Bitte wählen...</option>
              <option value="1">1. Klasse</option>
              <option value="2">2. Klasse</option>
              <option value="3">3. Klasse</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Zug (Sektion) *</label>
            <select 
              name="zug"
              className={styles.select}
              value={data.zug}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Bitte wählen...</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="E">E</option>
              <option value="F">F</option>
              <option value="G">G</option>
              <option value="M">M</option>
            </select>
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button type="button" className={styles.btn} onClick={prevStep}>
            Zurück (Szenario ändern)
          </button>
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
            Weiter zu den Optionen
          </button>
        </div>
      </form>
    </div>
  );
}
