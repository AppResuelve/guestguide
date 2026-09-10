import {
  Playfair_Display,
  Lora,
  Poppins,
  Inter,
  Fraunces,
  Karla,
  Space_Grotesk,
  Work_Sans,
  Bitter,
  Nunito_Sans,
  DM_Sans,
} from 'next/font/google';
import { FontPairId } from '@/lib/font-pairs';

// Todos los fonts de "título" comparten el mismo nombre de variable CSS
// (--font-title), y todos los de "cuerpo" comparten --font-body. Así, sea
// cual sea el par elegido, la landing solo tiene que aplicar esas dos
// variables genéricas — el valor real detrás cambia según qué clase (la del
// font seleccionado) esté presente en el árbol.
const playfairDisplay = Playfair_Display({ subsets: ['latin'], variable: '--font-title', display: 'swap' });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--font-title', display: 'swap' });
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-title', display: 'swap' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-title', display: 'swap' });
const bitter = Bitter({ subsets: ['latin'], variable: '--font-title', display: 'swap' });

const lora = Lora({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const karla = Karla({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const workSans = Work_Sans({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const nunitoSans = Nunito_Sans({ subsets: ['latin'], variable: '--font-body', display: 'swap' });

// Fuente del panel de admin (no de la landing pública).
export const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-admin', display: 'swap' });

const PAIRS: Record<FontPairId, { title: { variable: string }; body: { variable: string } }> = {
  clasico: { title: playfairDisplay, body: lora },
  moderno: { title: poppins, body: inter },
  editorial: { title: fraunces, body: karla },
  minimal: { title: spaceGrotesk, body: workSans },
  rustico: { title: bitter, body: nunitoSans },
};

export function getFontPairClassNames(id: FontPairId): string {
  const pair = PAIRS[id] ?? PAIRS.clasico;
  return `${pair.title.variable} ${pair.body.variable}`;
}
