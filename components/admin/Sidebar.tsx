'use client';

export type Section = 'guia' | 'apariencia' | 'config' | 'categorias' | 'datos';

const ITEMS: { id: Section; label: string }[] = [
  { id: 'guia', label: 'Guía' },
  { id: 'apariencia', label: 'Apariencia' },
  { id: 'config', label: 'Configuración' },
  { id: 'categorias', label: 'Categorías' },
  { id: 'datos', label: 'Datos' },
];

export default function Sidebar({
  active,
  onChange,
  onLogout,
}: {
  active: Section;
  onChange: (s: Section) => void;
  onLogout: () => void;
}) {
  return (
    <aside className="w-full sm:w-48 shrink-0 border-b sm:border-b-0 sm:border-r border-slate-200 sm:min-h-screen">
      <div className="p-5">
        <h2 className="text-base font-semibold mb-4 text-slate-900">Admin de Guía</h2>
        <nav className="flex sm:flex-col gap-1 overflow-x-auto">
          {ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`text-left px-3 py-2 rounded text-sm whitespace-nowrap ${
                active === item.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <button
          onClick={onLogout}
          className="mt-6 text-sm text-slate-500 underline hidden sm:block"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
