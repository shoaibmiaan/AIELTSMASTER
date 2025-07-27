'use client';

import { ReactNode } from 'react';

type DropdownItemProps = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  icon?: ReactNode;
};

export const DropdownItem = ({
  children,
  onClick,
  className = '',
  icon,
}: DropdownItemProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-2 text-sm text-[rgb(var(--color-textPrimary))] hover:bg-[rgba(var(--color-hover),0.5)] ${className}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};