import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // --- INICIO DE LA SECCIÓN DE BRANDING ---
      colors: {
        crucianelli: {
          red: '#D71920',    // El rojo principal de la marca
          dark: '#212121',   // Un gris oscuro para texto principal
          gray: '#5a5a5a',   // Un gris secundario
          light: '#f5f5f5',  // Un gris muy claro para fondos
        }
      },
      // --- FIN DE LA SECCIÓN DE BRANDING ---
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
export default config
