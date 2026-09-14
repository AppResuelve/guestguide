'use client';

import { useState } from 'react';
import { Item, Category, ContactType, DataTypeId, DATA_TYPE_OPTIONS, AppConfig } from '@/lib/types';
import Field from './Field';

function newId() {
  return `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function emptyForm(defaultType: DataTypeId) {
  return {
    type: defaultType,
    categoryId: '',
    name: '',
    description: '',
    phone: '',
    contactType: 'call' as ContactType,
    mapsUrl: '',
    images: ['', '', ''] as string[],
  };
}

export default function DatosSection({
  items,
  categories,
  config,
  onSave,
}: {
  items: Item[];
  categories: Category[];
  config: AppConfig;
  onSave: (next: Item[]) => Promise<boolean>;
}) {
  const enabledTypeOptions = DATA_TYPE_OPTIONS.filter((opt) =>
    config.enabledTypes.includes(opt.id)
  );
  const defaultType = config.enabledTypes[0] ?? 'contacto';

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm(defaultType));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const nameById = new Map(categories.map((c) => [c.id, c.name]));
  const typeLabelById = new Map(DATA_TYPE_OPTIONS.map((t) => [t.id, t.label]));

  async function persist(next: Item[], successMsg: string) {
    setSaving(true);
    setMessage('');
    const ok = await onSave(next);
    setSaving(false);
    setMessage(ok ? successMsg : 'Error al guardar los datos.');
  }

  function openNewForm() {
    setForm(emptyForm(defaultType));
    setEditingId(null);
    setShowForm(true);
  }

  function openEditForm(item: Item) {
    const images = item.images ?? [];
    setForm({
      type: item.type,
      categoryId: item.categoryId,
      name: item.name,
      description: item.description ?? '',
      phone: item.phone ?? '',
      contactType: item.contactType,
      mapsUrl: item.mapsUrl ?? '',
      images: [images[0] ?? '', images[1] ?? '', images[2] ?? ''],
    });
    setEditingId(item.id);
    setShowForm(true);
  }

  function saveForm() {
    if (!form.name.trim() || !form.categoryId) return;
    if (!form.phone.trim() && !form.mapsUrl.trim()) {
      setMessage('Cargá al menos un teléfono o una ubicación.');
      return;
    }

    const cleanImages = form.images.map((i) => i.trim()).filter(Boolean).slice(0, 3);
    const payload = { ...form, images: cleanImages };

    if (editingId) {
      const next = items.map((i) => (i.id === editingId ? { ...i, ...payload } : i));
      persist(next, 'Dato actualizado.');
    } else {
      const next = [...items, { id: newId(), ...payload }];
      persist(next, 'Dato agregado.');
    }
    setShowForm(false);
    setEditingId(null);
  }

  function removeItem(id: string) {
    persist(
      items.filter((i) => i.id !== id),
      'Dato eliminado.'
    );
  }

  function setImage(index: number, value: string) {
    setForm((prev) => {
      const images = [...prev.images];
      images[index] = value;
      return { ...prev, images };
    });
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl">Datos</h1>
        <button
          onClick={() => (showForm ? setShowForm(false) : openNewForm())}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded px-4 py-2 text-sm"
        >
          {showForm ? 'Cancelar' : '+ Agregar dato'}
        </button>
      </div>

      {message && <p className="mb-4 text-sm text-indigo-700">{message}</p>}

      {showForm && (
        <div className="bg-white rounded-lg p-5 mb-6">
          {enabledTypeOptions.length > 1 ? (
            <Field label="Tipo de dato">
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as DataTypeId })}
                className="w-full border border-slate-200 rounded px-3 py-2"
              >
                {enabledTypeOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Field>
          ) : (
            <p className="text-xs text-slate-500 mb-4">
              Tipo: {typeLabelById.get(defaultType)} — habilitá más tipos en
              "Configuración" para poder elegir.
            </p>
          )}

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
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
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

          <Field label="Imágenes (opcional, hasta 3 URLs)">
            <div className="space-y-2">
              {form.images.map((img, i) => (
                <input
                  key={i}
                  value={img}
                  onChange={(e) => setImage(i, e.target.value)}
                  placeholder={`URL de imagen ${i + 1}`}
                  className="w-full border border-slate-200 rounded px-3 py-2"
                />
              ))}
            </div>
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
              <th className="px-4 py-3 font-normal">Tipo</th>
              <th className="px-4 py-3 font-normal">Categoría</th>
              <th className="px-4 py-3 font-normal">Nombre</th>
              <th className="px-4 py-3 font-normal">Teléfono</th>
              <th className="px-4 py-3 font-normal">Acción</th>
              <th className="px-4 py-3 font-normal w-40">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                  Todavía no cargaste ningún dato.
                </td>
              </tr>
            )}
            {items.map((item) => (
              <tr key={item.id} className="border-b border-slate-200 last:border-none">
                <td className="px-4 py-3">{typeLabelById.get(item.type) ?? item.type}</td>
                <td className="px-4 py-3">
                  {nameById.get(item.categoryId) ?? 'Sin categoría'}
                </td>
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3">{item.phone || '—'}</td>
                <td className="px-4 py-3">
                  {item.contactType === 'whatsapp' ? 'WhatsApp' : 'Llamada'}
                </td>
                <td className="px-4 py-3 space-x-3">
                  <button
                    onClick={() => openEditForm(item)}
                    className="text-indigo-600 underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
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
