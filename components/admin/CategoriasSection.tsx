'use client';

import { useState } from 'react';
import { Category, Contact } from '@/lib/types';
import Field from './Field';

function newId() {
  return `cat-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export default function CategoriasSection({
  categories,
  contacts,
  onSave,
}: {
  categories: Category[];
  contacts: Contact[];
  onSave: (next: Category[]) => Promise<boolean>;
}) {
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function persist(next: Category[], successMsg: string) {
    setSaving(true);
    setMessage('');
    const ok = await onSave(next);
    setSaving(false);
    setMessage(ok ? successMsg : 'Error al guardar las categorías.');
  }

  function addCategory() {
    if (!newName.trim()) return;
    const next = [...categories, { id: newId(), name: newName.trim() }];
    setNewName('');
    setShowForm(false);
    persist(next, 'Categoría agregada.');
  }

  function startEdit(cat: Category) {
    setEditingId(cat.id);
    setEditingName(cat.name);
  }

  function saveEdit() {
    if (!editingId) return;
    const next = categories.map((c) =>
      c.id === editingId ? { ...c, name: editingName.trim() || c.name } : c
    );
    setEditingId(null);
    persist(next, 'Categoría actualizada.');
  }

  function removeCategory(id: string) {
    const inUse = contacts.some((c) => c.categoryId === id);
    if (inUse) {
      setMessage('No se puede eliminar: hay contactos usando esta categoría.');
      return;
    }
    persist(
      categories.filter((c) => c.id !== id),
      'Categoría eliminada.'
    );
  }

  function countFor(id: string) {
    return contacts.filter((c) => c.categoryId === id).length;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl">Categorías</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="bg-[#173330] text-white rounded px-4 py-2 text-sm"
        >
          {showForm ? 'Cancelar' : '+ Agregar categoría'}
        </button>
      </div>

      {message && <p className="mb-4 text-sm text-[#173330]">{message}</p>}

      {showForm && (
        <div className="bg-white rounded-lg p-5 mb-6 max-w-sm">
          <Field label="Nombre de la categoría">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Ej. Emergencias"
              className="w-full border border-[#dcd2ba] rounded px-3 py-2"
              autoFocus
            />
          </Field>
          <button
            onClick={addCategory}
            disabled={saving}
            className="bg-[#173330] text-white rounded px-4 py-2 text-sm disabled:opacity-60"
          >
            Guardar
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-[#dcd2ba] text-[#6b6858]">
              <th className="px-4 py-3 font-normal">Nombre</th>
              <th className="px-4 py-3 font-normal">Contactos</th>
              <th className="px-4 py-3 font-normal w-40">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-[#6b6858]">
                  Todavía no creaste ninguna categoría.
                </td>
              </tr>
            )}
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b border-[#dcd2ba] last:border-none">
                <td className="px-4 py-3">
                  {editingId === cat.id ? (
                    <input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="border border-[#dcd2ba] rounded px-2 py-1 text-sm w-full"
                      autoFocus
                    />
                  ) : (
                    cat.name
                  )}
                </td>
                <td className="px-4 py-3">{countFor(cat.id)}</td>
                <td className="px-4 py-3 space-x-3">
                  {editingId === cat.id ? (
                    <>
                      <button onClick={saveEdit} className="text-[#173330] underline">
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-[#6b6858] underline"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(cat)} className="text-[#173330] underline">
                        Editar
                      </button>
                      <button
                        onClick={() => removeCategory(cat.id)}
                        className="text-red-700 underline"
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
