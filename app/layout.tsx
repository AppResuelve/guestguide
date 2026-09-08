import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Guía del Huésped',
  description: 'Teléfonos útiles durante tu estadía',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
