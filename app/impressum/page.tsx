'use client';

import { useRouter } from 'next/navigation';

export default function ImpressumPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ maxWidth: '800px', width: '100%', backgroundColor: 'white', borderRadius: '2rem', padding: '3rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', border: '1px solid #f3f4f6' }}>
        <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 900, letterSpacing: '-0.05em', color: '#111827', margin: 0 }}>Impressum</h1>
            <p style={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.5rem' }}>Gesetzliche Angaben</p>
          </div>
          <button 
            onClick={() => router.back()}
            style={{ padding: '0.5rem 1rem', borderRadius: '9999px', backgroundColor: '#f3f4f6', border: 'none', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            Zurück
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#3b82f6' }}>Verantwortlich</h2>
              <p style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', lineHeight: 1.5, marginTop: '0.5rem' }}>
                Schulsprengel Bruneck I<br />
                Josef-Ferrari-Straße 14<br />
                39031 Bruneck (BZ)<br />
                Italien
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#ec4899' }}>Steuerdaten</h2>
              <p style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', marginTop: '0.5rem' }}>
                Steuernummer: 92022390212
              </p>
            </div>
          </div>

          <div>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#f59e0b' }}>Kontakt</h2>
              <p style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', marginTop: '0.5rem' }}>
                E-Mail: jan@gimole.com<br />
                PEC: SSP.Bruneck1@pec.prov.bz.it<br />
                Schulführungskraft: Stefan Keim
              </p>
            </div>

            <div style={{ padding: '1.5rem', backgroundColor: '#f9fafb', borderRadius: '1rem', border: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#10b981' }}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>
                <h3 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#111827', margin: 0 }}>Technische Umsetzung</h3>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', lineHeight: 1.5, margin: 0 }}>
                Verantwortlich für die technische Umsetzung: Jan Cimadom.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
