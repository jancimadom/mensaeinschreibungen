"use client";
import React, { useState } from 'react';
import * as XLSX from 'xlsx';

type ExportModalProps = {
  enrollments: any[];
};

const ALL_FIELDS = [
  { key: 'lastName', label: 'Nachname' },
  { key: 'firstName', label: 'Vorname' },
  { key: 'grade', label: 'Klasse' },
  { key: 'zug', label: 'Zug' },
  { key: 'tuesdayOption', label: 'Dienstag' },
  { key: 'thursdayOption', label: 'Donnerstag' },
  { key: 'email', label: 'E-Mail (Eltern)' },
  { key: 'birthDate', label: 'Geburtsdatum' },
  { key: 'birthPlace', label: 'Geburtsort' },
  { key: 'taxCode', label: 'Steuernummer Kind' },
  { key: 'parentTaxCode', label: 'Steuernummer Elternteil' },
  { key: 'address', label: 'Adresse' },
  { key: 'phone', label: 'Telefon' },
  { key: 'createdAt', label: 'Eingangsdatum' },
];

export default function ExportModal({ enrollments }: ExportModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFields, setSelectedFields] = useState<Record<string, boolean>>(
    ALL_FIELDS.reduce((acc, field) => ({ ...acc, [field.key]: true }), {})
  );

  const toggleField = (key: string) => {
    setSelectedFields(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const selectAll = (val: boolean) => {
    setSelectedFields(ALL_FIELDS.reduce((acc, field) => ({ ...acc, [field.key]: val }), {}));
  };

  const handleExport = () => {
    // 1. Filter and map data
    const exportData = enrollments.map(enroll => {
      const row: Record<string, string> = {};
      ALL_FIELDS.forEach(field => {
        if (selectedFields[field.key]) {
          let val = enroll[field.key];
          
          if (field.key === 'createdAt' && val?.toDate) {
            val = val.toDate().toLocaleDateString('de-DE');
          }
          row[field.label] = val || '';
        }
      });
      return row;
    });

    // 2. Create Excel File
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ansuchen");

    // 3. Download
    XLSX.writeFile(workbook, `Mensaanmeldungen_2026_27.xlsx`);
    setIsOpen(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        style={{ padding: "0.75rem 1.5rem", background: "var(--primary)", color: "white", borderRadius: "8px", border: "none", fontWeight: "bold", cursor: "pointer" }}
      >
        Als Excel exportieren
      </button>

      {isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '500px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--primary)' }}>Exportfelder auswählen</h3>
            
            <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
              <button type="button" onClick={() => selectAll(true)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}>Alle auswählen</button>
              <button type="button" onClick={() => selectAll(false)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}>Keine auswählen</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto', marginBottom: '2rem' }}>
              {ALL_FIELDS.map(field => (
                <label key={field.key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedFields[field.key]} 
                    onChange={() => toggleField(field.key)} 
                  />
                  <span>{field.label}</span>
                </label>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button 
                onClick={() => setIsOpen(false)}
                style={{ padding: "0.75rem 1.5rem", background: "#e2e8f0", color: "#334155", borderRadius: "8px", border: "none", fontWeight: "bold", cursor: "pointer" }}
              >
                Abbrechen
              </button>
              <button 
                onClick={handleExport}
                style={{ padding: "0.75rem 1.5rem", background: "var(--primary)", color: "white", borderRadius: "8px", border: "none", fontWeight: "bold", cursor: "pointer" }}
                disabled={!Object.values(selectedFields).some(Boolean)}
              >
                Export herunterladen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
