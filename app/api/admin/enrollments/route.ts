import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { adminDb } from '@/lib/firebase-admin';

// GET: alle Enrollments lesen
export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const snapshot = await adminDb.collection('enrollments').orderBy('createdAt', 'desc').get();
    const enrollments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Firestore Timestamp -> ISO string für JSON-Serialisierung
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() ?? null,
    }));
    return NextResponse.json({ enrollments });
  } catch (err: any) {
    console.error('[admin/enrollments GET]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH: Enrollment aktualisieren (z.B. archived-Status)
export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    await adminDb.collection('enrollments').doc(id).update(updates);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[admin/enrollments PATCH]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE: Enrollment löschen
export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    await adminDb.collection('enrollments').doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[admin/enrollments DELETE]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
