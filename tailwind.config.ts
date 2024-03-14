/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'components/**/*.{vue,js,ts}',
    'layouts/**/*.vue',
    'pages/**/*.vue',
    'App.{js,ts,vue}',
    'app.{js,ts,vue}',
    'Error.{js,ts,vue}',
    'error.{js,ts,vue}',
    'content/**/*.md'
  ],
  darkMode: 'class',
  theme: {
    fontSize: {
      xs: ['0.75rem', '0.875rem'],
      sm: ['0.875rem', '1.0625rem'],
      base: ['1rem', '1.5rem'],
      lg: ['1.25rem', '1.5625rem'],
      xl: ['1.5rem', '1.875rem'],
      '2xl': ['2rem', '2.5rem'],
      '3xl': ['2.5rem', '3.125rem'],
      '4xl': ['3rem', '3.625rem'],
      '5xl': ['3.5rem', '4.1875rem'],
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
        400: '#181B1B',
        500: '#1D2020',
        600: '#232929',
      },
      primary: {
        400: '#8BDAD4',
        500: '#37B1A7',
        600: '#29706A',
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
  },
};
