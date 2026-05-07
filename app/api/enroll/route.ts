import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { sendMail } from '@/lib/mail';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Always save to Firestore if configured
    if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      await adminDb.collection('enrollments').add({
        ...data,
        createdAt: FieldValue.serverTimestamp(),
      });
    }

    // Date Format from YYYY-MM-DD to DD.MM.YYYY
    let formattedBirthDate = data.birthDate;
    if (formattedBirthDate && formattedBirthDate.includes("-")) {
      const parts = formattedBirthDate.split("-");
      if (parts.length === 3) {
        formattedBirthDate = `${parts[2]}.${parts[1]}.${parts[0]}`;
      }
    }

        const getOptionLabel = (val: string) => {
          switch (val) {
            case "mensa": return "Mensa (Arma)";
            case "brotmensa": return "Brotmensa";
            case "heim": return "Verlassen der Schule in Eigenverantwortung";
            default: return val;
          }
        };

        const emailHtml = `
          <div style="font-family: sans-serif; color: #333;">
            <h2>Neue Mensa-Anmeldung 2026/27</h2>
            <p><strong>Schüler:</strong> ${data.firstName} ${data.lastName} (${data.grade}. Klasse, Zug ${data.zug})</p>
            <p><strong>E-Mail (Eltern):</strong> ${data.email}</p>
            
            <h3>Tage & Optionen</h3>
            <p>Dienstag: ${getOptionLabel(data.tuesdayOption)}</p>
            <p>Donnerstag: ${getOptionLabel(data.thursdayOption)}</p>
        
        ${data.tuesdayOption === "mensa" || data.thursdayOption === "mensa" ? `
        <h3>Gemeindefeld (Persönliche Daten)</h3>
        <p><strong>Geboren:</strong> ${formattedBirthDate} in ${data.birthPlace}</p>
        <p><strong>Steuernummer Kind:</strong> ${data.taxCode}</p>
        <p><strong>Steuernummer Elternteil (erhält Rechnung):</strong> ${data.parentTaxCode || '-'}</p>
        <p><strong>Adresse:</strong> ${data.address}</p>
        <p><strong>Telefon:</strong> ${data.phone}</p>
        ` : '<p><i>Keine Mensa-Tage ausgewählt (Gemeindedaten übersprungen)</i></p>'}
        
        <h3>Spezielles</h3>
        <p>${data.dietaryNeeds || "Keine besonderen Diätanforderungen"}</p>
      </div>
    `;

    const attachments = [];
    if (data.medicalCertificate?.base64) {
      const encodedStr = data.medicalCertificate.base64.split(',')[1] || data.medicalCertificate.base64;
      attachments.push({
        filename: data.medicalCertificate.name || 'aerztliches_zeugnis',
        content: encodedStr,
        encoding: 'base64',
      });
    }

    // Mail an die Schule
    await sendMail(
      "erika.innerbichler@schule.suedtirol.it", 
      `Mensa ANMELDUNG - ${data.lastName} ${data.firstName}`, 
      "Neue Anmeldung erhalten", 
      emailHtml,
      attachments
    );
    
    // Bestätigung an die Eltern
    await sendMail(
      data.email, 
      `Bestätigung Mensaanmeldung - ${data.firstName} ${data.lastName}`, 
      "Ihre Anmeldung wurde übermittelt.", 
      `<p>Ihre Daten wurden erfolgreich an die Schule übermittelt.</p>` + emailHtml
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
