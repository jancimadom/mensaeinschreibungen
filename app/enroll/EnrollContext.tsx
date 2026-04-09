"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

export type EnrollmentData = {
  // Step 0: Verification
  email: string;
  isVerified: boolean;
  
  // Step 1: Student
  lastName: string;
  firstName: string;
  grade: "1" | "2" | "3" | "";
  zug: "A" | "B" | "C" | "D" | "E" | "F" | "G" | "M" | "";
  
  // Step 2: Options
  tuesdayOption: string;
  thursdayOption: string;

  // Step 3: Municipality (Gemeinde)
  birthDate: string;
  birthPlace: string;
  taxCode: string;
  parentTaxCode: string;
  address: string;
  phone: string;
  dietaryNeeds: string;
  medicalCertificate: { name: string, type: string, size: number, base64: string } | null;
};

const defaultData: EnrollmentData = {
  email: "",
  isVerified: false,
  lastName: "",
  firstName: "",
  grade: "",
  zug: "",
  tuesdayOption: "",
  thursdayOption: "",
  birthDate: "",
  birthPlace: "",
  taxCode: "",
  parentTaxCode: "",
  address: "",
  phone: "",
  dietaryNeeds: "",
  medicalCertificate: null,
};

type EnrollContextType = {
  data: EnrollmentData;
  updateData: (fields: Partial<EnrollmentData>) => void;
  step: number;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
};

const EnrollContext = createContext<EnrollContextType | undefined>(undefined);

export function EnrollProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<EnrollmentData>(defaultData);
  const [step, setStep] = useState(0);

  const updateData = (fields: Partial<EnrollmentData>) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => Math.max(0, s - 1));

  return (
    <EnrollContext.Provider value={{ data, updateData, step, setStep, nextStep, prevStep }}>
      {children}
    </EnrollContext.Provider>
  );
}

export function useEnroll() {
  const context = useContext(EnrollContext);
  if (!context) throw new Error("useEnroll must be used within EnrollProvider");
  return context;
}
