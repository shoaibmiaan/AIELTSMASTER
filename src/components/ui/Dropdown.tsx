'use client';

import { ReactNode, useRef, useState } from 'react';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { useTheme } from '@/context/ThemeContext';

type DropdownProps = {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'left' | 'right';
  className?: string;
};

export const Dropdown = ({
  trigger,
  children,
  align = 'left',
  className = '',
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      {isOpen && (
        <div
          className={`absolute mt-2 w-48 rounded-md shadow-lg bg-[rgb(var(--color-background))] ring-1 ring-[rgb(var(--color-border))] ring-opacity-5 z-50 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          <div className="py-1">{children}</div>
        </div>
      )}
    </div>
  );
};