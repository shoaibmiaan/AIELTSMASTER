'use client';
import { ReactNode } from 'react';
import Container from '@/components/Container';
import { useTheme } from '@/components/ThemeProvider';  // Updated import
import Link from 'next/link';

export default function AuthContainer({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
}) {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Container className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className={`w-12 h-12 ${
              theme === 'dark' ? 'bg-indigo-dye' : 'bg-indigo-dye'
            } rounded-lg flex items-center justify-center`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-lavender-blush"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          {subtitle && (
            <p className={`mt-2 ${
              theme === 'dark' ? 'text-peach' : 'text-slate-gray'
            }`}>
              {subtitle}
            </p>
          )}
        </div>

        {children}

        <div className="mt-6 text-center text-sm">
          <p className={theme === 'dark' ? 'text-lavender-blush' : 'text-slate-gray'}>
            © {new Date().getFullYear()} IELTSMaster. All rights reserved.
          </p>
          <p className={`mt-1 text-xs ${
            theme === 'dark' ? 'text-peach' : 'text-slate-gray'
          }`}>
            Secure & encrypted authentication
          </p>
        </div>
      </Container>
    </div>
  );
}
