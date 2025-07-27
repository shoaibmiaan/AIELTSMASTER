'use client';

import { ReactNode } from 'react';
import { ThemeProvider, useTheme } from '@/components/ThemeProvider';
type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'error'
  | 'ghost'
  | 'link'
  | 'outline'
  | 'social';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  fullWidth = false,
  leftIcon,
  rightIcon,
}: ButtonProps) => {
  const { theme } = useTheme();

  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  const sizeClasses = {
    sm: 'text-sm px-3 py-2 rounded-md',
    md: 'text-base px-5 py-2.5 rounded-lg',
    lg: 'text-lg px-6 py-3 rounded-lg',
  };

  const variantClasses = {
    primary: `bg-primary text-white hover:bg-primary/90 shadow-md hover:shadow-lg
              focus:ring-primary/50 transition-all duration-200 transform hover:-translate-y-0.5`,

    secondary: `bg-secondary text-white hover:bg-secondary/90 shadow-md
                focus:ring-secondary/50 transition-all duration-200`,

    accent: `bg-accent text-white hover:bg-accent/90 shadow-md
             focus:ring-accent/50 transition-all duration-200`,

    success: `bg-success text-white hover:bg-success/90 shadow-md
              focus:ring-success/50 transition-all duration-200`,

    warning: `bg-warning text-white hover:bg-warning/90 shadow-md
              focus:ring-warning/50 transition-all duration-200`,

    error: `bg-error text-white hover:bg-error/90 shadow-md
            focus:ring-error/50 transition-all duration-200`,

    ghost: `bg-transparent text-foreground border border-transparent
            hover:bg-background/50 focus:ring-background/20`,

    link: `text-primary underline-offset-4 hover:underline
           focus:ring-primary/20 bg-transparent`,

    outline: `bg-transparent text-foreground border-2 border-primary
              hover:bg-primary/10 focus:ring-primary/30`,

    social: `bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300
             border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700
             focus:ring-gray-300/30 shadow-sm transition-all duration-150`
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};