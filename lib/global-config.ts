import { get } from '@vercel/global-config';
import { Contact, Theme, DEFAULT_THEME } from './types';

// Lecturas: usan el SDK de @vercel/global-config, que lee vía la connection
// string (env var GLOBAL_CONFIG, con fallback a la vieja EDGE_CONFIG) directo
// desde el edge. Es lo que lee la landing pública en cada visita.

export async function getContacts(): Promise<Contact[]> {
  if (!process.env.GLOBAL_CONFIG && !process.env.EDGE_CONFIG) return [];
  const contacts = await get<Contact[]>('contacts');
  return contacts ?? [];
}

export async function getTheme(): Promise<Theme> {
  if (!process.env.GLOBAL_CONFIG && !process.env.EDGE_CONFIG) return DEFAULT_THEME;
  const theme = await get<Theme>('theme');
  return theme ?? DEFAULT_THEME;
}
