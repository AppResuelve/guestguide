export interface Contact {
  id: string;
  category: string;
  name: string;
  role?: string;
  phone: string; // formato: +549XXXXXXXXXX (para el link tel:)
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
