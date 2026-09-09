import { NextResponse } from 'next/server';
import { getCategories } from '@/lib/global-config';
import { setCategories } from '@/lib/global-config-write';
import { isAuthenticated } from '@/lib/auth';
import { Category } from '@/lib/types';

export async function GET() {
  const categories = await getCategories();
  return NextResponse.json(categories);
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const categories: Category[] = await request.json();

  if (!Array.isArray(categories)) {
    return NextResponse.json({ error: 'Formato inválido' }, { status: 400 });
  }

  await setCategories(categories);
  return NextResponse.json({ ok: true });
}
