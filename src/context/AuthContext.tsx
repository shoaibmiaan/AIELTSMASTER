// context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/router';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: any;
  session: Session | null;
  isLoading: boolean;
  signupWithEmail: (email: string, password: string) => Promise<void>;
  signupWithGoogle: () => Promise<void>;
  signupWithFacebook: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  createProfile: (user: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signupWithEmail: async () => {},
  signupWithGoogle: async () => {},
  signupWithFacebook: async () => {},
  login: async () => {},
  logout: async () => {},
  createProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check active session and set user
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    };

    checkSession();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
        
        // Create profile if it's a new signup
        if (event === 'SIGNED_IN' && session?.user) {
          await createProfile(session.user);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Create user profile in profiles table
  const createProfile = async (user: any) => {
    if (!user) return;

    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (fetchError && !existingProfile) {
      const { error } = await supabase.from('profiles').insert([
        {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email.split('@')[0],
          role: 'user',
          status: 'active',
          language_preference: 'en',
          current_streak: 0,
          longest_streak: 0,
          saved_tests: [],
          bookmarked_content: [],
        }
      ]);

      if (error) {
        console.error('Profile creation error:', error);
      }
    }
  };

  // Email signup
  const signupWithEmail = async (email: string, password: string) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: email.split('@')[0],
        }
      }
    });

    if (error) {
      setIsLoading(false);
      throw error;
    }
    
    if (data.user) {
      await createProfile(data.user);
    }
    
    return data;
  };

  // Google signup
  const signupWithGoogle = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      }
    });

    if (error) {
      setIsLoading(false);
      throw error;
    }
  };

  // Facebook signup
  const signupWithFacebook = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      }
    });

    if (error) {
      setIsLoading(false);
      throw error;
    }
  };

  // Login
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setIsLoading(false);
      throw error;
    }

    return data;
  };

  // Logout
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session,
      isLoading, 
      signupWithEmail,
      signupWithGoogle,
      signupWithFacebook,
      login, 
      logout,
      createProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);