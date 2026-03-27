import { NextResponse } from 'next/server';
import { getAccurateAatmanirbharScores } from '@/lib/ascore';

export async function GET() {
  try {
    const data = await getAccurateAatmanirbharScores();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch Aatmanirbhar data' }, { status: 500 });
  }
}
