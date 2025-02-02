'use client';

import { useEffect, useState } from 'react';
import { fetchAccessToken } from 'hume';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Chat from '@/components/exam/speaking/chat';
// import { Timer } from '@/components/exam/speaking/timer';

export default function SpeakingExamPage() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isExamStarted, setIsExamStarted] = useState(false);
  // const [examPart, setExamPart] = useState<1 | 2 | 3>(1);

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

      {!isExamStarted ? (
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Before You Start</h2>
          <ul className="mb-6 list-inside list-disc space-y-2">
            <li>Ensure you are in a quiet environment</li>
            <li>Check your microphone is working properly</li>
            <li>Have your ID ready (if required)</li>
            <li>The test will be recorded for assessment</li>
          </ul>
          <Button
            onClick={() => setIsExamStarted(true)}
            size="lg"
            className="w-full"
          >
            Start Speaking Test
          </Button>
        </Card>
      ) : (
        <div className={'flex grow flex-col'}>
          <Chat accessToken={accessToken} />
        </div>
      )}
    </div>
  );
}
