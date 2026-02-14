import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Archivo', 'sans-serif'],
      },
      colors: {
        primary: '#FF6B6B',
        background: '#FFFEF0',
      },
      boxShadow: {
        'brutal': '8px 8px 0 0 #000',
        'brutal-sm': '4px 4px 0 0 #000',
        'brutal-lg': '12px 12px 0 0 #000',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};

export default config;