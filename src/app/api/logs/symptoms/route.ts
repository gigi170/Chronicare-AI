import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { symptoms } from '@/db/schema';
import { getUserId } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, severity, duration, notes, date } = body;

    if (!name || severity === undefined) {
      return NextResponse.json({ error: 'Name and severity are required' }, { status: 400 });
    }

    const [newSymptom] = await db.insert(symptoms).values({
      userId,
      name,
      severity,
      duration,
      notes,
      date: date ? new Date(date) : new Date(),
    }).returning();

    return NextResponse.json(newSymptom, { status: 201 });
  } catch (error) {
    console.error('Symptom log error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userSymptoms = await db.query.symptoms.findMany({
      where: (symptoms, { eq }) => eq(symptoms.userId, userId),
      orderBy: (symptoms, { desc }) => [desc(symptoms.date)],
    });

    return NextResponse.json(userSymptoms);
  } catch (error) {
    console.error('Symptom fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
