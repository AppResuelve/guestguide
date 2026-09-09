import { get } from '@vercel/global-config';
import { Contact, Theme, Category, DEFAULT_THEME } from './types';

// Lecturas: usan el SDK de @vercel/global-config, que lee vía la connection
// string (env var GLOBAL_CONFIG, con fallback a la vieja EDGE_CONFIG) directo
// desde el edge. Es lo que lee la landing pública en cada visita.

const hasConnection = () =>
  Boolean(process.env.GLOBAL_CONFIG || process.env.EDGE_CONFIG);

export async function getContacts(): Promise<Contact[]> {
  if (!hasConnection()) return [];
  const contacts = await get<Contact[]>('contacts');
  return contacts ?? [];
}

export async function getCategories(): Promise<Category[]> {
  if (!hasConnection()) return [];
  const categories = await get<Category[]>('categories');
  return categories ?? [];
}

export async function getTheme(): Promise<Theme> {
  if (!hasConnection()) return DEFAULT_THEME;
  const theme = await get<Theme>('theme');
  return theme ?? DEFAULT_THEME;
}
