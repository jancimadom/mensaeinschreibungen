"use client";
import React, { useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { X, Save } from 'lucide-react';
import { EnrollmentDoc } from './EnrollmentList';

interface EditEnrollmentModalProps {
  enrollment: EnrollmentDoc;
  onClose: () => void;
}

export default function EditEnrollmentModal({ enrollment, onClose }: EditEnrollmentModalProps) {
  const [formData, setFormData] = useState<EnrollmentDoc>({ ...enrollment });
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { id, ...updateData } = formData;
      const ref = doc(db, 'enrollments', id);
      await updateDoc(ref, updateData);
      alert("Daten erfolgreich aktualisiert.");
      onClose();
    } catch (err) {
      console.error("Update Error:", err);
      alert("Fehler beim Speichern der Daten.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "1rem"
    }}>
      <div style={{
        backgroundColor: "white",
        borderRadius: "16px",
        width: "100%",
        maxWidth: "800px",
        maxHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}>
        {/* Header */}
        <div style={{
          padding: "1.5rem",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <h3 style={{ margin: 0, fontSize: "1.25rem", color: "var(--primary)" }}>Ansuchen bearbeiten</h3>
          <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", color: "#64748b" }}>
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <form id="edit-enrollment-form" onSubmit={handleSubmit} style={{
          padding: "1.5rem",
          overflowY: "auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem"
        }}>
          {/* Persöhnliche Daten */}
          <div style={{ gridColumn: "1 / -1" }}>
            <h4 style={{ margin: "0 0 1rem 0", color: "#64748b", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>Persönliche Daten Schüler</h4>
          </div>
          
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Vorname</label>
            <input required name="firstName" value={formData.firstName} onChange={handleChange} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Nachname</label>
            <input required name="lastName" value={formData.lastName} onChange={handleChange} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
          </div>
          
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Geburtsdatum</label>
            <input type="date" required name="birthDate" value={formData.birthDate} onChange={handleChange} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Geburtsort</label>
            <input required name="birthPlace" value={formData.birthPlace} onChange={handleChange} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Steuernummer (Kind)</label>
            <input required name="taxCode" value={formData.taxCode} onChange={handleChange} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Steuernummer (Elternteil)</label>
            <input name="parentTaxCode" value={formData.parentTaxCode || ''} onChange={handleChange} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
          </div>

          <div style={{ gridColumn: "1 / -1", marginTop: "1rem" }}>
            <h4 style={{ margin: "0 0 1rem 0", color: "#64748b", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>Kontakt & Schule</h4>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.5rem" }}>E-Mail Adresse</label>
            <input required type="email" name="email" value={formData.email} onChange={handleChange} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Telefonnummer</label>
            <input required name="phone" value={formData.phone} onChange={handleChange} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Wohnadresse</label>
            <input required name="address" value={formData.address} onChange={handleChange} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Klasse (1, 2, 3)</label>
            <select name="grade" value={formData.grade} onChange={handleChange} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
              <option value="1">1. Klasse</option>
              <option value="2">2. Klasse</option>
              <option value="3">3. Klasse</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Zug (A, B, C, ...)</label>
            <input required name="zug" value={formData.zug} onChange={handleChange} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
          </div>

          <div style={{ gridColumn: "1 / -1", marginTop: "1rem" }}>
            <h4 style={{ margin: "0 0 1rem 0", color: "#64748b", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>Mensa Optionen</h4>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Dienstag</label>
            <select name="tuesdayOption" value={formData.tuesdayOption} onChange={handleChange} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
              <option value="mensa">Mensa (Arma)</option>
              <option value="brotmensa">Brotmensa</option>
              <option value="heim">Eigenverantwortlich nach Hause</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Donnerstag</label>
            <select name="thursdayOption" value={formData.thursdayOption} onChange={handleChange} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
              <option value="mensa">Mensa (Arma)</option>
              <option value="brotmensa">Brotmensa</option>
              <option value="heim">Eigenverantwortlich nach Hause</option>
            </select>
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Besondere Bedürfnisse / Allergien</label>
            <textarea name="dietaryNeeds" value={formData.dietaryNeeds || ''} onChange={handleChange} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #cbd5e1", minHeight: "80px" }} />
          </div>
        </form>

        {/* Footer */}
        <div style={{
          padding: "1.5rem",
          borderTop: "1px solid #e2e8f0",
          display: "flex",
          justifyContent: "flex-end",
          gap: "1rem"
        }}>
          <button onClick={onClose} style={{
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
            backgroundColor: "white",
            cursor: "pointer"
          }}>
            Abbrechen
          </button>
          <button 
            form="edit-enrollment-form"
            type="submit" 
            disabled={saving}
            style={{
              padding: "0.5rem 1.5rem",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "var(--primary)",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}
          >
            {saving ? "Wird gespeichert..." : <><Save size={18} /> Speichern</>}
          </button>
        </div>
      </div>
    </div>
  );
}
