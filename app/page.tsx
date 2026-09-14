import { getItems, getCategories, getTheme, getConfig } from '@/lib/global-config';
import { getFontPairClassNames } from '@/app/fonts';
import PublicGuide from '@/components/public/PublicGuide';

// Sin esto, Next.js intenta pre-renderizar esta página como estática en el
// build (y falla si todavía no hay GLOBAL_CONFIG configurada). Forzamos
// renderizado dinámico: así corre en cada request y los cambios guardados
// desde /admin se ven reflejados sin necesidad de un nuevo deploy.
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [items, categories, theme, config] = await Promise.all([
    getItems(),
    getCategories(),
    getTheme(),
    getConfig(),
  ]);

  const fontClasses = getFontPairClassNames(theme.fontPair);
  const subtitle = theme.location
    ? `Todo lo que necesitás para tu estadía en ${theme.location}`
    : 'Todo lo que necesitás para tu estadía';

  return (
    <div
      style={
        {
          '--brand-primary': theme.primaryColor,
          '--brand-accent': theme.accentColor,
        } as React.CSSProperties
      }
      className={`min-h-screen bg-white text-[#20241f] font-body flex flex-col ${fontClasses}`}
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

      {/* Título y subtítulo, antes en la portada, ahora en el cuerpo */}
      <div className="pt-16 sm:pt-20 pb-6 px-7 text-center">
        <h1 className="font-title text-2xl sm:text-3xl font-normal text-brand-primary">
          {theme.hotelName}
        </h1>
        <p className="mt-2 text-sm text-[#6b6858]">{subtitle}</p>
      </div>

      <div className="flex-1">
        <PublicGuide items={items} categories={categories} config={config} />
      </div>

      <footer className="text-center py-8 px-7 border-t border-[#dcd2ba] mt-4">
        {(theme.hotelName || theme.location) && (
          <p className="text-sm text-[#6b6858]">
            {theme.hotelName}
            {theme.hotelName && theme.location ? ' — ' : ''}
            {theme.location}
          </p>
        )}
        <p className="text-xs text-[#6b6858] mt-2">Desarrollado por AppResuelve</p>
      </footer>
    </div>
  );
}
