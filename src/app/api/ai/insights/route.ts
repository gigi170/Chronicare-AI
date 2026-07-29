import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { symptoms, diet, environment, medications } from '@/db/schema';
import { getUserId } from '@/lib/auth';
import OpenAI from 'openai';
import { and, gte, eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [userSymptoms, userDiet, userEnv, userMeds] = await Promise.all([
      db.query.symptoms.findMany({
        where: (s, { and, gte }) => and(eq(s.userId, userId), gte(s.date, thirtyDaysAgo)),
      }),
      db.query.diet.findMany({
        where: (d, { and, gte }) => and(eq(d.userId, userId), gte(d.date, thirtyDaysAgo)),
      }),
      db.query.environment.findMany({
        where: (e, { and, gte }) => and(eq(e.userId, userId), gte(e.date, thirtyDaysAgo)),
      }),
      db.query.medications.findMany({
        where: (m, { and, gte }) => and(eq(m.userId, userId), gte(m.date, thirtyDaysAgo)),
      }),
    ]);

    const data = {
      symptoms: userSymptoms,
      diet: userDiet,
      environment: userEnv,
      medications: userMeds,
    };

    const prompt = `
      You are a medical data analyst assistant. Analyze the following 30-day health log for a user managing a chronic condition.
      Identify the top 3 correlations between diet/environment and symptom spikes.
      Provide a confidence score (0-100%) for each insight and a human-readable explanation.
      
      Data:
      ${JSON.stringify(data, null, 2)}
      
      Respond strictly in JSON format:
      {
        "insights": [
          {
            "correlation": "Description of correlation",
            "confidence": 85,
            "explanation": "Detailed explanation based on data"
          }
        ],
        "summary": "Overall summary of the month"
      }
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: 'You are a medical data analyst. You return JSON.' }, { role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const result = response.choices[0].message.content;
    return NextResponse.json(JSON.parse(result || '{}'));
  } catch (error) {
    console.error('AI insights error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
