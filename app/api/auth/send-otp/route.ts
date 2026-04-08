import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { sendMail } from '@/lib/mail';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email missing' }, { status: 400 });

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    
    if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "dummy") {
      await setDoc(doc(db, 'otps', email.toLowerCase()), {
        code,
        createdAt: new Date().toISOString()
      });
    }

    await sendMail(
      email, 
      'Ihr Verifizierungscode für die Mensaanmeldung', 
      `Ihr Code lautet: ${code}`,
      `<p>Ihr Verifizierungscode lautet: <strong style="font-size: 24px; letter-spacing: 2px;">${code}</strong></p>`
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
