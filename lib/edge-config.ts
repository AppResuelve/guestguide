import { get } from '@vercel/edge-config';
import { Contact, Theme, DEFAULT_THEME } from './types';

// Lecturas: usan el SDK de @vercel/edge-config, que lee vía la connection
// string (env var EDGE_CONFIG) directo desde el edge. Es lo que lee la
// landing pública en cada visita — rápido y sin llamar a ninguna API externa.

export async function getContacts(): Promise<Contact[]> {
  if (!process.env.EDGE_CONFIG) return [];
  const contacts = await get<Contact[]>('contacts');
  return contacts ?? [];
}

export async function getTheme(): Promise<Theme> {
  if (!process.env.EDGE_CONFIG) return DEFAULT_THEME;
  const theme = await get<Theme>('theme');
  return theme ?? DEFAULT_THEME;
}
