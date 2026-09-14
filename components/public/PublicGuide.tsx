'use client';

import { useState } from 'react';
import { Item, Category, AppConfig, DataTypeId, DATA_TYPE_OPTIONS } from '@/lib/types';

export default function PublicGuide({
  items,
  categories,
  config,
}: {
  items: Item[];
  categories: Category[];
  config: AppConfig;
}) {
  const tabs = DATA_TYPE_OPTIONS.filter((opt) => config.enabledTypes.includes(opt.id));
  const [activeType, setActiveType] = useState<DataTypeId>(
    tabs[0]?.id ?? 'contacto'
  );

  const visibleItems = items.filter(
    (item) => item.type === activeType && config.enabledTypes.includes(item.type)
  );
  const sections = groupByCategory(visibleItems, categories);

  return (
    <>
      {tabs.length > 1 && (
        <div className="flex border-b border-[#dcd2ba] px-7 sm:px-0 sm:max-w-xl sm:mx-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveType(tab.id)}
              style={{ width: `${100 / tabs.length}%` }}
              className={`flex items-center justify-center gap-1.5 py-3 text-sm border-b-2 transition-colors ${
                activeType === tab.id
                  ? 'border-brand-accent text-brand-primary font-medium'
                  : 'border-transparent text-[#6b6858]'
              }`}
            >
              <TabIcon type={tab.id} />
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <main className="max-w-xl mx-auto pb-16">
        {sections.length === 0 && (
          <p className="text-center text-sm text-[#6b6858] mt-10">
            Todavía no se cargó contenido acá.
          </p>
        )}

        {sections.map(({ category, items: categoryItems }) => (
          <section key={category} className="mt-10 px-7">
            <h2 className="font-title flex items-baseline gap-2.5 text-lg text-brand-primary m-0">
              {category}
              <span className="flex-1 h-px bg-[#dcd2ba] -translate-y-1" />
            </h2>
            <span className="block text-xs text-[#6b6858] mb-3.5">
              {categoryItems.length} {categoryItems.length !== 1 ? 'resultados' : 'resultado'}
            </span>

            <ul className="list-none m-0 p-0">
              {categoryItems.map((item) => (
                <li key={item.id} className="border-b border-[#dcd2ba] last:border-none py-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                    <div className="flex-1">
                      <span className="text-base">{item.name}</span>
                      {item.description && (
                        <span className="block text-xs text-[#6b6858] mt-0.5">
                          {item.description}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap sm:shrink-0">
                      {item.mapsUrl && (
                        <a
                          href={mapsHref(item.mapsUrl)}
                          target="_blank"
                          rel="noopener"
                          className="flex items-center gap-1.5 text-sm whitespace-nowrap border border-[#dcd2ba] text-brand-primary rounded-full px-3.5 py-1.5"
                        >
                          <MapPinIcon />
                          Ver ubicación
                        </a>
                      )}

                      {item.phone && (
                        <a
                          href={contactHref(item)}
                          target={item.contactType === 'whatsapp' ? '_blank' : undefined}
                          rel={item.contactType === 'whatsapp' ? 'noopener' : undefined}
                          className="text-sm whitespace-nowrap border border-brand-accent text-brand-accent rounded-full px-3.5 py-1.5"
                        >
                          {item.contactType === 'whatsapp' ? 'WhatsApp' : item.phone}
                        </a>
                      )}
                    </div>
                  </div>

                  {item.images && item.images.length > 0 && (
                    <div className="flex gap-2 mt-2.5">
                      {item.images.slice(0, 3).map((src, i) => (
                        <img
                          key={i}
                          src={src}
                          alt=""
                          className="w-20 h-20 object-cover rounded-md border border-[#dcd2ba]"
                        />
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
    </>
  );
}

function contactHref(item: Item): string {
  const phone = item.phone as string; // solo se llama cuando item.phone existe
  if (item.contactType === 'whatsapp') {
    const digits = phone.replace(/\D/g, '');
    return `https://wa.me/${digits}`;
  }
  return `tel:${phone}`;
}

// Acepta tanto un link completo de Google Maps como una dirección en texto
// plano — así el admin no depende de saber generar un link compartible.
function mapsHref(value: string): string {
  if (/^https?:\/\//i.test(value)) return value;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(value)}`;
}

function groupByCategory(
  items: Item[],
  categories: Category[]
): { category: string; items: Item[] }[] {
  const nameById = new Map(categories.map((c) => [c.id, c.name]));
  const map = new Map<string, Item[]>();

  for (const item of items) {
    const name = nameById.get(item.categoryId) ?? 'Sin categoría';
    const list = map.get(name) ?? [];
    list.push(item);
    map.set(name, list);
  }

  const ordered = categories.map((c) => c.name).filter((name) => map.has(name));
  if (map.has('Sin categoría')) ordered.push('Sin categoría');

  return ordered.map((category) => ({ category, items: map.get(category)! }));
}

function MapPinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function TabIcon({ type }: { type: DataTypeId }) {
  if (type === 'evento') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 3v4M16 3v4" />
      </svg>
    );
  }
  if (type === 'atraccion') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <path d="M15 9l-2 6-6 2 2-6 6-2z" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L8 9.9a16 16 0 0 0 6 6l1.4-1.4a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.8 2.2z" />
    </svg>
  );
}
