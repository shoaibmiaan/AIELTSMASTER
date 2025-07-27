'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

export default function PageNotFound() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [joke, setJoke] = useState('');

  // Dark mode initialization
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    if (savedMode === 'true' || (!savedMode && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Dark mode toggle
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    document.documentElement.classList.toggle('dark', newMode);
  };

  // Joke or fun fact generator
  useEffect(() => {
    const jokes = [
      "404: Not Found... Maybe it's on a coffee break?",
      'Oops! Looks like you found a hidden Easter egg. Are you a hacker?',
      '404: Page not found. But hey, at least you’re one step ahead!',
      'Well, that was a dead end. Like my career as a rockstar!',
      '404: Looks like this page has gone for a walk. Try another link!',
      "Oops! Page not found, but at least you're an explorer now!",
    ];
    setJoke(jokes[Math.floor(Math.random() * jokes.length)]);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-lavender_blush)] dark:bg-[var(--color-slate_gray)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-indigo_dye)]"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--color-lavender_blush)] dark:bg-[var(--color-slate_gray)] text-center p-6">
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Centered content */}
        <div className="mb-4 text-5xl font-bold text-[var(--color-peach)]">
          4
          <motion.span
            animate={{ rotate: [0, 20, 0, -20, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block"
          >
            0
          </motion.span>
          4
        </div>

        <motion.h2
          className="text-2xl font-bold mb-4 text-[var(--color-slate_gray)] dark:text-[var(--color-lavender_blush)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Oops! Page Not Found
        </motion.h2>

        <motion.p
          className="text-[var(--color-slate_gray)] dark:text-[var(--color-peach)] mb-4 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <span className="font-semibold text-[var(--color-peach)]">
            404 Error:
          </span>
          {/* Display random joke */}
          <span className="block mt-2 text-lg font-semibold text-[var(--color-peach)] bg-[var(--color-peach)/0.2] dark:bg-[var(--color-peach)/0.3] p-2 rounded-lg">
            {joke}
          </span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-6"
        >
          <button
            onClick={() => router.push('/')}
            className="w-full bg-[var(--color-indigo_dye)] hover:bg-[var(--color-indigo_dye)/0.8] text-[var(--color-lavender_blush)] font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Return to Home Page
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}