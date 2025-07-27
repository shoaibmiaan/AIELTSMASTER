import { useTheme } from '@/context/ThemeContext';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = '', ...props }: CardProps) => {
  return (
    <div
      className={`rounded-2xl shadow-lg p-6 bg-card ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({
  children,
  className = '',
  ...props
}: CardProps) => {
  return (
    <div
      className={`mb-4 pb-3 border-b border-border ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardContent = ({
  children,
  className = '',
  ...props
}: CardProps) => {
  return (
    <div
      className={`text-foreground ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};