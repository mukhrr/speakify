'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export function AuthHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Handle the hash fragment on initial load
    const handleHashFragment = async () => {
      try {
        if (window.location.hash) {
          const hashParams = new URLSearchParams(
            window.location.hash.substring(1)
          );

          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');

          if (accessToken && refreshToken) {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (error) throw error;

            // Clear the hash fragment
            window.history.replaceState(
              null,
              document.title,
              window.location.pathname + window.location.search
            );

            // Check if there's a redirect URL in the query params
            const redirectTo = searchParams.get('redirectTo');
            if (
              redirectTo &&
              (redirectTo.startsWith('/') || redirectTo.startsWith('/exam'))
            ) {
              router.replace(redirectTo);
            } else {
              router.replace('/');
            }
          }
        }

        // Check if we're on the login page and already authenticated
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session && window.location.pathname.includes('/auth/login')) {
          const redirectTo = searchParams.get('redirectTo');
          if (
            redirectTo &&
            (redirectTo.startsWith('/') || redirectTo.startsWith('/exam'))
          ) {
            router.replace(redirectTo);
          } else {
            router.replace('/');
          }
        }
      } catch (error) {
        console.error('Error handling authentication:', error);
      }
    };

    handleHashFragment();
  }, [router, searchParams]);

  return null;
}
