import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router'; // Use 'next/router' for proper routing
import { supabase } from '@/lib/supabase';

interface Profile {
  role: string;
  full_name: string;
  avatar_url?: string;
}

export function useAuthProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState('');
  const [pendingRequests, setPendingRequests] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Added error state

  const loadProfile = useCallback(async () => {
    const publicRoutes = ['/login', '/signup', '/reset-password'];
    const currentPath = router.pathname;

    try {
      // Get session data
      const { data: { session } } = await supabase.auth.getSession();

      if (!session && !publicRoutes.includes(currentPath)) {
        router.replace('/login');
        return;
      }

      if (session) {
        // Fetch user data
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          if (!publicRoutes.includes(currentPath)) router.replace('/login');
          setLoading(false);
          return;
        }

        // Fetch profile data
        const { data: p, error } = await supabase
          .from('profiles')
          .select('role, full_name, avatar_url')
          .eq('id', user.id)
          .single();

        if (error || !p) {
          setError('Profile load failed: ' + (error?.message || 'Unknown error'));
          router.replace('/login');
          return;
        }

        setProfile(p);
        setRole(p.role);

        if (p.role === 'admin') {
          // Count pending teacher requests for admins
          const { count } = await supabase
            .from('teacher_requests')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending');
          setPendingRequests(count || 0);
        }
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred while loading profile');
      router.replace('/login');
    } finally {
      setLoading(false); // Ensure loading is turned off after the process
    }
  }, [router]);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      router.replace('/login');
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return { profile, role, pendingRequests, loading, error, logout };
}
