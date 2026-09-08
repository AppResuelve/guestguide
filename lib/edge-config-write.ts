import { Contact, Theme } from './types';

// Escrituras: el SDK de Edge Config es de solo lectura. Para escribir hay
// que pegarle a la REST API de Vercel con un token que tenga permiso sobre
// este Edge Config puntual. Esto SOLO corre en rutas de API protegidas por
// contraseña (ver lib/auth.ts) — nunca se expone al cliente.

interface EdgeConfigItem {
  operation: 'update' | 'create' | 'delete';
  key: string;
  value?: unknown;
}

async function patchEdgeConfig(items: EdgeConfigItem[]) {
  const edgeConfigId = process.env.EDGE_CONFIG_ID;
  const token = process.env.VERCEL_API_TOKEN;

  if (!edgeConfigId || !token) {
    throw new Error(
      'Faltan EDGE_CONFIG_ID o VERCEL_API_TOKEN en las variables de entorno.'
    );
  }

  const res = await fetch(
    `https://api.vercel.com/v1/edge-config/${edgeConfigId}/items`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items }),
    }
  );

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`No se pudo escribir en Edge Config: ${errorBody}`);
  }

  return res.json();
}

export async function setContacts(contacts: Contact[]) {
  await patchEdgeConfig([{ operation: 'update', key: 'contacts', value: contacts }]);
}

export async function setTheme(theme: Theme) {
  await patchEdgeConfig([{ operation: 'update', key: 'theme', value: theme }]);
}
