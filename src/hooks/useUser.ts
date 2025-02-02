import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

interface User {
  id: string;
  email?: string;
  name?: string;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const initUser = async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();
        if (authUser) {
          setUser({
            id: authUser.id,
            email: authUser.email,
            name: authUser.user_metadata?.name,
          });
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    initUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}
