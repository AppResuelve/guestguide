// Solo metadata (sin cargar las fuentes) — esto lo usa el <select> del admin,
// que es un client component y no necesita next/font/google.
export const FONT_PAIR_OPTIONS = [
  { id: 'clasico', label: 'Clásico cálido — Playfair Display + Lora' },
  { id: 'moderno', label: 'Moderno geométrico — Poppins + Inter' },
  { id: 'editorial', label: 'Editorial — Fraunces + Karla' },
  { id: 'minimal', label: 'Minimal — Space Grotesk + Work Sans' },
  { id: 'rustico', label: 'Cálido rústico — Bitter + Nunito Sans' },
] as const;

export type FontPairId = (typeof FONT_PAIR_OPTIONS)[number]['id'];
export const DEFAULT_FONT_PAIR: FontPairId = 'clasico';
