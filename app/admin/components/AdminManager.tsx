"use client";
import React, { useState, useEffect } from 'react';
import { Trash2, UserPlus, ShieldCheck, Mail, Loader2, AlertCircle } from 'lucide-react';

type Admin = {
  id: string;
  email: string;
};

export default function AdminManager() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admins');
      if (!res.ok) throw new Error('Fehler beim Laden der Admins');
      const data = await res.json();
      setAdmins(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newEmail.includes('@')) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Fehler beim Hinzufügen');
      }

      setNewEmail('');
      fetchAdmins();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAdmin = async (id: string, email: string) => {
    if (!window.confirm(`Möchten Sie ${email} wirklich als Admin entfernen?`)) return;

    try {
      const res = await fetch('/api/admins', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error('Fehler beim Löschen');
      fetchAdmins();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
        <Loader2 className="animate-spin" size={32} color="var(--primary)" />
      </div>
    );
  }

  const superAdmins = [
    "jan.cimadom@sspbruneck1.it",
    "erika.innerbichler@sspbruneck1.it"
  ];

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 0, marginBottom: '1rem', color: 'var(--primary)' }}>
          <UserPlus size={20} /> Administrator hinzufügen
        </h3>
        <form onSubmit={handleAddAdmin} style={{ display: 'flex', gap: '0.5rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Mail style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
            <input
              type="email"
              placeholder="name@sspbruneck1.it"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.95rem'
              }}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              opacity: isSubmitting ? 0.7 : 1
            }}
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : null}
            Hinzufügen
          </button>
        </form>
        {error && (
          <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#fef2f2', color: '#b91c1c', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}
      </div>

      <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f5f9', textAlign: 'left', fontSize: '0.9rem' }}>
              <th style={{ padding: '1rem' }}>E-Mail Adresse</th>
              <th style={{ padding: '1rem' }}>Rolle / Status</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {/* Super Admins (Failsafe) */}
            {superAdmins.map((email) => (
              <tr key={email} style={{ borderTop: '1px solid #f1f5f9', backgroundColor: '#fffbeb' }}>
                <td style={{ padding: '1rem', fontWeight: '500' }}>{email}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.6rem', backgroundColor: '#fef3c7', color: '#92400e', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: '600', border: '1px solid #fde68a' }}>
                    <ShieldCheck size={14} /> Super Admin
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>System-Admin</span>
                </td>
              </tr>
            ))}

            {/* Dynamische Admins */}
            {admins.length === 0 && superAdmins.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: '#64748b', fontStyle: 'italic' }}>
                  Keine Admins gefunden.
                </td>
              </tr>
            ) : (
              admins.map((admin) => (
                <tr key={admin.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem' }}>{admin.email}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.6rem', backgroundColor: '#f0fdf4', color: '#16a34a', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: '500' }}>
                      <ShieldCheck size={14} /> Aktiv
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button
                      onClick={() => handleDeleteAdmin(admin.id, admin.email)}
                      style={{ padding: '0.5rem', color: '#ef4444', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '6px' }}
                      title="Entfernen"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <AlertCircle size={14} /> Super Admins sind fest im System verankert und können nicht über dieses UI gelöscht werden.
      </div>
    </div>
  );
}
