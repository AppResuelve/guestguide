import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'var(--brand-primary)',
          accent: 'var(--brand-accent)',
        },
      },
      fontFamily: {
        title: ['var(--font-title)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        admin: ['var(--font-admin)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
