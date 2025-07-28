import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import LoadingSpinner from './LoadingSpinner';
import Breadcrumb from './Breadcrumb';
import { useAuth } from '@/context/AuthContext';
import { ThemeProvider } from '@/components/ThemeProvider';

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
    return <LoadingSpinner />;
  }

  return (
    <ThemeProvider>
      <div className={`font-sans min-h-screen transition-colors duration-200 flex flex-col bg-background text-foreground`}>
        <Header user={currentUser} />
        <div className="container mx-auto px-4">
          <Breadcrumb userId={currentUser?.id} />
        </div>
        <main className="container mx-auto px-4 py-4 flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}