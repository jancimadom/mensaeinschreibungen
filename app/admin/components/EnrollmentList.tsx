"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { Archive, ArchiveRestore, Trash2, Pencil, Search, ArrowUpDown, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';
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
  createdAt?: string; // ISO string aus der API
};

export default function EnrollmentList() {
  const [enrollments, setEnrollments] = useState<EnrollmentDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState<EnrollmentDoc | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'name' | 'date'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const loadEnrollments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/enrollments');
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(`Fehler beim Laden (HTTP ${res.status}): ${body.error || 'Unbekannter Fehler'}`);
        return;
      }
      const { enrollments: data } = await res.json();
      setEnrollments(data);
    } catch (err: any) {
      setError('Netzwerkfehler: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEnrollments();
  }, [loadEnrollments]);

  const apiPatch = async (id: string, updates: Record<string, any>) => {
    const res = await fetch('/api/admin/enrollments', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    });
    if (!res.ok) throw new Error((await res.json()).error || 'PATCH fehlgeschlagen');
  };

  const apiDelete = async (id: string) => {
    const res = await fetch('/api/admin/enrollments', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) throw new Error((await res.json()).error || 'DELETE fehlgeschlagen');
  };

  const getOptionLabel = (val: string) => {
    switch (val) {
      case "mensa": return "Mensa (Arma)";
      case "brotmensa": return "Brotmensa";
      case "heim": return "Verlassen der Schule in Eigenverantwortung";
      default: return val;
    }
  };

  const handleSort = (field: 'name' | 'date') => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredEnrollments = enrollments
    .filter(e => !!e.archived === showArchived)
    .filter(e => {
      const search = searchTerm.toLowerCase();
      return e.firstName.toLowerCase().includes(search) ||
             e.lastName.toLowerCase().includes(search) ||
             e.email.toLowerCase().includes(search) ||
             (e.grade + e.zug).toLowerCase().includes(search);
    })
    .sort((a, b) => {
      if (sortField === 'name') {
        const nameA = `${a.lastName} ${a.firstName}`.toLowerCase();
        const nameB = `${b.lastName} ${b.firstName}`.toLowerCase();
        return sortDirection === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
      } else {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return sortDirection === 'asc' ? timeA - timeB : timeB - timeA;
      }
    });

  const handleArchiveAll = async () => {
    if (!window.confirm("Möchten Sie wirklich ALLE aktuellen Ansuchen archivieren?")) return;
    const active = enrollments.filter(e => !e.archived);
    for (const en of active) {
      await apiPatch(en.id, { archived: true });
    }
    alert(`${active.length} Ansuchen archiviert.`);
    loadEnrollments();
  };

  const handleRestoreAll = async () => {
    if (!window.confirm("Möchten Sie ALLE archivierten Ansuchen wieder herstellen?")) return;
    const archived = enrollments.filter(e => e.archived);
    for (const en of archived) {
      await apiPatch(en.id, { archived: false });
    }
    alert(`${archived.length} Ansuchen wiederhergestellt.`);
    loadEnrollments();
  };

  const handleToggleArchive = async (id: string, currentStatus: boolean) => {
    try {
      await apiPatch(id, { archived: !currentStatus });
      setEnrollments(prev => prev.map(e => e.id === id ? { ...e, archived: !currentStatus } : e));
    } catch (err: any) {
      alert("Fehler beim Ändern des Archivierungsstatus: " + err.message);
    }
  };

  const handleDelete = async (id: string, firstName: string, lastName: string) => {
    if (!window.confirm(`Möchten Sie das Ansuchen von ${firstName} ${lastName} wirklich unwiderruflich löschen?`)) return;
    try {
      await apiDelete(id);
      setEnrollments(prev => prev.filter(e => e.id !== id));
    } catch (err: any) {
      alert("Fehler beim Löschen: " + err.message);
    }
  };

  if (loading) {
    return <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>Lade Ansuchen...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
        <button
          onClick={loadEnrollments}
          style={{ padding: "0.5rem 1.5rem", borderRadius: "8px", backgroundColor: "var(--primary)", color: "white", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
        >
          <RefreshCw size={16} /> Erneut versuchen
        </button>
      </div>
    );
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

        <div style={{ position: "relative", flex: "1", maxWidth: "400px" }}>
          <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
          <input
            type="text"
            placeholder="Schüler, E-Mail oder Klasse suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "0.6rem 1rem 0.6rem 2.5rem",
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              fontSize: "0.9rem",
              outline: "none",
              transition: "border-color 0.2s, box-shadow 0.2s"
            }}
          />
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
          <button
            onClick={loadEnrollments}
            title="Neu laden"
            style={{ padding: "0.5rem", backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", color: "#64748b" }}
          >
            <RefreshCw size={16} />
          </button>
          <ExportModal enrollments={filteredEnrollments} />
        </div>
      </div>

      <div style={{ overflowX: "auto", border: "1px solid var(--border)", borderRadius: "8px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem", whiteSpace: "nowrap" }}>
          <thead>
            <tr style={{ backgroundColor: "var(--secondary)", borderBottom: "2px solid var(--border)" }}>
              <th
                onClick={() => handleSort('name')}
                style={{ padding: "0.75rem", cursor: "pointer", userSelect: "none" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  Schüler
                  {sortField === 'name' ? (sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />) : <ArrowUpDown size={14} style={{ opacity: 0.3 }} />}
                </div>
              </th>
              <th style={{ padding: "0.75rem" }}>E-Mail</th>
              <th style={{ padding: "0.75rem" }}>Klasse</th>
              <th style={{ padding: "0.75rem" }}>Dienstag</th>
              <th style={{ padding: "0.75rem" }}>Donnerstag</th>
              <th style={{ padding: "0.75rem" }}>Geboren</th>
              <th style={{ padding: "0.75rem" }}>Steuernummer (K)</th>
              <th style={{ padding: "0.75rem" }}>Steuernummer (E)</th>
              <th style={{ padding: "0.75rem" }}>Adresse/Tel</th>
              <th style={{ padding: "0.75rem" }}>Besonderes</th>
              <th
                onClick={() => handleSort('date')}
                style={{ padding: "0.75rem", cursor: "pointer", userSelect: "none" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  Datum
                  {sortField === 'date' ? (sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />) : <ArrowUpDown size={14} style={{ opacity: 0.3 }} />}
                </div>
              </th>
              <th style={{ padding: "0.75rem", textAlign: "center" }}>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {filteredEnrollments.length === 0 ? (
              <tr>
                <td colSpan={12} style={{ padding: "3rem", textAlign: "center", fontStyle: "italic", color: "var(--text-muted)", backgroundColor: "#f8fafc" }}>
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
                  <td style={{ padding: "0.75rem" }}>
                    {enroll.createdAt ? new Date(enroll.createdAt).toLocaleDateString('de-DE') : '-'}
                  </td>
                  <td style={{ padding: "0.75rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                      <button
                        onClick={() => setEditingEnrollment(enroll)}
                        title="Bearbeiten"
                        style={{
                          padding: "0.4rem", borderRadius: "4px", border: "1px solid #e2e8f0",
                          backgroundColor: "white", cursor: "pointer", display: "flex", alignItems: "center", color: "#2563eb"
                        }}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleToggleArchive(enroll.id, !!enroll.archived)}
                        title={enroll.archived ? "Wiederherstellen" : "Archivieren"}
                        style={{
                          padding: "0.4rem", borderRadius: "4px", border: "1px solid #e2e8f0",
                          backgroundColor: "white", cursor: "pointer", display: "flex", alignItems: "center", color: "var(--primary)"
                        }}
                      >
                        {enroll.archived ? <ArchiveRestore size={16} /> : <Archive size={16} />}
                      </button>
                      <button
                        onClick={() => handleDelete(enroll.id, enroll.firstName, enroll.lastName)}
                        title="Löschen"
                        style={{
                          padding: "0.4rem", borderRadius: "4px", border: "1px solid #fecaca",
                          backgroundColor: "#fef2f2", cursor: "pointer", display: "flex", alignItems: "center", color: "#dc2626"
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
          onClose={() => { setEditingEnrollment(null); loadEnrollments(); }}
        />
      )}
    </div>
  );
}
