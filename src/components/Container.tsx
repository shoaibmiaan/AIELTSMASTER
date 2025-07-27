'use client';
import { ReactNode } from 'react';
import { useTheme } from '@/context/ThemeContext';

export default function Container({
  children,
  className = "",
  onClick,
  hoverable = true,
  ...props
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}) {
  const { theme } = useTheme();

  return (
    <div
      {...props}
      onClick={onClick}
      className={`
        relative
        bg-card
        border border-border
        rounded-xl
        overflow-hidden
        transition-all duration-300
        ${hoverable && 'hover:shadow-lg hover:-translate-y-1 hover:border-indigo-dye-500/30 dark:hover:border-indigo-dye-700/30'}
        group
        ${className}
      `}
    >
      {/* Subtle shine effect on hover */}
      {hoverable && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="
            absolute -left-[100%] -top-[100%] w-[300%] h-[300%]
            bg-gradient-to-r from-transparent via-peach-500/20 to-transparent
            opacity-0 group-hover:opacity-100
            transition-opacity duration-500
            rotate-[25deg]
          "></div>
        </div>
      )}

      {/* Inner padding with subtle top accent */}
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-dye-500 to-persian-red-500"></div>
        
        <div className="pt-5 pb-4 px-5">
          {children}
        </div>
      </div>
    </div>
  );
}