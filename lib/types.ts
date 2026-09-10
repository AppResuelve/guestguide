import { FontPairId, DEFAULT_FONT_PAIR } from './font-pairs';

export interface Category {
  id: string;
  name: string;
}

export type ContactType = 'call' | 'whatsapp';

export interface Contact {
  id: string;
  categoryId: string;
  name: string;
  role?: string;
  phone?: string; // formato: +549XXXXXXXXXX — opcional si hay mapsUrl cargado
  contactType: ContactType; // define si el botón llama o abre WhatsApp
  mapsUrl?: string; // link de Google Maps (opcional) para el ícono de ubicación
}

export interface Theme {
  primaryColor: string; // hex, ej. "#173330"
  accentColor: string; // hex, ej. "#b4823f"
  coverImageUrl: string; // URL de la imagen de portada del header
  logoUrl: string; // URL del logo circular, superpuesto entre portada y cuerpo
  hotelName: string;
  fontPair: FontPairId; // qué par de tipografías usa la landing pública
}

export const DEFAULT_THEME: Theme = {
  primaryColor: '#173330',
  accentColor: '#b4823f',
  coverImageUrl: '',
  logoUrl: '',
  hotelName: 'Mi Hotel',
  fontPair: DEFAULT_FONT_PAIR,
};
