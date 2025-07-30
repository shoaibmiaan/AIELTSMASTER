import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/router';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  signupWithEmail: (email: string, password: string, fullName?: string) => Promise<void>;
  signupWithGoogle: () => Promise<void>;
  signupWithFacebook: () => Promise<void>;
  signupWithApple: () => Promise<void>;
  signupWithX: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithPhone: (phone: string) => Promise<{ success: boolean }>;
  verifyPhoneOTP: (phone: string, token: string) => Promise<void>;
  resendOTP: (phone: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  error: null,
  clearError: () => {},
  signupWithEmail: async () => {},
  signupWithGoogle: async () => {},
  signupWithFacebook: async () => {},
  signupWithApple: async () => {},
  signupWithX: async () => {},
  login: async () => {},
  loginWithPhone: async () => ({ success: false }),
  verifyPhoneOTP: async () => {},
  resendOTP: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const clearError = () => setError(null);

  useEffect(() => {
    // Initialize auth state
    const initializeAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        handleAuthError(error);
      } else {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) await handleNewUser(session.user);
      }
      setIsLoading(false);
    };

    initializeAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);

        if (event === 'SIGNED_IN' && session?.user) {
          await handleNewUser(session.user);
          const redirectUrl = sessionStorage.getItem('redirectUrl') || '/dashboard';
          sessionStorage.removeItem('redirectUrl');
          router.push(redirectUrl);
        }

        if (event === 'SIGNED_OUT') {
          router.push('/login');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  const handleAuthError = (error: any) => {
    console.error('Auth error:', error);
    setError(error.message || 'Authentication error occurred');
  };

  const handleNewUser = async (user: User) => {
    /**
     * Insert a minimal row into the `profiles` table if it doesn't already exist.  In some
     * deployments the table schema may differ from what we expect, so only supply
     * universally present fields to avoid "Database error saving new user".  Additional
     * properties like role or streaks can be added via database triggers or later updates.
     */
    try {
      const { error } = await supabase.from('profiles').upsert(
        {
          id: user.id,
          email: user.email,
          phone: user.phone,
          full_name:
            user.user_metadata?.full_name ||
            (user.email ? user.email.split('@')[0] : `user-${user.phone?.slice(-4) || 'new'}`),
        },
        {
          onConflict: 'id',
        },
      );

      if (error) {
        // Surface errors to the caller without throwing, so sign‑up continues gracefully
        console.error('Error upserting profile:', error);
      }
    } catch (err) {
      // Swallow any unexpected errors here; handleAuthError will update global error state
      handleAuthError(err);
    }
  };

  // Email signup
  const signupWithEmail = async (email: string, password: string, fullName?: string) => {
    setIsLoading(true);
    clearError();
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            full_name: fullName || email.split('@')[0],
          }
        }
      });

      if (error) throw error;
      if (data.user) await handleNewUser(data.user);
      return data;
    } catch (err) {
      handleAuthError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Google OAuth
  const signupWithGoogle = async () => {
    setIsLoading(true);
    clearError();
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });
      if (error) throw error;
    } catch (err) {
      handleAuthError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Facebook OAuth
  const signupWithFacebook = async () => {
    setIsLoading(true);
    clearError();
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: 'email'
        }
      });
      if (error) throw error;
    } catch (err) {
      handleAuthError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Apple OAuth
  const signupWithApple = async () => {
    setIsLoading(true);
    clearError();
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
    } catch (err) {
      handleAuthError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // X (Twitter) OAuth
  const signupWithX = async () => {
    setIsLoading(true);
    clearError();
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
    } catch (err) {
      handleAuthError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Email/password login
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    clearError();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      return data;
    } catch (err) {
      handleAuthError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Phone login - sends OTP
  const loginWithPhone = async (phone: string) => {
    setIsLoading(true);
    clearError();
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          shouldCreateUser: true,
          channel: 'sms',
          data: {
            full_name: `user-${phone.slice(-4)}`
          }
        }
      });
      if (error) throw error;
      return { success: true };
    } catch (err) {
      handleAuthError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Verify phone OTP
  const verifyPhoneOTP = async (phone: string, token: string) => {
    setIsLoading(true);
    clearError();
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms',
      });
      if (error) throw error;
      if (data.user) await handleNewUser(data.user);
      return data;
    } catch (err) {
      handleAuthError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const resendOTP = async (phone: string) => {
    setIsLoading(true);
    clearError();
    try {
      const { error } = await supabase.auth.resend({
        type: 'sms',
        phone,
      });
      if (error) throw error;
      return { success: true };
    } catch (err) {
      handleAuthError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      router.push('/login');
    } catch (err) {
      handleAuthError(err);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isLoading,
      error,
      clearError,
      signupWithEmail,
      signupWithGoogle,
      signupWithFacebook,
      signupWithApple,
      signupWithX,
      login,
      loginWithPhone,
      verifyPhoneOTP,
      resendOTP,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);