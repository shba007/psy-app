const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
  ],
  darkMode: 'class',
  theme: {
    fontSize: {
      '2xs': ['0.5rem', '0.5625rem'],
      xs: ['0.625rem', '0.75rem'],
      sm: ['0.75rem', '0.875rem'],
      base: ['1rem', '1.5rem'],
      lg: ['1.25rem', '1.5625rem'],
      xl: ['1.5rem', '1.875rem'],
      '2xl': ['2rem', '2.5rem'],
      '3xl': ['2.5rem', '3.125rem'],
    },
    fontFamily: {
      brand: ['Arkhip', 'sans-serif'],
      head: ['Source Sans Pro', 'sans-serif'],
      body: ['Roboto', 'sans-serif'],
    },
    fontWeight: {
      light: 300,
      regular: 400,
      'semi-bold': 500,
      bold: 600,
    },
    colors: {
      transparent: 'transparent',
      white: '#FFFFFF',
      light: {
        400: '#EDF0F5',
        500: '#C1C9D6',
        600: '#9AA5B8',
      },
      black: '#000000',
      dark: {
        400: '#1E1D2B',
        500: '#252736',
        600: '#2F3042',
      },
      primary: {
        400: '#3B82F6',
        500: '#2563EB',
        600: '#1E40AF',
      },
      secondary: {
        400: '#38BDF8',
        500: '#0EA5E9',
        600: '#0284C7',
      },
      success: {
        400: '#4ADE80',
        500: '#22C55E',
        600: '#15803D',
      },
      warning: {
        400: '#FACC15',
        500: '#EAB308',
        600: '#CA8A04',
      },
      alert: {
        400: '#E11D48',
        500: '#BE123C',
        600: '#9F1239',
      },
    },
    extend: {
      keyframes: {
        'spin-once': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(180deg)' },
        }
      },
      animation: {
        pop: 'ping 1s cubic-bezier(0, 0, 0.2, 1) 1',
        'spin-once': 'spin-once 300ms ease-in-out infinite',
      },
      aspectRatio: {
        card: '268 / 169',
      },
    },
  },
};
