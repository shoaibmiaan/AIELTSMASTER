/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'indigo-dye': {
          DEFAULT: 'rgb(var(--color-indigo-dye-500) / <alpha-value>)',
          100: 'rgb(var(--color-indigo-dye-100) / <alpha-value>)',
          200: 'rgb(var(--color-indigo-dye-200) / <alpha-value>)',
          300: 'rgb(var(--color-indigo-dye-300) / <alpha-value>)',
          400: 'rgb(var(--color-indigo-dye-400) / <alpha-value>)',
          500: 'rgb(var(--color-indigo-dye-500) / <alpha-value>)',
          600: 'rgb(var(--color-indigo-dye-600) / <alpha-value>)',
          700: 'rgb(var(--color-indigo-dye-700) / <alpha-value>)',
          800: 'rgb(var(--color-indigo-dye-800) / <alpha-value>)',
          900: 'rgb(var(--color-indigo-dye-900) / <alpha-value>)',
        },
        'persian-red': {
          DEFAULT: 'rgb(var(--color-persian-red-500) / <alpha-value>)',
          100: 'rgb(var(--color-persian-red-100) / <alpha-value>)',
          200: 'rgb(var(--color-persian-red-200) / <alpha-value>)',
          300: 'rgb(var(--color-persian-red-300) / <alpha-value>)',
          400: 'rgb(var(--color-persian-red-400) / <alpha-value>)',
          500: 'rgb(var(--color-persian-red-500) / <alpha-value>)',
          600: 'rgb(var(--color-persian-red-600) / <alpha-value>)',
          700: 'rgb(var(--color-persian-red-700) / <alpha-value>)',
          800: 'rgb(var(--color-persian-red-800) / <alpha-value>)',
          900: 'rgb(var(--color-persian-red-900) / <alpha-value>)',
        },
        'slate-gray': {
          DEFAULT: 'rgb(var(--color-slate-gray-500) / <alpha-value>)',
          100: 'rgb(var(--color-slate-gray-100) / <alpha-value>)',
          200: 'rgb(var(--color-slate-gray-200) / <alpha-value>)',
          300: 'rgb(var(--color-slate-gray-300) / <alpha-value>)',
          400: 'rgb(var(--color-slate-gray-400) / <alpha-value>)',
          500: 'rgb(var(--color-slate-gray-500) / <alpha-value>)',
          600: 'rgb(var(--color-slate-gray-600) / <alpha-value>)',
          700: 'rgb(var(--color-slate-gray-700) / <alpha-value>)',
          800: 'rgb(var(--color-slate-gray-800) / <alpha-value>)',
          900: 'rgb(var(--color-slate-gray-900) / <alpha-value>)',
        },
        peach: {
          DEFAULT: 'rgb(var(--color-peach-500) / <alpha-value>)',
          100: 'rgb(var(--color-peach-100) / <alpha-value>)',
          200: 'rgb(var(--color-peach-200) / <alpha-value>)',
          300: 'rgb(var(--color-peach-300) / <alpha-value>)',
          400: 'rgb(var(--color-peach-400) / <alpha-value>)',
          500: 'rgb(var(--color-peach-500) / <alpha-value>)',
          600: 'rgb(var(--color-peach-600) / <alpha-value>)',
          700: 'rgb(var(--color-peach-700) / <alpha-value>)',
          800: 'rgb(var(--color-peach-800) / <alpha-value>)',
          900: 'rgb(var(--color-peach-900) / <alpha-value>)',
        },
        lavender: {
          100: 'rgb(var(--color-lavender-blush-100) / <alpha-value>)',
          200: 'rgb(var(--color-lavender-blush-200) / <alpha-value>)',
          300: 'rgb(var(--color-lavender-blush-300) / <alpha-value>)',
          400: 'rgb(var(--color-lavender-blush-400) / <alpha-value>)',
          500: 'rgb(var(--color-lavender-blush-500) / <alpha-value>)',
          600: 'rgb(var(--color-lavender-blush-600) / <alpha-value>)',
          700: 'rgb(var(--color-lavender-blush-700) / <alpha-value>)',
          800: 'rgb(var(--color-lavender-blush-800) / <alpha-value>)',
          900: 'rgb(var(--color-lavender-blush-900) / <alpha-value>)',
        },
        // Status colors
        success: 'rgb(var(--color-success) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        error: 'rgb(var(--color-error) / <alpha-value>)',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
        'glass-dark': '0 8px 32px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
  safelist: [
    // Layout
    'flex', 'flex-col', 'flex-row', 'grid', 'block', 'inline-block',
    // Positioning
    'relative', 'absolute', 'fixed', 'sticky', 'inset-0', 'top-0', 'bottom-0',
    // Alignment
    'items-center', 'items-start', 'items-end', 'justify-center', 'justify-between', 'justify-end',
    // Sizing
    'w-full', 'w-screen', 'h-full', 'h-screen', 'min-h-screen', 'max-w-md', 'max-w-lg', 'max-w-xl', 'max-w-2xl', 'max-w-3xl', 'max-w-4xl', 'max-w-5xl', 'max-w-6xl', 'max-w-7xl',
    // Spacing
    'p-2', 'p-4', 'p-6', 'p-8', 'px-4', 'px-6', 'px-8', 'py-2', 'py-4', 'py-6', 'py-8', 'py-12', 'py-16', 'm-0', 'm-2', 'm-4', 'mb-2', 'mb-4', 'mb-6', 'mb-8', 'mb-12', 'mb-16', 'mt-2', 'mt-4', 'mt-8', 'ml-2', 'mr-2',
    // Typography
    'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl', 'font-light', 'font-normal', 'font-medium', 'font-semibold', 'font-bold', 'text-center', 'text-left', 'text-right', 'text-justify',
    // Borders
    'border', 'border-0', 'border-2', 'rounded', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-3xl', 'rounded-full',
    // Effects
    'shadow-sm', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl', 'shadow-inner', 'shadow-none', 'opacity-0', 'opacity-50', 'opacity-100', 'backdrop-blur-sm', 'backdrop-blur-md', 'backdrop-blur-lg',
    // Animations
    'animate-pulse', 'animate-backgroundMove', 'animate-shine',
    // Backgrounds
    'bg-background', 'bg-foreground', 'bg-card', 'bg-card-hover', 'bg-primary', 'bg-accent',
    // New color backgrounds
    'bg-indigo_dye-500', 'bg-persian_red-500', 'bg-slate_gray-500', 'bg-peach-500', 'bg-lavender_blush-500',
    // Text colors
    'text-primary', 'text-accent', 'text-background', 'text-foreground',
    // New text colors
    'text-indigo_dye-500', 'text-persian_red-500', 'text-slate_gray-500', 'text-peach-500', 'text-lavender_blush-500',
    // Border colors
    'border-border', 'border-primary', 'border-accent',
    // Gradients
    'from-primary', 'to-accent', 'from-primary-light', 'to-accent-light', 'from-transparent', 'to-transparent',
    // Special classes
    'backdrop-filter', 'backdrop-blur-xs', 'backdrop-blur-sm', 'backdrop-blur-md', 'overflow-hidden', 'overflow-x-auto', 'z-10', 'z-20', 'z-30', 'z-40', 'z-50',
  ],
};
