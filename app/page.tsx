import { getContacts, getCategories, getTheme } from '@/lib/global-config';
import { getFontPairClassNames } from '@/app/fonts';
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
  const fontClasses = getFontPairClassNames(theme.fontPair);

  return (
    <div
      style={
        {
          '--brand-primary': theme.primaryColor,
          '--brand-accent': theme.accentColor,
        } as React.CSSProperties
      }
      className={`min-h-screen bg-white text-[#20241f] font-body ${fontClasses}`}
    >
      {/* Portada estilo perfil: banner de fondo + logo circular superpuesto */}
      <div className="relative">
        <div
          className="h-40 sm:h-56 w-full bg-white bg-cover bg-center"
          style={
            theme.coverImageUrl
              ? { backgroundImage: `url(${theme.coverImageUrl})` }
              : undefined
          }
        />
        {theme.logoUrl && (
          <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2">
            <img
              src={theme.logoUrl}
              alt={theme.hotelName}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white shadow-md bg-white"
            />
          </div>
        )}
      </div>

      {/* Título, antes en la portada, ahora acá como encabezado del cuerpo */}
      <div className="pt-16 sm:pt-20 pb-6 px-7 text-center">
        <h1 className="font-title text-2xl sm:text-3xl font-normal text-brand-primary">
          {theme.hotelName}
        </h1>
        <p className="mt-2 text-sm text-[#6b6858]">
          Teléfonos útiles durante tu estadía — tocá un contacto para llamar o escribir
        </p>
      </div>

      <main className="max-w-xl mx-auto pb-16">
        {sections.length === 0 && (
          <p className="text-center text-sm text-[#6b6858] mt-10">
            Todavía no se cargaron contactos.
          </p>
        )}

        {sections.map(({ category, items }) => (
          <section key={category} className="mt-10 px-7">
            <h2 className="font-title flex items-baseline gap-2.5 text-lg text-brand-primary m-0">
              {category}
              <span className="flex-1 h-px bg-[#dcd2ba] -translate-y-1" />
            </h2>
            <span className="block text-xs text-[#6b6858] mb-3.5">
              {items.length} contacto{items.length !== 1 ? 's' : ''}
            </span>

            <ul className="list-none m-0 p-0">
              {items.map((contact) => (
                <li key={contact.id} className="border-b border-[#dcd2ba] last:border-none">
                  {/* En mobile: nombre arriba, botones abajo (columna). Desde sm: una sola fila. */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 py-3.5">
                    <div className="flex-1">
                      <span className="text-base">{contact.name}</span>
                      {contact.role && (
                        <span className="block text-xs text-[#6b6858] mt-0.5">
                          {contact.role}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap sm:shrink-0">
                      {contact.mapsUrl && (
                        <a
                          href={mapsHref(contact.mapsUrl)}
                          target="_blank"
                          rel="noopener"
                          className="flex items-center gap-1.5 text-sm whitespace-nowrap border border-[#dcd2ba] text-brand-primary rounded-full px-3.5 py-1.5"
                        >
                          <MapPinIcon />
                          Ver ubicación
                        </a>
                      )}

                      {contact.phone && (
                        <a
                          href={contactHref(contact)}
                          target={contact.contactType === 'whatsapp' ? '_blank' : undefined}
                          rel={contact.contactType === 'whatsapp' ? 'noopener' : undefined}
                          className="text-sm whitespace-nowrap border border-brand-accent text-brand-accent rounded-full px-3.5 py-1.5"
                        >
                          {contact.contactType === 'whatsapp' ? 'WhatsApp' : contact.phone}
                        </a>
                      )}
                    </div>
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
  const phone = contact.phone as string; // solo se llama cuando contact.phone existe
  if (contact.contactType === 'whatsapp') {
    const digits = phone.replace(/\D/g, '');
    return `https://wa.me/${digits}`;
  }
  return `tel:${phone}`;
}

// Acepta tanto un link completo de Google Maps como una dirección en texto
// plano ("Congreso 110, Victoria, Entre Ríos") — así el admin no depende de
// que el hotel sepa generar un link compartible, solo escribe la dirección.
function mapsHref(value: string): string {
  if (/^https?:\/\//i.test(value)) return value;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(value)}`;
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
