// components/Layout.tsx
import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import LoadingSpinner from './LoadingSpinner';
import Breadcrumb from './Breadcrumb';
import { useAuth } from '@/context/AuthContext';
import BackgroundAnimation from './BackgroundAnimation';

export default function Layout({
  children,
  user,
  isLoading = false,
}: {
  children: ReactNode;
  user: any;
  isLoading?: boolean;
}) {
  const { user: authUser } = useAuth();
  const currentUser = user || authUser;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={`font-sans min-h-screen flex flex-col bg-background text-foreground relative overflow-hidden`}>
      {/* Enhanced Background Animation */}
      <BackgroundAnimation />

      {/* Content container with proper layering */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header user={currentUser} />

        <div className="container mx-auto px-4">
          <Breadcrumb userId={currentUser?.id} />
        </div>

        <main className="container mx-auto px-4 py-8 flex-grow">
          {/* Content card with enhanced glass effect */}
          <div className="bg-background/90 backdrop-blur-sm rounded-xl border border-border shadow-xl p-6 md:p-8">
            {children}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}