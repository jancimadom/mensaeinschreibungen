'use client';

import { useRouter } from 'next/navigation';

export default function KontaktPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ maxWidth: '800px', width: '100%', backgroundColor: 'white', borderRadius: '2rem', padding: '3rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', border: '1px solid #f3f4f6' }}>
        <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 900, letterSpacing: '-0.05em', color: '#111827', margin: 0 }}>Kontakt</h1>
            <p style={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.5rem' }}>Anfragen & Support</p>
          </div>
          <button 
            onClick={() => router.back()}
            style={{ padding: '0.5rem 1rem', borderRadius: '9999px', backgroundColor: '#f3f4f6', border: 'none', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', cursor: 'pointer' }}
          >
            Zurück
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          <div style={{ padding: '2.5rem', backgroundColor: '#f9fafb', borderRadius: '2.5rem', border: '1px solid #f3f4f6', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.5rem' }}>
            <div style={{ width: '4rem', height: '4rem', borderRadius: '1.5rem', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </div>
            <div>
              <h2 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#3b82f6', marginBottom: '0.5rem' }}>E-Mail</h2>
              <span style={{ fontSize: '2rem', fontWeight: 900, color: '#111827', letterSpacing: '-0.02em' }}>jan@gimole.com</span>
            </div>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', maxWidth: '400px', lineHeight: 1.6 }}>
              Für technische Fragen oder bei Problemen wenden Sie sich bitte an den technischen Support.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1.5rem', backgroundColor: 'white', borderRadius: '1.5rem', border: '1px solid #f3f4f6' }}>
              <h3 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6b7280', marginBottom: '0.5rem' }}>Standort</h3>
              <p style={{ fontWeight: 700, margin: 0 }}>Bruneck, Italien</p>
            </div>
            <div style={{ padding: '1.5rem', backgroundColor: 'white', borderRadius: '1.5rem', border: '1px solid #f3f4f6' }}>
              <h3 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6b7280', marginBottom: '0.5rem' }}>Verfügbarkeit</h3>
              <p style={{ fontWeight: 700, margin: 0 }}>Technischer Support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
