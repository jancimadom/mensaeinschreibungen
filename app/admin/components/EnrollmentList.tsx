"use client";
import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, Timestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Archive, ArchiveRestore, Trash2, Pencil } from 'lucide-react';
import ExportModal from './ExportModal';
import EditEnrollmentModal from './EditEnrollmentModal';

export type EnrollmentDoc = {
  id: string;
  firstName: string;
  lastName: string;
  grade: string;
  zug: string;
  email: string;
  birthDate: string;
  birthPlace: string;
  taxCode: string;
  parentTaxCode?: string;
  address: string;
  phone: string;
  tuesdayOption: string;
  thursdayOption: string;
  dietaryNeeds?: string;
  medicalCertificate?: { name: string; base64: string };
  archived?: boolean;
  createdAt?: Timestamp;
};

export default function EnrollmentList() {
  const [enrollments, setEnrollments] = useState<EnrollmentDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState<EnrollmentDoc | null>(null);

  useEffect(() => {
    try {
      const q = query(collection(db, 'enrollments'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as EnrollmentDoc[];
        
        data.sort((a, b) => {
          const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
          const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
          return timeB - timeA;
        });

        setEnrollments(data);
        setLoading(false);
      }, (err) => {
        console.error("Firestore Error:", err);
        setError("Fehler beim Laden der Daten (" + err.message + ")");
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err: any) {
      console.error(err);
      setError("Fehler beim Init der DB (" + err.message + ")");
      setLoading(false);
    }
  }, []);

  const getOptionLabel = (val: string) => {
    switch (val) {
      case "mensa": return "Mensa (Arma)";
      case "brotmensa": return "Brotmensa";
      case "heim": return "Verlassen der Schule in Eigenverantwortung";
      default: return val;
    }
  };

  const filteredEnrollments = enrollments.filter(e => !!e.archived === showArchived);

  const handleArchiveAll = async () => {
    if (!window.confirm("Möchten Sie wirklich ALLE aktuellen Ansuchen archivieren?")) return;
    const active = enrollments.filter(e => !e.archived);
    for (const en of active) {
      await updateDoc(doc(db, 'enrollments', en.id), { archived: true });
    }
    alert(`${active.length} Ansuchen archiviert.`);
  };

  const handleRestoreAll = async () => {
    if (!window.confirm("Möchten Sie ALLE archivierten Ansuchen wieder herstellen?")) return;
    const archived = enrollments.filter(e => e.archived);
    for (const en of archived) {
      await updateDoc(doc(db, 'enrollments', en.id), { archived: false });
    }
    alert(`${archived.length} Ansuchen wiederhergestellt.`);
  };

  const handleToggleArchive = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'enrollments', id), { archived: !currentStatus });
    } catch (err) {
      console.error("Error toggling archive status:", err);
      alert("Fehler beim Ändern des Archivierungsstatus.");
    }
  };

  const handleDelete = async (id: string, firstName: string, lastName: string) => {
    if (!window.confirm(`Möchten Sie das Ansuchen von ${firstName} ${lastName} wirklich unwiderruflich löschen?`)) return;
    try {
      await deleteDoc(doc(db, 'enrollments', id));
    } catch (err) {
      console.error("Error deleting enrollment:", err);
      alert("Fehler beim Löschen des Ansuchens.");
    }
  };

  if (loading) {
    return <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>Lade Ansuchen...</div>;
  }

  if (error) {
    return <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>{error}</div>;
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", backgroundColor: "#f1f5f9", padding: "0.25rem", borderRadius: "8px" }}>
          <button 
            onClick={() => setShowArchived(false)}
            style={{ 
              padding: "0.5rem 1rem", border: "none", borderRadius: "6px", cursor: "pointer",
              backgroundColor: !showArchived ? "white" : "transparent",
              boxShadow: !showArchived ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              fontWeight: !showArchived ? "bold" : "normal"
            }}
          >
            Aktive Ansuchen
          </button>
          <button 
            onClick={() => setShowArchived(true)}
            style={{ 
              padding: "0.5rem 1rem", border: "none", borderRadius: "6px", cursor: "pointer",
              backgroundColor: showArchived ? "white" : "transparent",
              boxShadow: showArchived ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              fontWeight: showArchived ? "bold" : "normal"
            }}
          >
             Archiv
          </button>
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          {!showArchived ? (
            <button 
              onClick={handleArchiveAll}
              style={{ padding: "0.5rem 1rem", backgroundColor: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}
              disabled={enrollments.filter(e => !e.archived).length === 0}
            >
              Alle archivieren
            </button>
          ) : (
            <button 
              onClick={handleRestoreAll}
              style={{ padding: "0.5rem 1rem", backgroundColor: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}
              disabled={enrollments.filter(e => e.archived).length === 0}
            >
              Alle aus Archiv wiederherstellen
            </button>
          )}
          <ExportModal enrollments={filteredEnrollments} />
        </div>
      </div>

      <div style={{ overflowX: "auto", border: "1px solid var(--border)", borderRadius: "8px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem", whiteSpace: "nowrap" }}>
          <thead>
            <tr style={{ backgroundColor: "var(--secondary)", borderBottom: "2px solid var(--border)" }}>
              <th style={{ padding: "0.75rem" }}>Schüler</th>
              <th style={{ padding: "0.75rem" }}>E-Mail</th>
              <th style={{ padding: "0.75rem" }}>Klasse</th>
              <th style={{ padding: "0.75rem" }}>Dienstag</th>
              <th style={{ padding: "0.75rem" }}>Donnerstag</th>
              <th style={{ padding: "0.75rem" }}>Geboren</th>
              <th style={{ padding: "0.75rem" }}>Steuernummer (K)</th>
              <th style={{ padding: "0.75rem" }}>Steuernummer (E)</th>
              <th style={{ padding: "0.75rem" }}>Adresse/Tel</th>
              <th style={{ padding: "0.75rem" }}>Besonderes</th>
              <th style={{ padding: "0.75rem" }}>Datum</th>
              <th style={{ padding: "0.75rem", textAlign: "center" }}>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {filteredEnrollments.length === 0 ? (
              <tr>
                <td colSpan={11} style={{ padding: "3rem", textAlign: "center", fontStyle: "italic", color: "var(--text-muted)", backgroundColor: "#f8fafc" }}>
                  Keine Einträge {showArchived ? "im Archiv" : ""} vorhanden.
                </td>
              </tr>
            ) : (
              filteredEnrollments.map(enroll => (
                <tr key={enroll.id} style={{ borderBottom: "1px solid var(--border)", backgroundColor: enroll.archived ? "#f8fafc" : "white" }}>
                  <td style={{ padding: "0.75rem" }}>
                    <strong>{enroll.lastName}</strong>, {enroll.firstName}<br/>
                    <small style={{ color: "var(--text-muted)" }}>{enroll.birthPlace}</small>
                  </td>
                  <td style={{ padding: "0.75rem" }}>{enroll.email}</td>
                  <td style={{ padding: "0.75rem" }}>{enroll.grade}{enroll.zug}</td>
                  <td style={{ padding: "0.75rem" }}>{getOptionLabel(enroll.tuesdayOption)}</td>
                  <td style={{ padding: "0.75rem" }}>{getOptionLabel(enroll.thursdayOption)}</td>
                  <td style={{ padding: "0.75rem" }}>{enroll.birthDate ? new Date(enroll.birthDate).toLocaleDateString('de-DE') : '-'}</td>
                  <td style={{ padding: "0.75rem" }}>{enroll.taxCode}</td>
                  <td style={{ padding: "0.75rem" }}>{enroll.parentTaxCode || '-'}</td>
                  <td style={{ padding: "0.75rem" }}>
                    {enroll.address}<br/>
                    <small>{enroll.phone}</small>
                  </td>
                  <td style={{ padding: "0.75rem", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {enroll.dietaryNeeds || "-"}
                    {enroll.medicalCertificate && (
                      <div style={{ color: "green", fontSize: "0.75rem", marginTop: "0.25rem" }}>✓ Zeugnis</div>
                    )}
                  </td>
                  <td style={{ padding: "0.75rem" }}>{enroll.createdAt?.toDate ? enroll.createdAt.toDate().toLocaleDateString('de-DE') : '-'}</td>
                  <td style={{ padding: "0.75rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                      <button
                        onClick={() => setEditingEnrollment(enroll)}
                        title="Bearbeiten"
                        style={{
                          padding: "0.4rem",
                          borderRadius: "4px",
                          border: "1px solid #e2e8f0",
                          backgroundColor: "white",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          color: "#2563eb"
                        }}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleToggleArchive(enroll.id, !!enroll.archived)}
                        title={enroll.archived ? "Wiederherstellen" : "Archivieren"}
                        style={{
                          padding: "0.4rem",
                          borderRadius: "4px",
                          border: "1px solid #e2e8f0",
                          backgroundColor: "white",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          color: "var(--primary)"
                        }}
                      >
                        {enroll.archived ? <ArchiveRestore size={16} /> : <Archive size={16} />}
                      </button>
                      <button
                        onClick={() => handleDelete(enroll.id, enroll.firstName, enroll.lastName)}
                        title="Löschen"
                        style={{
                          padding: "0.4rem",
                          borderRadius: "4px",
                          border: "1px solid #fecaca",
                          backgroundColor: "#fef2f2",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          color: "#dc2626"
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editingEnrollment && (
        <EditEnrollmentModal 
          enrollment={editingEnrollment} 
          onClose={() => setEditingEnrollment(null)} 
        />
      )}
    </div>
  );
}
