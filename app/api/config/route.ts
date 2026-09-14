import { NextResponse } from 'next/server';
import { getConfig } from '@/lib/global-config';
import { setConfig } from '@/lib/global-config-write';
import { isAuthenticated } from '@/lib/auth';
import { AppConfig } from '@/lib/types';

export async function GET() {
  const config = await getConfig();
  return NextResponse.json(config);
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const config: AppConfig = await request.json();

  if (!Array.isArray(config?.enabledTypes) || config.enabledTypes.length === 0) {
    return NextResponse.json(
      { error: 'Tiene que quedar al menos un tipo de dato habilitado' },
      { status: 400 }
    );
  }

  await setConfig(config);
  return NextResponse.json({ ok: true });
}
