import { NextResponse } from 'next/server';
import { fetchInterdependency } from '@/lib/gemini';

export async function GET() {
  try {
    const data = await fetchInterdependency();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch interdependency data' }, { status: 500 });
  }
}
