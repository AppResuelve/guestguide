'use client';

import { useState } from 'react';
import { AppConfig, DATA_TYPE_OPTIONS, DataTypeId } from '@/lib/types';

export default function ConfigSection({
  config,
  onSave,
}: {
  config: AppConfig;
  onSave: (next: AppConfig) => Promise<boolean>;
}) {
  const [enabledTypes, setEnabledTypes] = useState<DataTypeId[]>(config.enabledTypes);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  function toggle(id: DataTypeId) {
    setEnabledTypes((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  }

  async function save() {
    if (enabledTypes.length === 0) {
      setMessage('Tiene que quedar al menos un tipo habilitado.');
      return;
    }
    setSaving(true);
    setMessage('');
    const ok = await onSave({ enabledTypes });
    setSaving(false);
    setMessage(ok ? 'Configuración guardada.' : 'Error al guardar la configuración.');
  }

  return (
    <div>
      <h1 className="text-xl mb-4">Configuración</h1>
      <p className="text-sm text-slate-500 mb-4">
        Elegí qué tipos de dato puede cargar el hotel. Cada uno habilitado
        aparece como pestaña en la guía pública (si hay más de uno) y como
        opción al crear un dato nuevo.
      </p>

      {message && <p className="mb-4 text-sm text-indigo-700">{message}</p>}

      <div className="bg-white rounded-lg p-6 max-w-md">
        <div className="space-y-3 mb-6">
          {DATA_TYPE_OPTIONS.map((opt) => (
            <label key={opt.id} className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={enabledTypes.includes(opt.id)}
                onChange={() => toggle(opt.id)}
                className="w-4 h-4"
              />
              {opt.label}
            </label>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            onClick={save}
            disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded px-4 py-2 disabled:opacity-60"
          >
            {saving ? 'Guardando...' : 'Guardar configuración'}
          </button>
        </div>
      </div>
    </div>
  );
}
