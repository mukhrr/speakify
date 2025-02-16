'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { fetchAccessToken } from 'hume';
import { Loader2 } from 'lucide-react';
import Chat from '@/components/exam/speaking/chat';
import { useExamPartsStatus } from '@/hooks/useExamPartsStatus';
import { useAuth } from '@/hooks/use-auth';
import { useExamResults } from '@/hooks/useExamResults';

export default function SpeakingPartPage() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const testId = params?.testId as string;
  const partNumber = parseInt(id) as 1 | 2 | 3;

  const { part1Completed, part2Completed } = useExamPartsStatus();
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const { currentTest } = useExamResults();

  useEffect(() => {
    if (!isAuthenticated) return;

    // Validate part number
    if (![1, 2, 3].includes(partNumber)) {
      router.push(`/exam/speaking/${testId}`);
      return;
    }

    // Check if previous parts are completed
    if (partNumber === 2 && !part1Completed) {
      router.push(`/exam/speaking/${testId}`);
      return;
    }

    if (partNumber === 3 && (!part1Completed || !part2Completed)) {
      router.push(`/exam/speaking/${testId}`);
      return;
    }

    // Initialize Hume
    const initialize = async () => {
      try {
        const token = await fetchAccessToken({
          apiKey: process.env.NEXT_PUBLIC_HUME_API_KEY!,
          secretKey: process.env.NEXT_PUBLIC_HUME_SECRET_KEY!,
        });
        setAccessToken(token);
      } catch (error) {
        console.error('Failed to initialize:', error);
        router.push(`/exam/speaking/${testId}`);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [
    partNumber,
    router,
    part1Completed,
    part2Completed,
    isAuthenticated,
    currentTest,
    testId,
  ]);

  const handlePartCompletion = () => {
    // Navigation based on part number
    if (partNumber === 3) {
      sessionStorage.removeItem('current-test-id');
      router.push('/dashboard/history');
    } else {
      router.push(`/exam/speaking/${testId}`);
    }
  };

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  // Return null if not authenticated (redirect is handled by useAuth)
  if (!isAuthenticated) {
    return null;
  }

  // Show loading state while initializing Hume
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Initializing exam environment...</span>
        </div>
      </div>
    );
  }

  if (!accessToken) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Failed to initialize exam environment. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Chat
        accessToken={accessToken}
        partNumber={partNumber}
        onCompleteAction={handlePartCompletion}
      />
    </div>
  );
}
