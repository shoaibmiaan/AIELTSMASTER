/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  important: true, // Add this line
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'black': {
          DEFAULT: '#000000',
          100: '#000000',
          200: '#000000',
          300: '#000000',
          400: '#000000',
          500: '#000000',
          600: '#333333',
          700: '#666666',
          800: '#999999',
          900: '#cccccc'
        },
        'paynes-gray': {
          DEFAULT: '#586f7c',
          100: '#e9edef',
          200: '#d2dbe0',
          300: '#bcc9d0',
          400: '#a5b7c1',
          500: '#586f7c',
          600: '#4e6370',
          700: '#445764',
          800: '#394a57',
          900: '#2f3e4b'
        },
        'light-blue': {
          DEFAULT: '#b8dbd9',
          100: '#f0f9f9',
          200: '#e1f2f2',
          300: '#d2ecec',
          400: '#c3e5e5',
          500: '#b8dbd9',
          600: '#a6c5c3',
          700: '#94afad',
          800: '#829998',
          900: '#708382'
        },
        'ghost-white': {
          DEFAULT: '#f4f4f9',
          100: '#ffffff',
          200: '#fefefe',
          300: '#fdfdfe',
          400: '#fbfbfd',
          500: '#f4f4f9',
          600: '#ececf5',
          700: '#e5e5f0',
          800: '#dddeec',
          900: '#d6d7e7'
        },
        'dark-spring-green': {
          DEFAULT: '#04724d',
          100: '#ccf5e8',
          200: '#99ebd1',
          300: '#66e0ba',
          400: '#33d6a3',
          500: '#04724d',
          600: '#03603f',
          700: '#024e32',
          800: '#023c25',
          900: '#01170f'
        },
        // Status colors
        success: 'rgb(var(--color-success) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        error: 'rgb(var(--color-error) / <alpha-value>)',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
        'glass-dark': '0 8px 32px rgba(0, 0, 0, 0.15)',
        'card': '0 4px 12px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'backgroundMove': 'backgroundMove 10s linear infinite',
        'shine': 'shine 2s ease-out infinite',
      },
      keyframes: {
        backgroundMove: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '100% 100%' },
        },
        shine: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp'),
  ],
  safelist: [
    // Layout
    'flex', 'flex-col', 'flex-row', 'grid', 'block', 'inline-block',
    'relative', 'absolute', 'fixed', 'sticky', 'inset-0', 'top-0', 'bottom-0',
    'items-center', 'items-start', 'items-end', 'justify-center', 'justify-between', 'justify-end',
    'w-full', 'w-screen', 'h-full', 'h-screen', 'min-h-screen', 'max-w-md', 'max-w-lg', 'max-w-xl',
    'p-2', 'p-4', 'p-6', 'm-0', 'm-2', 'm-4', 'mb-2', 'mb-4', 'mb-6', 'mb-8', 'text-xs', 'text-sm', 'text-base',
    'border', 'border-0', 'border-2', 'rounded', 'rounded-md', 'rounded-lg', 'rounded-xl', 'shadow-sm', 'shadow-md',
    'animate-pulse', 'animate-backgroundMove', 'animate-shine',
    // New color classes
    'bg-paynes-gray', 'bg-paynes-gray-500', 'bg-paynes-gray-600',
    'bg-light-blue', 'bg-light-blue-500', 'bg-light-blue-400',
    'bg-ghost-white', 'bg-ghost-white-500',
    'bg-dark-spring-green', 'bg-dark-spring-green-500',
    'bg-black', 'bg-black-500',
    'text-paynes-gray', 'text-light-blue', 'text-ghost-white', 'text-dark-spring-green', 'text-black',
    'backdrop-filter', 'z-10', 'z-20', 'z-30', 'z-40', 'z-50',
  ],
};