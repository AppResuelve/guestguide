import { NextResponse } from 'next/server';
import { getTheme } from '@/lib/edge-config';
import { setTheme } from '@/lib/edge-config-write';
import { isAuthenticated } from '@/lib/auth';
import { Theme } from '@/lib/types';

export async function GET() {
  const theme = await getTheme();
  return NextResponse.json(theme);
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const theme: Theme = await request.json();
  await setTheme(theme);
  return NextResponse.json({ ok: true });
}
