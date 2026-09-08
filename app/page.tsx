import { getContacts, getTheme } from '@/lib/global-config';
import { Contact } from '@/lib/types';

// Sin esto, Next.js intenta pre-renderizar esta página como estática en el
// build (y falla si todavía no hay EDGE_CONFIG configurada). Forzamos
// renderizado dinámico: así corre en cada request y los cambios guardados
// desde /admin se ven reflejados sin necesidad de un nuevo deploy.
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [contacts, theme] = await Promise.all([getContacts(), getTheme()]);

  const categories = groupByCategory(contacts);

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
          Teléfonos útiles durante tu estadía — tocá un número para llamar
        </p>
      </header>

      <main className="max-w-xl mx-auto pb-16">
        {categories.length === 0 && (
          <p className="text-center text-sm text-[#6b6858] mt-10">
            Todavía no se cargaron contactos.
          </p>
        )}

        {categories.map(([category, items]) => (
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
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex justify-between items-center gap-4 py-3.5 no-underline text-inherit"
                  >
                    <span>
                      <span className="text-base">{contact.name}</span>
                      {contact.role && (
                        <span className="block text-xs text-[#6b6858] mt-0.5">
                          {contact.role}
                        </span>
                      )}
                    </span>
                    <span className="text-sm whitespace-nowrap border border-brand-accent text-brand-accent rounded-full px-3.5 py-1.5">
                      {contact.phone}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
    </div>
  );
}

function groupByCategory(contacts: Contact[]): [string, Contact[]][] {
  const map = new Map<string, Contact[]>();
  for (const contact of contacts) {
    const list = map.get(contact.category) ?? [];
    list.push(contact);
    map.set(contact.category, list);
  }
  return Array.from(map.entries());
}
