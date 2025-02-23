'use client';

import { CheckCircle2, Lock, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { useExamPartsStatus } from '@/hooks/useExamPartsStatus';
import { useAuth } from '@/hooks/use-auth';

export default function SpeakingExamPage() {
  const { testId } = useParams();
  const {
    part1Completed,
    part2Completed,
    part3Completed,
    isLoading: partsLoading,
  } = useExamPartsStatus();
  const { isLoading: authLoading, isAuthenticated } = useAuth();

  if (authLoading || partsLoading) {
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
    <div className="container mx-auto max-w-4xl py-8">
      <h1 className="mb-2 text-3xl font-bold">IELTS Speaking Test</h1>
      <p className="mb-8 text-muted-foreground">
        The test will take approximately 11-14 minutes.
      </p>

      <div className="space-y-4">
        {/* Part 1 */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Part 1: Introduction and Interview
              </h2>
              <p className="text-muted-foreground">
                General questions about yourself and familiar topics
              </p>
              <p className="text-sm text-muted-foreground">
                Duration: 4-5 minutes
              </p>
            </div>
            {part1Completed ? (
              <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
                <CheckCircle2 className="size-4 text-emerald-600" />
                <span>Completed</span>
              </div>
            ) : (
              <Link href={`/exam/speaking/${testId}/part/1`}>
                <Button>Start Part 1</Button>
              </Link>
            )}
          </div>
        </Card>

        {/* Part 2 */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Part 2: Individual Long Turn
              </h2>
              <p className="text-muted-foreground">
                Speak about a particular topic using a task card
              </p>
              <p className="text-sm text-muted-foreground">
                Duration: 3-4 minutes
              </p>
            </div>
            {part2Completed ? (
              <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
                <CheckCircle2 className="size-4 text-emerald-600" />
                <span>Completed</span>
              </div>
            ) : part1Completed ? (
              <Link href={`/exam/speaking/${testId}/part/2`}>
                <Button>Start Part 2</Button>
              </Link>
            ) : (
              <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-1 text-sm">
                <Lock className="size-4" />
                <span>Complete Part 1 first</span>
              </div>
            )}
          </div>
        </Card>

        {/* Part 3 */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Part 3: Two-Way Discussion
              </h2>
              <p className="text-muted-foreground">
                Further questions connected to the topic in Part 2
              </p>
              <p className="text-sm text-muted-foreground">
                Duration: 4-5 minutes
              </p>
            </div>
            {part3Completed ? (
              <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
                <CheckCircle2 className="size-4 text-emerald-600" />
                <span>Completed</span>
              </div>
            ) : part1Completed && part2Completed ? (
              <Link href={`/exam/speaking/${testId}/part/3`}>
                <Button>Start Part 3</Button>
              </Link>
            ) : (
              <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-1 text-sm">
                <Lock className="size-4" />
                <span>Complete previous parts</span>
              </div>
            )}
          </div>
        </Card>

        {part1Completed && part2Completed && part3Completed && (
          <div className="mt-8 text-center">
            <Link href="/dashboard/history">
              <Button size="lg">View Results</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
