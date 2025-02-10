'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchAccessToken } from 'hume';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SpeakingParts } from '@/components/exam/speaking/speaking-parts';
// import { Timer } from '@/components/exam/speaking/timer';

import { supabase } from '@/lib/supabase/client';

export default function SpeakingExamPage() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const initializeHume = async () => {
      const token = await fetchAccessToken({
        apiKey: process.env.NEXT_PUBLIC_HUME_API_KEY!,
        secretKey: process.env.NEXT_PUBLIC_HUME_SECRET_KEY!,
      });
      setAccessToken(token);
    };

    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          router.push('/auth/login');
          return;
        }

        initializeHume();
      } catch (error) {
        console.error('Auth check failed:', error);
        setError('Authentication failed. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading exam environment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold text-red-500">Error</h2>
          <p className="mb-4 text-gray-600">{error}</p>
          <Button onClick={() => router.push('/')}>Return to Home</Button>
        </Card>
      </div>
    );
  }

  if (!accessToken) {
    return (
      <div className="container mx-auto py-8">
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Not Ready</h2>
          <p className="mb-4 text-gray-600">
            The exam environment is not properly initialized. Please try again.
          </p>
          <Button onClick={() => router.push('/')}>Return to Home</Button>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading exam environment...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold">IELTS Speaking Test</h1>
        <p className="text-gray-600">
          This is a simulated IELTS speaking test using AI technology. The test
          is divided into three parts and will take approximately 11-14 minutes.
        </p>
      </div>

      <SpeakingParts accessToken={accessToken} />
    </div>
  );
}
