'use client';

import { useState } from 'react';
import { Contact, Category, Theme } from '@/lib/types';
import Sidebar, { Section } from './admin/Sidebar';
import GuiaSection from './admin/GuiaSection';
import AparienciaSection from './admin/AparienciaSection';
import CategoriasSection from './admin/CategoriasSection';
import ContactosSection from './admin/ContactosSection';

async function putJson(url: string, body: unknown) {
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.ok;
}

export default function AdminShell({
  initialContacts,
  initialCategories,
  initialTheme,
}: {
  initialContacts: Contact[];
  initialCategories: Category[];
  initialTheme: Theme;
}) {
  const [section, setSection] = useState<Section>('guia');
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [theme, setTheme] = useState<Theme>(initialTheme);

  // El estado de categorías/contactos/tema vive acá, un nivel arriba de las
  // secciones. Así, cuando agregás una categoría y después pasás a
  // "Contactos", el selector ya la tiene sin necesidad de recargar.

  async function saveCategories(next: Category[]): Promise<boolean> {
    const ok = await putJson('/api/categories', next);
    if (ok) setCategories(next);
    return ok;
  }

  async function saveContacts(next: Contact[]): Promise<boolean> {
    const ok = await putJson('/api/contacts', next);
    if (ok) setContacts(next);
    return ok;
  }

  async function saveTheme(next: Theme): Promise<boolean> {
    const ok = await putJson('/api/theme', next);
    if (ok) setTheme(next);
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

          {section === 'categorias' && (
            <CategoriasSection
              categories={categories}
              contacts={contacts}
              onSave={saveCategories}
            />
          )}

          {section === 'contactos' && (
            <ContactosSection
              contacts={contacts}
              categories={categories}
              onSave={saveContacts}
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
