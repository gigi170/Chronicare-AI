import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { medications } from '@/db/schema';
import { getUserId } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { medName, dosage, timing, notes, date } = body;

    if (!medName) {
      return NextResponse.json({ error: 'Medication name is required' }, { status: 400 });
    }

    const [newMed] = await db.insert(medications).values({
      userId,
      medName,
      dosage,
      timing,
      notes,
      date: date ? new Date(date) : new Date(),
    }).returning();

    return NextResponse.json(newMed, { status: 201 });
  } catch (error) {
    console.error('Medication log error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userMeds = await db.query.medications.findMany({
      where: (medications, { eq }) => eq(medications.userId, userId),
      orderBy: (medications, { desc }) => [desc(medications.date)],
    });

    return NextResponse.json(userMeds);
  } catch (error) {
    console.error('Medication fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
