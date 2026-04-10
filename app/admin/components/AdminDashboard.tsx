"use client";
import React, { useState } from 'react';
import EnrollmentList from './EnrollmentList';
import AdminManager from './AdminManager';
import { Users, ListChecks } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'enrollments' | 'admins'>('enrollments');

  return (
    <div style={{ backgroundColor: "white", padding: "2rem", borderRadius: "12px", boxShadow: "var(--shadow-sm)" }}>
      <div style={{ display: "flex", gap: "2rem", borderBottom: "1px solid #e2e8f0", marginBottom: "2rem" }}>
        <button 
          onClick={() => setActiveTab('enrollments')}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: "0.75rem 0.5rem", border: "none", backgroundColor: "transparent", 
            cursor: "pointer", fontSize: "1rem", fontWeight: "600",
            color: activeTab === 'enrollments' ? "var(--primary)" : "#64748b",
            borderBottom: activeTab === 'enrollments' ? "3px solid var(--primary)" : "3px solid transparent",
            transition: "all 0.2s"
          }}
        >
          <ListChecks size={20} /> Anmeldungen
        </button>
        <button 
          onClick={() => setActiveTab('admins')}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: "0.75rem 0.5rem", border: "none", backgroundColor: "transparent", 
            cursor: "pointer", fontSize: "1rem", fontWeight: "600",
            color: activeTab === 'admins' ? "var(--primary)" : "#64748b",
            borderBottom: activeTab === 'admins' ? "3px solid var(--primary)" : "3px solid transparent",
            transition: "all 0.2s"
          }}
        >
          <Users size={20} /> Admin-Verwaltung
        </button>
      </div>

      {activeTab === 'enrollments' ? <EnrollmentList /> : <AdminManager />}
    </div>
  );
}
