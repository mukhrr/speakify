'use client';

import { useExamResults } from '@/hooks/useExamResults';
import { useAuth } from '@/hooks/use-auth';
import { format } from 'date-fns';
import {
  CheckCircle2,
  Loader2,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

export default function HistoryPage() {
  const { testHistory, isLoading } = useExamResults();
  const { isLoading: authLoading, isAuthenticated } = useAuth();

  if (authLoading || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading test history...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Speaking Test History</h1>
        <Link href="/exam/speaking">
          <Button>Take New Test</Button>
        </Link>
      </div>

      {testHistory.length === 0 ? (
        <div className="rounded-lg border bg-card p-8 text-center">
          <p className="mb-4 text-lg text-muted-foreground">
            You haven&apos;t taken any speaking tests yet.
          </p>
          <Link href="/exam/speaking">
            <Button>Take Your First Test</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {testHistory.map((test) => (
            <div
              key={test.testId}
              className="rounded-lg border bg-card p-6 shadow-sm"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Started at{' '}
                    {test.createdAt &&
                      format(new Date(test.createdAt), 'PPP p')}
                  </p>
                  <div className="mt-1 flex items-center gap-3">
                    <h3 className="text-xl font-semibold">
                      Overall Score:{' '}
                      {test.status === 'completed' && (
                        <span className="text-primary">
                          {Math.round(test.overallBandScore ?? 0)}
                        </span>
                      )}
                    </h3>
                    <span
                      className={`flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        test.status === 'completed'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {test.status === 'completed' ? (
                        <CheckCircle2 className="mr-1 inline-block h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Clock className="mr-1 inline-block h-3.5 w-3.5 text-muted-foreground" />
                      )}
                      {test.status === 'completed'
                        ? 'Completed'
                        : 'In Progress'}
                    </span>
                  </div>
                </div>
                {test.status === 'in_progress' && (
                  <Link href={`/exam/speaking/${test.testId}`}>
                    <Button variant="outline" size="sm">
                      Continue Test
                    </Button>
                  </Link>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {[test.part1, test.part2, test.part3].map((part, index) => (
                  <div key={index} className="rounded-md border bg-card/50 p-4">
                    <p className="mb-2 font-medium">
                      Part {index + 1}:{' '}
                      {part ? (
                        <span className="text-muted-foreground">
                          {part.scores.overall.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">
                          Not completed
                        </span>
                      )}
                    </p>
                    {part && (
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {/* <div>
                          <p className="text-muted-foreground">Overall</p>
                          <p className="font-medium">
                            {part.scores.overall.toFixed(1)}
                          </p>
                        </div> */}
                        {/* <div>
                          <p className="text-muted-foreground">Pronunciation</p>
                          <p className="font-medium">
                            {part.scores.pronunciation.toFixed(1)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Grammar</p>
                          <p className="font-medium">
                            {part.scores.grammar.toFixed(1)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Vocabulary</p>
                          <p className="font-medium">
                            {part.scores.vocabulary.toFixed(1)}
                          </p>
                        </div> */}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {test.status === 'completed' && (
                <Collapsible defaultOpen>
                  <div className="mt-4 flex items-center justify-between rounded-md border bg-muted/30 p-4">
                    <p className="font-medium">Feedback</p>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="group h-8 w-8 p-0"
                      >
                        <ChevronUp className="hidden h-4 w-4 transition-transform duration-200 group-data-[state=open]:block" />
                        <ChevronDown className="block h-4 w-4 transition-transform duration-200 group-data-[state=open]:hidden" />
                        <span className="sr-only">Toggle feedback</span>
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent>
                    <div className="space-y-2 rounded-b-md border border-t-0 bg-muted/30 p-4">
                      {[test.part1, test.part2, test.part3].map(
                        (part, index) =>
                          part &&
                          part.feedback.length > 0 && (
                            <div key={index}>
                              <p className="text-sm font-medium text-muted-foreground">
                                Part {index + 1}:
                              </p>
                              <ul className="ml-4 list-disc space-y-1 text-sm">
                                {part.feedback.map((item, i) => (
                                  <li key={i}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          )
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
