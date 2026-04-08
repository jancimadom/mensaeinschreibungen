"use client";
import React, { useState } from 'react';
import { useEnroll } from '../EnrollContext';
import styles from '../enroll.module.css';

export default function Step0Verify() {
  const { data, updateData, nextStep } = useEnroll();
  const [emailInput, setEmailInput] = useState(data.email);
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    setError('');
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput })
      });
      // Wenn wir keine echte Datenbank/Backend laufen haben (für die Vorschau), können wir mocken
      // Wir machen hier ein faires Fallback für Frontend-Demonstrationszwecke.
      if (!res.ok) {
        console.warn("Backend API not reachable yet. Falling back to mock.");
        setTimeout(() => {
          setIsLoading(false);
          setStep('code');
        }, 1000);
        return;
      }
      setIsLoading(false);
      setStep('code');
    } catch (err) {
       console.warn("Backend API not reachable. Falling back to mock.");
       setTimeout(() => {
         setIsLoading(false);
         setStep('code');
       }, 500);
    }
  };

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // In Produktion würde man hier den Code mit dem Backend via Backend-Code verifizieren.
    // Für das Frontend-Setup simulieren wir '1234' bzw übernehmen jede Eingabe temporär.
    setTimeout(() => {
      setIsLoading(false);
      if (code.length === 4) { // Dummy Validierung
        updateData({ email: emailInput, isVerified: true });
        nextStep();
      } else {
        setError("Bitte geben Sie einen 4-stelligen Code ein.");
      }
    }, 1000);
  };

  return (
    <div>
      <h2 style={{ fontSize: "1.5rem", color: "var(--primary)", marginBottom: "0.5rem" }}>E-Mail-Verifizierung</h2>
      <p style={{ marginBottom: "1.5rem", color: "var(--text-muted)" }}>
        Um mit der Anmeldung zu beginnen, müssen wir Ihre E-Mail-Adresse verifizieren. 
        Sie erhalten einen 4-stelligen Code zugesendet.
      </p>

      {step === 'email' ? (
        <form onSubmit={sendCode}>
          <div className={styles.formGroup}>
            <label className={styles.label}>E-Mail-Adresse</label>
            <input 
              type="email" 
              className={styles.input} 
              value={emailInput} 
              onChange={e => setEmailInput(e.target.value)} 
              required 
              placeholder="z.B. max.mustermann@beispiel.com"
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.buttonGroup} style={{ justifyContent: "flex-end" }}>
            <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={isLoading}>
              {isLoading ? "Wird gesendet..." : "Code anfordern"}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={verifyCode}>
          <div className={styles.successPanel}>
            Code wurde an <strong>{emailInput}</strong> gesendet.
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Bestätigungscode (4-stellig)</label>
            <input 
              type="text" 
              className={styles.input} 
              value={code} 
              onChange={e => setCode(e.target.value)} 
              required 
              maxLength={4}
              placeholder="1234"
              style={{ fontSize: "1.5rem", letterSpacing: "0.25rem", textAlign: "center" }}
            />
            <p style={{fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.5rem", textAlign: "center"}}>*Für den Demo-Zweck wird aktuell jeder 4-stellige Code akzeptiert.</p>
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.buttonGroup}>
            <button type="button" className={styles.btn} onClick={() => setStep('email')} disabled={isLoading}>
              Zurück
            </button>
            <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={isLoading || code.length !== 4}>
              {isLoading ? "Prüfung..." : "Verifizieren"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
