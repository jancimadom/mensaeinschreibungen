import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { sendMail } from '@/lib/mail';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "dummy") {
      await addDoc(collection(db, 'enrollments'), {
        ...data,
        createdAt: serverTimestamp(),
      });
    }

    const emailHtml = `
      <div style="font-family: sans-serif; color: #333;">
        <h2>Neue Mensa-Anmeldung 2026/27</h2>
        <p><strong>Schüler:</strong> ${data.firstName} ${data.lastName} (${data.grade}. Klasse, Zug ${data.zug})</p>
        <p><strong>E-Mail (Eltern):</strong> ${data.email}</p>
        
        <h3>Tage & Optionen</h3>
        <p>Dienstag: ${data.tuesdayOption}</p>
        <p>Donnerstag: ${data.thursdayOption}</p>
        
        <h3>Gemeindefeld (Persönliche Daten)</h3>
        <p><strong>Geboren:</strong> ${data.birthDate} in ${data.birthPlace}</p>
        <p><strong>Steuernummer:</strong> ${data.taxCode}</p>
        <p><strong>Adresse:</strong> ${data.address}</p>
        <p><strong>Telefon:</strong> ${data.phone}</p>
        
        <h3>Spezielles</h3>
        <p>${data.dietaryNeeds || "Keine besonderen Diätanforderungen"}</p>
      </div>
    `;

    // Mail an die Gemeinde / Erika Innerbichler
    await sendMail(
      "erika.innerbichler@schule.suedtirol.it", 
      `Mensa ANMELDUNG - ${data.lastName} ${data.firstName}`, 
      "Neue Anmeldung erhalten", 
      emailHtml
    );
    
    // Bestätigung an die Eltern
    await sendMail(
      data.email, 
      `Bestätigung Mensaanmeldung - ${data.firstName} ${data.lastName}`, 
      "Ihre Anmeldung wurde übermittelt.", 
      `<p>Ihre Daten wurden erfolgreich an die Gemeinde Bruneck übermittelt.</p>` + emailHtml
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
