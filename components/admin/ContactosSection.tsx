'use client';

import { useState } from 'react';
import { Contact, Category, ContactType } from '@/lib/types';
import Field from './Field';

function newId() {
  return `contact-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

const EMPTY_FORM = {
  categoryId: '',
  name: '',
  role: '',
  phone: '',
  contactType: 'call' as ContactType,
  mapsUrl: '',
};

export default function ContactosSection({
  contacts,
  categories,
  onSave,
}: {
  contacts: Contact[];
  categories: Category[];
  onSave: (next: Contact[]) => Promise<boolean>;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const nameById = new Map(categories.map((c) => [c.id, c.name]));

  async function persist(next: Contact[], successMsg: string) {
    setSaving(true);
    setMessage('');
    const ok = await onSave(next);
    setSaving(false);
    setMessage(ok ? successMsg : 'Error al guardar los contactos.');
  }

  function openNewForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  }

  function openEditForm(contact: Contact) {
    setForm({
      categoryId: contact.categoryId,
      name: contact.name,
      role: contact.role ?? '',
      phone: contact.phone ?? '',
      contactType: contact.contactType,
      mapsUrl: contact.mapsUrl ?? '',
    });
    setEditingId(contact.id);
    setShowForm(true);
  }

  function saveForm() {
    if (!form.name.trim() || !form.categoryId) return;
    if (!form.phone.trim() && !form.mapsUrl.trim()) {
      setMessage('Cargá al menos un teléfono o una ubicación.');
      return;
    }

    if (editingId) {
      const next = contacts.map((c) => (c.id === editingId ? { ...c, ...form } : c));
      persist(next, 'Contacto actualizado.');
    } else {
      const next = [...contacts, { id: newId(), ...form }];
      persist(next, 'Contacto agregado.');
    }
    setShowForm(false);
    setEditingId(null);
  }

  function removeContact(id: string) {
    persist(
      contacts.filter((c) => c.id !== id),
      'Contacto eliminado.'
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl">Contactos</h1>
        <button
          onClick={() => (showForm ? setShowForm(false) : openNewForm())}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded px-4 py-2 text-sm"
        >
          {showForm ? 'Cancelar' : '+ Agregar contacto'}
        </button>
      </div>

      {message && <p className="mb-4 text-sm text-indigo-700">{message}</p>}

      {showForm && (
        // Mismo ancho que la tabla de abajo (sin max-w propio). En pantallas
        // sm+, categoría+nombre van 50/50 en una fila, y teléfono+acción del
        // botón en otra.
        <div className="bg-white rounded-lg p-5 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Field label="Categoría">
              {categories.length === 0 ? (
                <span className="text-sm text-slate-500">
                  Primero tenés que crear una categoría en la sección "Categorías".
                </span>
              ) : (
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="w-full border border-slate-200 rounded px-3 py-2"
                >
                  <option value="">Elegí una categoría</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              )}
            </Field>

            <Field label="Nombre">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ej. Recepción"
                className="w-full border border-slate-200 rounded px-3 py-2"
              />
            </Field>
          </div>

          <Field label="Descripción (opcional)">
            <input
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              placeholder="Ej. Consultas generales, 24 hs"
              className="w-full border border-slate-200 rounded px-3 py-2"
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Field label="Teléfono (opcional si cargás ubicación)">
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+549..."
                className="w-full border border-slate-200 rounded px-3 py-2"
              />
            </Field>

            <Field label="Acción del botón">
              <select
                value={form.contactType}
                onChange={(e) =>
                  setForm({ ...form, contactType: e.target.value as ContactType })
                }
                className="w-full border border-slate-200 rounded px-3 py-2"
              >
                <option value="call">Llamar</option>
                <option value="whatsapp">Abrir WhatsApp</option>
              </select>
            </Field>
          </div>

          <Field label="Ubicación (opcional): dirección o link de Google Maps">
            <input
              value={form.mapsUrl}
              onChange={(e) => setForm({ ...form, mapsUrl: e.target.value })}
              placeholder="Ej: Congreso 110, Victoria, Entre Ríos"
              className="w-full border border-slate-200 rounded px-3 py-2"
            />
          </Field>

          <div className="flex justify-end">
            <button
              onClick={saveForm}
              disabled={saving || categories.length === 0}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded px-4 py-2 text-sm disabled:opacity-60"
            >
              {editingId ? 'Guardar cambios' : 'Agregar'}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-slate-200 text-slate-500">
              <th className="px-4 py-3 font-normal">Categoría</th>
              <th className="px-4 py-3 font-normal">Nombre</th>
              <th className="px-4 py-3 font-normal">Teléfono</th>
              <th className="px-4 py-3 font-normal">Acción</th>
              <th className="px-4 py-3 font-normal w-40">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                  Todavía no cargaste ningún contacto.
                </td>
              </tr>
            )}
            {contacts.map((contact) => (
              <tr key={contact.id} className="border-b border-slate-200 last:border-none">
                <td className="px-4 py-3">
                  {nameById.get(contact.categoryId) ?? 'Sin categoría'}
                </td>
                <td className="px-4 py-3">{contact.name}</td>
                <td className="px-4 py-3">{contact.phone || '—'}</td>
                <td className="px-4 py-3">
                  {contact.contactType === 'whatsapp' ? 'WhatsApp' : 'Llamada'}
                </td>
                <td className="px-4 py-3 space-x-3">
                  <button
                    onClick={() => openEditForm(contact)}
                    className="text-indigo-600 underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => removeContact(contact.id)}
                    className="text-red-600 underline"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
