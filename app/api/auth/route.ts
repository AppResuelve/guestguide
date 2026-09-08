import { NextResponse } from 'next/server';
import { checkPassword, createSession, destroySession } from '@/lib/auth';

export async function POST(request: Request) {
  const { password } = await request.json();

  if (!checkPassword(password)) {
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
  }

  await createSession();
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await destroySession();
  return NextResponse.json({ ok: true });
}
