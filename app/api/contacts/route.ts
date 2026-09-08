import { NextResponse } from 'next/server';
import { getContacts } from '@/lib/global-config';
import { setContacts } from '@/lib/global-config-write';
import { isAuthenticated } from '@/lib/auth';
import { Contact } from '@/lib/types';

// GET es público: lo usa la landing (aunque la landing también puede leer
// directo con getContacts() en el server component; esta ruta sirve para
// refrescar la lista desde el admin sin recargar la página).
export async function GET() {
  const contacts = await getContacts();
  return NextResponse.json(contacts);
}

// PUT reemplaza la lista completa. Es más simple que armar POST/PATCH/DELETE
// separados para cada contacto: el admin edita todo en memoria y guarda de una.
export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const contacts: Contact[] = await request.json();

  if (!Array.isArray(contacts)) {
    return NextResponse.json({ error: 'Formato inválido' }, { status: 400 });
  }

  await setContacts(contacts);
  return NextResponse.json({ ok: true });
}
