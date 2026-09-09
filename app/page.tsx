import { getContacts, getCategories, getTheme } from '@/lib/global-config';
import { Contact, Category } from '@/lib/types';

// Sin esto, Next.js intenta pre-renderizar esta página como estática en el
// build (y falla si todavía no hay GLOBAL_CONFIG configurada). Forzamos
// renderizado dinámico: así corre en cada request y los cambios guardados
// desde /admin se ven reflejados sin necesidad de un nuevo deploy.
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [contacts, categories, theme] = await Promise.all([
    getContacts(),
    getCategories(),
    getTheme(),
  ]);

  const sections = groupByCategory(contacts, categories);

  return (
    <div
      style={
        {
          '--brand-primary': theme.primaryColor,
          '--brand-accent': theme.accentColor,
        } as React.CSSProperties
      }
      className="min-h-screen bg-[#f6f2e9] text-[#20241f]"
    >
      <header
        className="px-7 pt-14 pb-9 text-center bg-brand-primary text-[#f6f2e9] bg-cover bg-center"
        style={
          theme.coverImageUrl
            ? {
                backgroundImage: `linear-gradient(rgba(23,51,48,0.75), rgba(23,51,48,0.75)), url(${theme.coverImageUrl})`,
              }
            : undefined
        }
      >
        <h1 className="text-3xl font-normal m-0">{theme.hotelName}</h1>
        <p className="mt-2 text-sm text-[#c7d4cf]">
          Teléfonos útiles durante tu estadía — tocá un contacto para llamar o escribir
        </p>
      </header>

      <main className="max-w-xl mx-auto pb-16">
        {sections.length === 0 && (
          <p className="text-center text-sm text-[#6b6858] mt-10">
            Todavía no se cargaron contactos.
          </p>
        )}

        {sections.map(({ category, items }) => (
          <section key={category} className="mt-10 px-7">
            <h2 className="flex items-baseline gap-2.5 text-lg text-brand-primary m-0">
              {category}
              <span className="flex-1 h-px bg-[#dcd2ba] -translate-y-1" />
            </h2>
            <span className="block text-xs text-[#6b6858] mb-3.5">
              {items.length} contacto{items.length !== 1 ? 's' : ''}
            </span>

            <ul className="list-none m-0 p-0">
              {items.map((contact) => (
                <li key={contact.id} className="border-b border-[#dcd2ba] last:border-none">
                  <div className="flex justify-between items-center gap-3 py-3.5">
                    <a
                      href={contactHref(contact)}
                      target={contact.contactType === 'whatsapp' ? '_blank' : undefined}
                      rel={contact.contactType === 'whatsapp' ? 'noopener' : undefined}
                      className="flex-1 no-underline text-inherit"
                    >
                      <span className="text-base">{contact.name}</span>
                      {contact.role && (
                        <span className="block text-xs text-[#6b6858] mt-0.5">
                          {contact.role}
                        </span>
                      )}
                    </a>

                    {contact.mapsUrl && (
                      <a
                        href={contact.mapsUrl}
                        target="_blank"
                        rel="noopener"
                        aria-label="Ver ubicación"
                        className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-[#dcd2ba] text-brand-primary"
                      >
                        <MapPinIcon />
                      </a>
                    )}

                    <a
                      href={contactHref(contact)}
                      target={contact.contactType === 'whatsapp' ? '_blank' : undefined}
                      rel={contact.contactType === 'whatsapp' ? 'noopener' : undefined}
                      className="shrink-0 text-sm whitespace-nowrap border border-brand-accent text-brand-accent rounded-full px-3.5 py-1.5"
                    >
                      {contact.contactType === 'whatsapp' ? 'WhatsApp' : contact.phone}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
    </div>
  );
}

function contactHref(contact: Contact): string {
  if (contact.contactType === 'whatsapp') {
    const digits = contact.phone.replace(/\D/g, '');
    return `https://wa.me/${digits}`;
  }
  return `tel:${contact.phone}`;
}

function groupByCategory(
  contacts: Contact[],
  categories: Category[]
): { category: string; items: Contact[] }[] {
  const nameById = new Map(categories.map((c) => [c.id, c.name]));
  const map = new Map<string, Contact[]>();

  for (const contact of contacts) {
    const name = nameById.get(contact.categoryId) ?? 'Sin categoría';
    const list = map.get(name) ?? [];
    list.push(contact);
    map.set(name, list);
  }

  // Respeta el orden en que se crearon las categorías.
  const ordered = categories
    .map((c) => c.name)
    .filter((name) => map.has(name));
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
