'use client';
import { ReactNode } from 'react';
import { useTheme } from '@/context/ThemeContext';
import Container from '@/components/Container';

export default function PageSection({
  children,
  title,
  className = '',
}: {
  children: ReactNode;
  title: string;
  className?: string;
}) {
  const { theme } = useTheme();

  return (
    <section className={`relative py-16 ${className}`}>
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className={`absolute top-1/4 left-0 w-72 h-72 rounded-full blur-[100px] opacity-20
            ${theme === 'light' ? 'bg-indigo_dye' : 'bg-persian_red'}`}></div>
        <div className={`absolute bottom-1/3 right-0 w-64 h-64 rounded-full blur-[100px] opacity-20
            ${theme === 'light' ? 'bg-persian_red' : 'bg-indigo_dye'}`}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Animated header with gradient underline */}
        <div className="text-center mb-16">
          <div className="relative inline-block">
            <h2 className={`text-4xl md:text-5xl font-bold tracking-tight ${
              theme === 'dark' ? 'text-lavender-blush' : 'text-slate-gray'
            } transition-all duration-700`}>
              {title}
            </h2>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-indigo_dye to-transparent opacity-80"></div>
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo_dye to-persian_red"></div>
          </div>

          {/* Glowing animated dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${theme === 'light' ? 'bg-indigo_dye' : 'bg-persian_red'} opacity-70`}
                style={{
                  animation: `pulse 2s infinite ${i * 0.3}s`,
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Content container with subtle border animation */}
        <Container className="relative p-0 overflow-hidden">
          <div className={`relative ${
            theme === 'dark' ? 'bg-slate-gray-800' : 'bg-lavender-blush'
          } backdrop-blur-sm rounded-3xl border ${
            theme === 'dark' ? 'border-slate-gray-600' : 'border-slate-gray-300'
          } p-8 shadow-xl overflow-hidden`}>
            {/* Shine effect on hover */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -inset-24 opacity-0 group-hover:opacity-100 transition-all duration-700">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full aspect-square bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-peach/10 via-transparent to-transparent"></div>
              </div>
            </div>

            {/* Actual content */}
            <div className="relative">
              {children}
            </div>
          </div>
        </Container>
      </div>

      {/* Add global animation for pulse effect */}
      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 0.7; }
        }
      `}</style>
    </section>
  );
}