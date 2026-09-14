import { NextResponse } from 'next/server';
import { getItems } from '@/lib/global-config';
import { setItems } from '@/lib/global-config-write';
import { isAuthenticated } from '@/lib/auth';
import { Item } from '@/lib/types';

export async function GET() {
  const items = await getItems();
  return NextResponse.json(items);
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const items: Item[] = await request.json();

  if (!Array.isArray(items)) {
    return NextResponse.json({ error: 'Formato inválido' }, { status: 400 });
  }

  await setItems(items);
  return NextResponse.json({ ok: true });
}
