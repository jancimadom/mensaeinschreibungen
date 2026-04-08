"use client";
import React from 'react';
import { useEnroll } from './EnrollContext';
import styles from './enroll.module.css';

// Form Steps
import Step0Verify from './components/Step0Verify';
import Step1Student from './components/Step1Student';
import Step2Options from './components/Step2Options';
import Step3Gemeinde from './components/Step3Gemeinde';
import Step4Summary from './components/Step4Summary';

const steps = [
  "Verifizierung",
  "Schülerdaten",
  "Tage wählen",
  "Mensa Antrag",
  "Abschluss"
];

export default function FormContainer() {
  const { step } = useEnroll();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Progress Indicator */}
        <div className={styles.stepIndicator}>
          {steps.map((label, index) => (
            <div 
              key={index} 
              className={`${styles.stepItem} ${index === step ? styles.active : ''} ${index < step ? styles.completed : ''}`}
            >
              <span style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{index < step ? "✓" : index + 1}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* Render Step Content */}
        {step === 0 && <Step0Verify />}
        {step === 1 && <Step1Student />}
        {step === 2 && <Step2Options />}
        {step === 3 && <Step3Gemeinde />}
        {step === 4 && <Step4Summary />}
      </div>
    </div>
  );
}
