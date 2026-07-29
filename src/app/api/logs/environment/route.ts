import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { environment } from '@/db/schema';
import { getUserId } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { factor, value, notes, date } = body;

    if (!factor || !value) {
      return NextResponse.json({ error: 'Factor and value are required' }, { status: 400 });
    }

    const [newEnv] = await db.insert(environment).values({
      userId,
      factor,
      value,
      notes,
      date: date ? new Date(date) : new Date(),
    }).returning();

    return NextResponse.json(newEnv, { status: 201 });
  } catch (error) {
    console.error('Environment log error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userEnv = await db.query.environment.findMany({
      where: (environment, { eq }) => eq(environment.userId, userId),
      orderBy: (environment, { desc }) => [desc(environment.date)],
    });

    return NextResponse.json(userEnv);
  } catch (error) {
    console.error('Environment fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
