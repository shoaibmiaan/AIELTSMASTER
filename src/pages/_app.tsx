import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from '@/context/AuthContext';  // Make sure to import useAuth here
import Layout from '@/components/Layout';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ThemeProvider } from '@/components/ThemeProvider';

const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/reset-password',
  '/forgot-password',
  '/thank-you',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
];

const PROTECTED_ROUTES = [
  '/profile',
  '/dashboard',
  '/practice',
  '/test',
  '/writing-analysis',
  '/speaking-practice',
  '/premium',
  '/lessons',
  '/progress',
  '/vocabulary',
  '/leaderboard',
  '/ai-tools',
];

function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();  // Now correctly imported
  const [routeChecked, setRouteChecked] = useState(false);

  useEffect(() => {
    if (!router.isReady || isLoading) return;

    const currentPath = router.pathname;
    const isProtected = PROTECTED_ROUTES.some((path) =>
      currentPath.startsWith(path)
    );
    const isPublic = PUBLIC_ROUTES.some((path) => currentPath.startsWith(path));

    if (isProtected && !user) {
      sessionStorage.setItem('redirectUrl', currentPath);
      router.push('/login');
      return;
    }

    if (!isPublic && !isProtected && !user) {
      sessionStorage.setItem('redirectUrl', currentPath);
      router.push('/login');
      return;
    }

    setRouteChecked(true);
  }, [user, isLoading, router, router.isReady]);

  if (isLoading || !routeChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function AppWrapper({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const barePages = [
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/thank-you',
  ];

  const useLayout = !barePages.includes(router.pathname);

  return (
    <ThemeProvider>
      <AuthProvider>
        <ErrorBoundary>
          <RouteGuard>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: 'rgb(var(--color-card))',
                  color: 'rgb(var(--color-foreground))',
                  border: '1px solid rgb(var(--color-border))',
                },
                success: {
                  iconTheme: {
                    primary: 'rgb(var(--color-success))',
                    secondary: 'rgb(var(--color-card))',
                  },
                },
                error: {
                  iconTheme: {
                    primary: 'rgb(var(--color-error))',
                    secondary: 'rgb(var(--color-card))',
                  },
                },
              }}
            />
            {useLayout ? (
              <Layout user={pageProps.user}>
                <Component {...pageProps} />
              </Layout>
            ) : (
              <Component {...pageProps} />
            )}
          </RouteGuard>
        </ErrorBoundary>
      </AuthProvider>
    </ThemeProvider>
  );
}
