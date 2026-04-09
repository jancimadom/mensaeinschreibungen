"use client";
import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, Timestamp } from 'firebase/firestore';
import ExportModal from './ExportModal';

export type EnrollmentDoc = {
  id: string;
  firstName: string;
  lastName: string;
  grade: string;
  zug: string;
  tuesdayOption: string;
  thursdayOption: string;
  createdAt?: Timestamp;
};

export default function EnrollmentList() {
  const [enrollments, setEnrollments] = useState<EnrollmentDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Entferne orderBy, um Index-Fehler in Firestore zu vermeiden.
      const q = query(collection(db, 'enrollments'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as EnrollmentDoc[];
        
        // Lokales Sortieren nach Datum absteigend (neueste zuerst)
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

  if (loading) {
    return <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>Lade Ansuchen...</div>;
  }

  if (error) {
    return <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>{error}</div>;
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.95rem" }}>
        <thead>
          <tr style={{ backgroundColor: "var(--secondary)", borderBottom: "2px solid var(--border)" }}>
            <th style={{ padding: "1rem" }}>Nachname</th>
            <th style={{ padding: "1rem" }}>Vorname</th>
            <th style={{ padding: "1rem" }}>Klasse</th>
            <th style={{ padding: "1rem" }}>Dienstag</th>
            <th style={{ padding: "1rem" }}>Donnerstag</th>
            <th style={{ padding: "1rem" }}>Datum</th>
          </tr>
        </thead>
        <tbody>
          {enrollments.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ padding: "3rem", textAlign: "center", fontStyle: "italic", color: "var(--text-muted)", backgroundColor: "#f8fafc" }}>
                Noch keine Anmeldungen vorhanden.
              </td>
            </tr>
          ) : (
            enrollments.map(enroll => (
              <tr key={enroll.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "1rem" }}>{enroll.lastName}</td>
                <td style={{ padding: "1rem" }}>{enroll.firstName}</td>
                <td style={{ padding: "1rem" }}>{enroll.grade}{enroll.zug}</td>
                <td style={{ padding: "1rem" }}>{enroll.tuesdayOption}</td>
                <td style={{ padding: "1rem" }}>{enroll.thursdayOption}</td>
                <td style={{ padding: "1rem" }}>{enroll.createdAt?.toDate ? enroll.createdAt.toDate().toLocaleDateString('de-DE') : '-'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div style={{ marginTop: "2rem", display: "flex", justifyContent: "flex-end" }}>
        <ExportModal enrollments={enrollments} />
      </div>
    </div>
  );
}
