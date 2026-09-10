'use client';

import { useState } from 'react';
import { Theme } from '@/lib/types';
import { FONT_PAIR_OPTIONS } from '@/lib/font-pairs';
import Field from './Field';

export default function AparienciaSection({
  theme,
  onSave,
}: {
  theme: Theme;
  onSave: (next: Theme) => Promise<boolean>;
}) {
  const [form, setForm] = useState<Theme>(theme);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function save() {
    setSaving(true);
    setMessage('');
    const ok = await onSave(form);
    setSaving(false);
    setMessage(ok ? 'Apariencia guardada.' : 'Error al guardar la apariencia.');
  }

  return (
    <div>
      <h1 className="text-xl mb-4">Apariencia</h1>
      {message && <p className="mb-4 text-sm text-indigo-700">{message}</p>}

      <div className="bg-white rounded-lg p-6 max-w-md">
        <Field label="Nombre del hotel">
          <input
            value={form.hotelName}
            onChange={(e) => setForm({ ...form, hotelName: e.target.value })}
            className="w-full border border-slate-200 rounded px-3 py-2"
          />
        </Field>

        <div className="flex gap-6 mb-4">
          <Field label="Color principal">
            <input
              type="color"
              value={form.primaryColor}
              onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
              className="w-16 h-10 border border-slate-200 rounded cursor-pointer"
            />
          </Field>
          <Field label="Color de acento">
            <input
              type="color"
              value={form.accentColor}
              onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
              className="w-16 h-10 border border-slate-200 rounded cursor-pointer"
            />
          </Field>
        </div>

        <Field label="URL de imagen de portada">
          <input
            value={form.coverImageUrl}
            onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })}
            placeholder="https://..."
            className="w-full border border-slate-200 rounded px-3 py-2"
          />
        </Field>

        <Field label="URL del logo (circular, se superpone a la portada)">
          <input
            value={form.logoUrl}
            onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
            placeholder="https://..."
            className="w-full border border-slate-200 rounded px-3 py-2"
          />
        </Field>

        <Field label="Tipografía de la guía pública">
          <select
            value={form.fontPair}
            onChange={(e) =>
              setForm({ ...form, fontPair: e.target.value as Theme['fontPair'] })
            }
            className="w-full border border-slate-200 rounded px-3 py-2"
          >
            {FONT_PAIR_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </Field>

        <div className="flex justify-end">
          <button
            onClick={save}
            disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded px-4 py-2 disabled:opacity-60"
          >
            {saving ? 'Guardando...' : 'Guardar apariencia'}
          </button>
        </div>
      </div>
    </div>
  );
}
