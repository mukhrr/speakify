'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { useExamResults } from '@/hooks/useExamResults';
import { useAuth } from '@/hooks/use-auth';

export default function SpeakingExamRedirectPage() {
  const router = useRouter();
  const { startNewTest } = useExamResults();
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const [existingTest, setExistingTest] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing test first
    const existingTestId = localStorage.getItem('current-test-id');
    if (existingTestId) {
      setExistingTest(existingTestId);
      return;
    }

    const initializeTest = async () => {
      if (!isAuthenticated) return;

      try {
        const testId = await startNewTest();
        router.push(`/exam/speaking/${testId}`);
      } catch (error) {
        console.error('Failed to start new test:', error);
      }
    };

    if (!existingTestId) {
      initializeTest();
    }
  }, [isAuthenticated, router, startNewTest]);

  const handleContinue = () => {
    if (existingTest) {
      router.push(`/exam/speaking/${existingTest}`);
    }
  };

  const handleStartNew = async () => {
    localStorage.removeItem('current-test-id');
    try {
      const testId = await startNewTest();
      localStorage.setItem('current-test-id', testId);
      router.push(`/exam/speaking/${testId}`);
    } catch (error) {
      console.error('Failed to start new test:', error);
    }
  };

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

  if (existingTest) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-6">
        <p className="text-lg">
          You have an ongoing speaking mock exam. Do you want to start a new
          one?
        </p>
        <div className="flex gap-4">
          <Button onClick={handleContinue} variant="outline">
            Continue Existing
          </Button>
          <Button onClick={handleStartNew}>Start New Test</Button>
        </div>
      </div>
    );
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
