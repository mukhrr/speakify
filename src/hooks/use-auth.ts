import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useCallback, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';

interface UseAuthOptions {
  redirectTo?: string;
  onAuthStateChange?: (isAuthenticated: boolean) => void;
  redirectIfAuthenticated?: boolean;
}

export function useAuth({
  redirectTo = '/auth/login',
  onAuthStateChange,
  redirectIfAuthenticated = false,
}: UseAuthOptions = {}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  const updateAuthState = useCallback(
    (session: Session | null) => {
      const authenticated = !!session;
      setIsAuthenticated(authenticated);
      onAuthStateChange?.(authenticated);

      // Store or remove user ID in session storage
      if (session?.user?.id) {
        localStorage.setItem('user-id', session.user.id);
        setUserId(session.user.id);
      } else {
        localStorage.removeItem('user-id');
        localStorage.removeItem('current-test-id');
        setUserId(null);
      }

      if (!authenticated && redirectTo) {
        const currentPath = window.location.pathname;
        router.push(`${redirectTo}?redirectTo=${currentPath}`);
      }

      if (authenticated && redirectIfAuthenticated) {
        router.push('/dashboard');
      }
    },
    [router, redirectTo, onAuthStateChange, redirectIfAuthenticated]
  );

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        updateAuthState(session);
      } catch (error) {
        console.error('Auth check failed:', error);
        if (redirectTo) {
          router.push(redirectTo);
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Initial auth check
    checkAuth();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      updateAuthState(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, redirectTo, updateAuthState]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push('/dashboard');
      } catch (error) {
        throw error;
      }
    },
    [router]
  );

  const signUp = useCallback(
    async (email: string, password: string) => {
      try {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        router.push('/auth/verify');
      } catch (error) {
        throw error;
      }
    },
    [router]
  );

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/');
    } catch (error) {
      throw error;
    }
  }, [router]);

  const signInWithGoogle = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }, []);

  return {
    isLoading,
    isAuthenticated,
    userId,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
  };
}
