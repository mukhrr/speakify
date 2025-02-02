'use client';

import { useEffect, useState } from 'react';
import { fetchAccessToken } from 'hume';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SpeakingParts } from '@/components/exam/speaking/speaking-parts';
// import { Timer } from '@/components/exam/speaking/timer';

export default function SpeakingExamPage() {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, this should be done server-side
    const initializeHume = async () => {
      try {
        const token = await fetchAccessToken({
          apiKey: process.env.NEXT_PUBLIC_HUME_API_KEY!,
          secretKey: process.env.NEXT_PUBLIC_HUME_SECRET_KEY!,
        });
        setAccessToken(token);
      } catch (error) {
        console.error('Failed to initialize Hume:', error);
      }
    };

    initializeHume();
  }, []);

  if (!accessToken) {
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
