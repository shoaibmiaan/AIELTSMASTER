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
    'inline-flex items-center justify-center font-roboto font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed border border-transparent';

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 rounded-md',
    md: 'text-sm px-4 py-2 rounded-lg',
    lg: 'text-base px-5 py-2.5 rounded-lg',
  };

  const variantClasses = {
    primary: `text-primary border border-primary/30 hover:border-primary/50 hover:bg-primary/10 focus:ring-primary/50 transition-colors duration-200`,
    secondary: `text-secondary border border-secondary/30 hover:border-secondary/50 hover:bg-secondary/10 focus:ring-secondary/50 transition-colors duration-200`,
    accent: `text-accent border border-accent/30 hover:border-accent/50 hover:bg-accent/10 focus:ring-accent/50 transition-colors duration-200`,
    success: `text-success border border-success/30 hover:border-success/50 hover:bg-success/10 focus:ring-success/50 transition-colors duration-200`,
    warning: `text-warning border border-warning/30 hover:border-warning/50 hover:bg-warning/10 focus:ring-warning/50 transition-colors duration-200`,
    error: `text-error border border-error/30 hover:border-error/50 hover:bg-error/10 focus:ring-error/50 transition-colors duration-200`,
    ghost: `text-foreground hover:bg-background/10`,
    link: `text-primary hover:underline underline-offset-4 bg-transparent border-0`,
    outline: `text-foreground border border-border hover:border-primary/50 hover:text-primary hover:bg-primary/5`,
    social: `text-foreground/80 border border-border hover:bg-background/20 focus:ring-accent/30`,
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