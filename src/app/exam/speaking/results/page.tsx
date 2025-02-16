'use client';

import { useExamResults } from '@/hooks/useExamResults';
import { Loader2 } from 'lucide-react';

const ScoreCard = ({
  title,
  scores,
  feedback,
}: {
  title: string;
  scores: {
    fluency: number;
    pronunciation: number;
    grammar: number;
    vocabulary: number;
    overall: number;
  } | null;
  feedback: string[] | null;
}) => {
  if (!scores) return null;

  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="mb-4 text-lg font-semibold">{title}</h3>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Fluency</p>
          <p className="text-2xl font-semibold">{scores.fluency.toFixed(1)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Pronunciation</p>
          <p className="text-2xl font-semibold">
            {scores.pronunciation.toFixed(1)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Grammar</p>
          <p className="text-2xl font-semibold">{scores.grammar.toFixed(1)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Vocabulary</p>
          <p className="text-2xl font-semibold">
            {scores.vocabulary.toFixed(1)}
          </p>
        </div>
      </div>
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">Overall Score</p>
        <p className="text-3xl font-bold text-primary">
          {scores.overall.toFixed(1)}
        </p>
      </div>
      {feedback && feedback.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium">Feedback:</p>
          <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
            {feedback.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default function ResultsPage() {
  const { part1, part2, part3, overallScore, isLoading } = useExamResults();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading results...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <h1 className="mb-8 text-3xl font-bold">Speaking Test Results</h1>

      {overallScore ? (
        <div className="mb-8 rounded-lg border bg-primary/5 p-6">
          <p className="text-lg text-primary">Overall Speaking Score</p>
          <p className="text-5xl font-bold text-primary">
            {overallScore.toFixed(1)}
          </p>
        </div>
      ) : (
        <div className="mb-8 rounded-lg border bg-muted p-6">
          <p className="text-lg text-muted-foreground">
            Complete all parts to see your overall score
          </p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ScoreCard
          title="Part 1: Introduction and Interview"
          scores={part1?.scores ?? null}
          feedback={part1?.feedback ?? null}
        />
        <ScoreCard
          title="Part 2: Individual Long Turn"
          scores={part2?.scores ?? null}
          feedback={part2?.feedback ?? null}
        />
        <ScoreCard
          title="Part 3: Two-Way Discussion"
          scores={part3?.scores ?? null}
          feedback={part3?.feedback ?? null}
        />
      </div>
    </div>
  );
}
