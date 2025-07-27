import React from 'react';
import { useTheme } from '@/context/ThemeContext';

interface CheckboxProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  ariaLabel?: string;
  disabled?: boolean;
  className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  ariaLabel,
  disabled = false,
  className = '',
}) => {
  const { colors } = useTheme();

  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className={`h-4 w-4 rounded border-[rgb(var(--color-${colors.border}))] text-[rgb(var(--color-${colors.primary}))] focus:ring-[rgb(var(--color-${colors.primary}))] disabled:opacity-50 transition-colors duration-200 ${className}`}
      aria-label={ariaLabel}
      aria-disabled={disabled}
    />
  );
};

export default Checkbox;
