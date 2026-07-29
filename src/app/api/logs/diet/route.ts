import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { diet } from '@/db/schema';
import { getUserId } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { food, ingredients, timing, notes, date } = body;

    if (!food) {
      return NextResponse.json({ error: 'Food is required' }, { status: 400 });
    }

    const [newDiet] = await db.insert(diet).values({
      userId,
      food,
      ingredients,
      timing,
      notes,
      date: date ? new Date(date) : new Date(),
    }).returning();

    return NextResponse.json(newDiet, { status: 201 });
  } catch (error) {
    console.error('Diet log error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userDiet = await db.query.diet.findMany({
      where: (diet, { eq }) => eq(diet.userId, userId),
      orderBy: (diet, { desc }) => [desc(diet.date)],
    });

    return NextResponse.json(userDiet);
  } catch (error) {
    console.error('Diet fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
