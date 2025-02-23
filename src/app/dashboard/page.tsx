'use client';

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
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
      <h1 className="mb-4 text-3xl font-bold">Welcome to IELTSTIFY</h1>
      <p className="mb-8 text-muted-foreground">
        Practice your IELTS speaking skills with our AI-powered simulator.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-2 text-xl font-semibold">Speaking Test</h2>
          <p className="mb-4 text-muted-foreground">
            Take a full IELTS speaking test with our AI examiner.
          </p>
          <Link href="/exam/speaking">
            <Button>Start Speaking Test</Button>
          </Link>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-2 text-xl font-semibold">Your Progress</h2>
          <p className="mb-4 text-muted-foreground">
            View your test history and track your improvement.
          </p>
          <Link href="/dashboard/history">
            <Button variant="outline">View History</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
