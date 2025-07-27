// src/components/RouteGuard.tsx
import { useRouter } from 'next/router';
import { useEffect, ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext'; // Assuming you're using AuthContext for user state

interface RouteGuardProps {
  children: ReactNode;
}

export default function RouteGuard({ children }: RouteGuardProps) {
  const { user, isLoading } = useAuth(); // Assuming `user` holds the authentication status
  const router = useRouter();

  useEffect(() => {
    // Check if the route is protected and the user is not authenticated
    const isProtected = router.pathname.startsWith('/profile') || router.pathname.startsWith('/dashboard'); // Customize the protected routes
    if (isProtected && !user && !isLoading) {
      // Redirect to the login page if the user is not authenticated
      sessionStorage.setItem('redirectUrl', router.pathname); // Save the current route for redirect after login
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-lavender_blush)] dark:bg-[var(--color-slate_gray)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-indigo_dye)]"></div>
      </div>
    );
  }

  return <>{children}</>; // Render the children (protected route) if the user is authenticated
}
