'use client';

import { useState } from 'react';
import { Item, Category, Theme, AppConfig } from '@/lib/types';
import Sidebar, { Section } from './admin/Sidebar';
import GuiaSection from './admin/GuiaSection';
import AparienciaSection from './admin/AparienciaSection';
import ConfigSection from './admin/ConfigSection';
import CategoriasSection from './admin/CategoriasSection';
import DatosSection from './admin/DatosSection';

async function putJson(url: string, body: unknown) {
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.ok;
}

export default function AdminShell({
  initialItems,
  initialCategories,
  initialTheme,
  initialConfig,
}: {
  initialItems: Item[];
  initialCategories: Category[];
  initialTheme: Theme;
  initialConfig: AppConfig;
}) {
  const [section, setSection] = useState<Section>('guia');
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [items, setItems] = useState<Item[]>(initialItems);
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [config, setConfig] = useState<AppConfig>(initialConfig);

  // El estado de categorías/datos/tema/config vive acá, un nivel arriba de
  // las secciones. Así, cuando cambiás algo en una sección y pasás a otra,
  // ya lo tiene sin necesidad de recargar.

  async function saveCategories(next: Category[]): Promise<boolean> {
    const ok = await putJson('/api/categories', next);
    if (ok) setCategories(next);
    return ok;
  }

  async function saveItems(next: Item[]): Promise<boolean> {
    const ok = await putJson('/api/items', next);
    if (ok) setItems(next);
    return ok;
  }

  async function saveTheme(next: Theme): Promise<boolean> {
    const ok = await putJson('/api/theme', next);
    if (ok) setTheme(next);
    return ok;
  }

  async function saveConfig(next: AppConfig): Promise<boolean> {
    const ok = await putJson('/api/config', next);
    if (ok) setConfig(next);
    return ok;
  }

  async function logout() {
    await fetch('/api/auth', { method: 'DELETE' });
    window.location.reload();
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col sm:flex-row">
      <Sidebar active={section} onChange={setSection} onLogout={logout} />

      <main className="flex-1 p-6 sm:p-8">
        <div className="max-w-4xl mx-auto">
          {section === 'guia' && <GuiaSection />}

          {section === 'apariencia' && (
            <AparienciaSection theme={theme} onSave={saveTheme} />
          )}

          {section === 'config' && (
            <ConfigSection config={config} onSave={saveConfig} />
          )}

          {section === 'categorias' && (
            <CategoriasSection
              categories={categories}
              items={items}
              onSave={saveCategories}
            />
          )}

          {section === 'datos' && (
            <DatosSection
              items={items}
              categories={categories}
              config={config}
              onSave={saveItems}
            />
          )}

          <button
            onClick={logout}
            className="mt-8 text-sm text-slate-500 underline sm:hidden"
          >
            Cerrar sesión
          </button>
        </div>
      </main>
    </div>
  );
}
