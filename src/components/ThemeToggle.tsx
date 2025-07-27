'use client';

import { useTheme } from '@/context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-card border border-border transition-colors duration-200"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <span className="text-peach-400 text-lg">☀️</span>
      ) : (
        <span className="text-slate-gray-700 text-lg">🌙</span>
      )}
    </button>
  );
}
