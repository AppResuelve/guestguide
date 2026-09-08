import { cookies } from 'next/headers';
import crypto from 'crypto';

// Auth mínima: una sola contraseña (env var ADMIN_PASSWORD), sin usuarios
// ni tabla de sesiones. La cookie guarda un hash derivado de la contraseña,
// así que solo es válida mientras ADMIN_PASSWORD no cambie.

const COOKIE_NAME = 'admin_session';

function getSessionToken(): string {
  const secret = process.env.ADMIN_PASSWORD ?? '';
  return crypto.createHmac('sha256', secret).update('sesion-valida').digest('hex');
}

export function checkPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return password === expected;
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return token === getSessionToken();
}

export async function createSession() {
  const store = await cookies();
  store.set(COOKIE_NAME, getSessionToken(), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
