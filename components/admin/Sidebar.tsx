'use client';

export type Section = 'guia' | 'apariencia' | 'categorias' | 'contactos';

const ITEMS: { id: Section; label: string }[] = [
  { id: 'guia', label: 'Guía' },
  { id: 'apariencia', label: 'Apariencia' },
  { id: 'categorias', label: 'Categorías' },
  { id: 'contactos', label: 'Contactos' },
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
    <aside className="w-full sm:w-48 shrink-0 border-b sm:border-b-0 sm:border-r border-[#dcd2ba] sm:min-h-screen">
      <div className="p-5">
        <h2 className="text-base font-semibold mb-4">Panel del hotel</h2>
        <nav className="flex sm:flex-col gap-1 overflow-x-auto">
          {ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`text-left px-3 py-2 rounded text-sm whitespace-nowrap ${
                active === item.id
                  ? 'bg-[#173330] text-white'
                  : 'text-[#20241f] hover:bg-[#efe9d8]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <button
          onClick={onLogout}
          className="mt-6 text-sm text-[#6b6858] underline hidden sm:block"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
