
import { useEffect, useState } from 'react';

export default function LoadingSpinner({ isLoading }: { isLoading: boolean }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div
        className={`rounded-full h-12 w-12 border-t-2 border-b-2 border-primary ${
          isVisible ? 'animate-spin' : ''
        }`}
      ></div>
    </div>
  );
}
