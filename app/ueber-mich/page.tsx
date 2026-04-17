'use client';

import { useRouter } from 'next/navigation';

export default function UeberMichPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ maxWidth: '800px', width: '100%', backgroundColor: 'white', borderRadius: '2rem', padding: '3rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', border: '1px solid #f3f4f6' }}>
        <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 900, letterSpacing: '-0.05em', color: '#111827', margin: 0 }}>Über mich</h1>
            <p style={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.5rem' }}>Das Projekt & Der Entwickler</p>
          </div>
          <button 
            onClick={() => router.back()}
            style={{ padding: '0.5rem 1rem', borderRadius: '9999px', backgroundColor: '#f3f4f6', border: 'none', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', cursor: 'pointer' }}
          >
            Zurück
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div style={{ padding: '2rem', backgroundColor: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111827', marginBottom: '1rem', letterSpacing: '-0.02em' }}>Projekt-Vision</h2>
            <p style={{ fontSize: '0.875rem', color: '#4b5563', lineHeight: 1.7, margin: 0 }}>
              Diese Web-Plattform wurde entwickelt, um moderne, digitale Werkzeuge für Bildungseinrichtungen bereitzustellen.
            </p>
          </div>

          <div style={{ padding: '2rem', background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', borderRadius: '2rem', border: '1px solid #bfdbfe' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1e3a8a', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Jan Cimadom</h2>
            <p style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#3b82f6', marginBottom: '1.5rem' }}>Entwickler</p>
            <p style={{ fontSize: '0.875rem', color: '#1e40af', lineHeight: 1.7, margin: 0 }}>
              Als privater technischer Dienstleister spezialisiere ich mich auf die Entwicklung maßgeschneiderter Softwarelösungen.
            </p>
          </div>
        </div>

        <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#9ca3af' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Gimole Solutions Bruneck</span>
          </div>
        </div>
      </div>
    </div>
  );
}
