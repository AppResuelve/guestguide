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
  phone: string; // formato: +549XXXXXXXXXX
  contactType: ContactType; // define si el botón llama o abre WhatsApp
  mapsUrl?: string; // link de Google Maps (opcional) para el ícono de ubicación
}

export interface Theme {
  primaryColor: string; // hex, ej. "#173330"
  accentColor: string; // hex, ej. "#b4823f"
  coverImageUrl: string; // URL de la imagen de portada del header
  hotelName: string;
}

export const DEFAULT_THEME: Theme = {
  primaryColor: '#173330',
  accentColor: '#b4823f',
  coverImageUrl: '',
  hotelName: 'Mi Hotel',
};
