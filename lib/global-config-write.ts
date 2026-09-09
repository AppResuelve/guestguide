import { Contact, Theme, Category } from './types';

// Escrituras: el SDK es de solo lectura. Para escribir hay que pegarle a la
// REST API de Vercel con un token de cuenta (Account Settings > Tokens, con
// scope en el team) y el teamId del proyecto. Esto SOLO corre en rutas de
// API protegidas por contraseña (ver lib/auth.ts) — nunca se expone al cliente.

interface GlobalConfigItem {
  operation: 'upsert' | 'create' | 'delete';
  key: string;
  value?: unknown;
}

async function patchGlobalConfig(items: GlobalConfigItem[]) {
  const globalConfigId = process.env.GLOBAL_CONFIG_ID;
  const token = process.env.GLOBAL_CONFIG_TOKEN;
  const teamId = process.env.GLOBAL_CONFIG_TEAM_ID;

  if (!globalConfigId || !token) {
    throw new Error(
      'Faltan GLOBAL_CONFIG_ID o GLOBAL_CONFIG_TOKEN en las variables de entorno.'
    );
  }

  const url = new URL(
    `https://api.vercel.com/v1/global-config/${globalConfigId}/items`
  );
  if (teamId) {
    url.searchParams.set('teamId', teamId);
  }

  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ items }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`No se pudo escribir en Global Config: ${errorBody}`);
  }

  return res.json();
}

export async function setContacts(contacts: Contact[]) {
  await patchGlobalConfig([{ operation: 'upsert', key: 'contacts', value: contacts }]);
}

export async function setCategories(categories: Category[]) {
  await patchGlobalConfig([{ operation: 'upsert', key: 'categories', value: categories }]);
}

export async function setTheme(theme: Theme) {
  await patchGlobalConfig([{ operation: 'upsert', key: 'theme', value: theme }]);
}
