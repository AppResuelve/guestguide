'use client';

import { useState } from 'react';
import { Contact, Theme } from '@/lib/types';

let nextId = 0;
function newId() {
  nextId += 1;
  return `nuevo-${Date.now()}-${nextId}`;
}

export default function AdminDashboard({
  initialContacts,
  initialTheme,
}: {
  initialContacts: Contact[];
  initialTheme: Theme;
}) {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [savingContacts, setSavingContacts] = useState(false);
  const [savingTheme, setSavingTheme] = useState(false);
  const [message, setMessage] = useState('');

  function updateContact(id: string, patch: Partial<Contact>) {
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  function addContact() {
    setContacts((prev) => [
      ...prev,
      { id: newId(), category: '', name: '', role: '', phone: '' },
    ]);
  }

  function removeContact(id: string) {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  }

  async function saveContacts() {
    setSavingContacts(true);
    setMessage('');
    const res = await fetch('/api/contacts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contacts),
    });
    setSavingContacts(false);
    setMessage(res.ok ? 'Contactos guardados.' : 'Error al guardar los contactos.');
  }

  async function saveTheme() {
    setSavingTheme(true);
    setMessage('');
    const res = await fetch('/api/theme', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(theme),
    });
    setSavingTheme(false);
    setMessage(res.ok ? 'Apariencia guardada.' : 'Error al guardar la apariencia.');
  }

  async function logout() {
    await fetch('/api/auth', { method: 'DELETE' });
    window.location.reload();
  }

  return (
    <div className="min-h-screen bg-[#f6f2e9] px-6 py-10 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl">Panel del hotel</h1>
        <button onClick={logout} className="text-sm text-[#6b6858] underline">
          Cerrar sesión
        </button>
      </div>

      {message && <p className="mb-5 text-sm text-[#173330]">{message}</p>}

      {/* --- Apariencia --- */}
      <section className="bg-white rounded-lg p-6 mb-8">
        <h2 className="text-lg mb-4">Apariencia</h2>

        <label className="block text-sm mb-1">Nombre del hotel</label>
        <input
          value={theme.hotelName}
          onChange={(e) => setTheme({ ...theme, hotelName: e.target.value })}
          className="w-full border border-[#dcd2ba] rounded px-3 py-2 mb-4"
        />

        <div className="flex gap-6 mb-4">
          <div>
            <label className="block text-sm mb-1">Color principal</label>
            <input
              type="color"
              value={theme.primaryColor}
              onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
              className="w-16 h-10 border border-[#dcd2ba] rounded cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Color de acento</label>
            <input
              type="color"
              value={theme.accentColor}
              onChange={(e) => setTheme({ ...theme, accentColor: e.target.value })}
              className="w-16 h-10 border border-[#dcd2ba] rounded cursor-pointer"
            />
          </div>
        </div>

        <label className="block text-sm mb-1">URL de imagen de portada</label>
        <input
          value={theme.coverImageUrl}
          onChange={(e) => setTheme({ ...theme, coverImageUrl: e.target.value })}
          placeholder="https://..."
          className="w-full border border-[#dcd2ba] rounded px-3 py-2 mb-4"
        />

        <button
          onClick={saveTheme}
          disabled={savingTheme}
          className="bg-[#173330] text-white rounded px-4 py-2 disabled:opacity-60"
        >
          {savingTheme ? 'Guardando...' : 'Guardar apariencia'}
        </button>
      </section>

      {/* --- Contactos --- */}
      <section className="bg-white rounded-lg p-6">
        <h2 className="text-lg mb-4">Contactos</h2>

        <div className="space-y-4">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="border border-[#dcd2ba] rounded p-4 grid grid-cols-2 gap-3"
            >
              <input
                value={contact.category}
                onChange={(e) => updateContact(contact.id, { category: e.target.value })}
                placeholder="Categoría (ej. Emergencias)"
                className="border border-[#dcd2ba] rounded px-2 py-1.5 text-sm"
              />
              <input
                value={contact.name}
                onChange={(e) => updateContact(contact.id, { name: e.target.value })}
                placeholder="Nombre"
                className="border border-[#dcd2ba] rounded px-2 py-1.5 text-sm"
              />
              <input
                value={contact.role ?? ''}
                onChange={(e) => updateContact(contact.id, { role: e.target.value })}
                placeholder="Descripción (opcional)"
                className="border border-[#dcd2ba] rounded px-2 py-1.5 text-sm"
              />
              <input
                value={contact.phone}
                onChange={(e) => updateContact(contact.id, { phone: e.target.value })}
                placeholder="+549..."
                className="border border-[#dcd2ba] rounded px-2 py-1.5 text-sm"
              />
              <button
                onClick={() => removeContact(contact.id)}
                className="col-span-2 text-sm text-red-700 text-left"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>

        <button onClick={addContact} className="mt-4 text-sm text-[#173330] underline">
          + Agregar contacto
        </button>

        <div className="mt-6">
          <button
            onClick={saveContacts}
            disabled={savingContacts}
            className="bg-[#173330] text-white rounded px-4 py-2 disabled:opacity-60"
          >
            {savingContacts ? 'Guardando...' : 'Guardar contactos'}
          </button>
        </div>
      </section>
    </div>
  );
}
