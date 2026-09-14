import { FontPairId, DEFAULT_FONT_PAIR } from './font-pairs';

export interface Category {
  id: string;
  name: string;
}

// "Tipo de dato" — la categoría primaria. Categoría (arriba) queda como
// clasificación secundaria, compartida entre los 3 tipos.
export type DataTypeId = 'contacto' | 'evento' | 'atraccion';

export const DATA_TYPE_OPTIONS: { id: DataTypeId; label: string }[] = [
  { id: 'contacto', label: 'Contactos' },
  { id: 'evento', label: 'Eventos' },
  { id: 'atraccion', label: 'Atracciones turísticas' },
];

export type ContactType = 'call' | 'whatsapp';

export interface Item {
  id: string;
  type: DataTypeId;
  categoryId: string;
  name: string;
  description?: string;
  phone?: string; // formato: +549XXXXXXXXXX — opcional si hay mapsUrl cargado
  contactType: ContactType; // define si el botón llama o abre WhatsApp (solo si hay phone)
  mapsUrl?: string; // link de Google Maps o dirección en texto (opcional)
  images?: string[]; // hasta 3 URLs
}

export interface AppConfig {
  enabledTypes: DataTypeId[];
}

export const DEFAULT_CONFIG: AppConfig = {
  enabledTypes: ['contacto'],
};

export interface Theme {
  primaryColor: string; // hex, ej. "#173330"
  accentColor: string; // hex, ej. "#b4823f"
  coverImageUrl: string; // URL de la imagen de portada del header
  logoUrl: string; // URL del logo circular, superpuesto entre portada y cuerpo
  hotelName: string;
  location: string; // ciudad/dirección del hotel — subtítulo y footer
  fontPair: FontPairId; // qué par de tipografías usa la landing pública
}

export const DEFAULT_THEME: Theme = {
  primaryColor: '#173330',
  accentColor: '#b4823f',
  coverImageUrl: '',
  logoUrl: '',
  hotelName: 'Mi Hotel',
  location: '',
  fontPair: DEFAULT_FONT_PAIR,
};
