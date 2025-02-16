'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { useExamResults } from '@/hooks/useExamResults';
import { useAuth } from '@/hooks/use-auth';

export default function SpeakingExamRedirectPage() {
  const router = useRouter();
  const { startNewTest } = useExamResults();
  const { isLoading: authLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    const initializeTest = async () => {
      if (!isAuthenticated) return;

      try {
        const testId = await startNewTest();
        router.push(`/exam/speaking/${testId}`);
      } catch (error) {
        console.error('Failed to start new test:', error);
      }
    };

    initializeTest();
  }, [isAuthenticated, router, startNewTest]);

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Preparing your speaking test...</span>
      </div>
    </div>
  );
}
