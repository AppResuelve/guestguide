'use client';

import { useState } from 'react';
import { Category, Item } from '@/lib/types';
import Field from './Field';

function newId() {
  return `cat-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export default function CategoriasSection({
  categories,
  items,
  onSave,
}: {
  categories: Category[];
  items: Item[];
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
    const inUse = items.some((c) => c.categoryId === id);
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
    return items.filter((c) => c.categoryId === id).length;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl">Categorías</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded px-4 py-2 text-sm"
        >
          {showForm ? 'Cancelar' : '+ Agregar categoría'}
        </button>
      </div>

      {message && <p className="mb-4 text-sm text-indigo-700">{message}</p>}

      {showForm && (
        <div className="bg-white rounded-lg p-5 mb-6 max-w-sm">
          <Field label="Nombre de la categoría">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Ej. Emergencias"
              className="w-full border border-slate-200 rounded px-3 py-2"
              autoFocus
            />
          </Field>
          <div className="flex justify-end">
            <button
              onClick={addCategory}
              disabled={saving}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded px-4 py-2 text-sm disabled:opacity-60"
            >
              Guardar
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-slate-200 text-slate-500">
              <th className="px-4 py-3 font-normal">Nombre</th>
              <th className="px-4 py-3 font-normal">Datos</th>
              <th className="px-4 py-3 font-normal w-40">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-slate-500">
                  Todavía no creaste ninguna categoría.
                </td>
              </tr>
            )}
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b border-slate-200 last:border-none">
                <td className="px-4 py-3">
                  {editingId === cat.id ? (
                    <input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="border border-slate-200 rounded px-2 py-1 text-sm w-full"
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
                      <button onClick={saveEdit} className="text-indigo-600 underline">
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-slate-500 underline"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(cat)} className="text-indigo-600 underline">
                        Editar
                      </button>
                      <button
                        onClick={() => removeCategory(cat.id)}
                        className="text-red-600 underline"
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
