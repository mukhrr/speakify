'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  SpeakingResult,
  analyzeSpeakingTest,
  calculateBandScore,
} from '@/lib/hume/analysis';

export default function ResultsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<SpeakingResult[]>([]);

  useEffect(() => {
    const analyzeResults = async () => {
      try {
        // TODO: Get actual recordings from storage/context
        const mockRecordings = [
          { partNumber: 1, audioUrl: 'mock-url-1' },
          { partNumber: 2, audioUrl: 'mock-url-2' },
          { partNumber: 3, audioUrl: 'mock-url-3' },
        ];

        const analysisResults = await analyzeSpeakingTest(mockRecordings);
        setResults(analysisResults);
      } catch (error) {
        console.error('Error analyzing results:', error);
        // TODO: Handle error properly
      } finally {
        setLoading(false);
      }
    };

    analyzeResults();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-bold">
              Analyzing Your Performance
            </h2>
            <p className="text-muted-foreground">
              Please wait while we analyze your speaking test results...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const overallScore =
    results.reduce((acc, part) => acc + part.scores.overall, 0) /
    results.length;
  const bandScore = calculateBandScore(overallScore);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Speaking Test Results</h1>
          <p className="mt-2 text-muted-foreground">
            Here&apos;s your detailed performance analysis
          </p>
        </div>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => {
            router.replace('/');
            localStorage.removeItem('speaking-parts-status');
          }}
        >
          <ArrowLeft className="size-4" />
          Back to Main Page
        </Button>
      </div>

      <div className="mb-8">
        <Card className="p-6">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-2xl font-semibold">
              Overall Score: {overallScore.toFixed(1)}
            </h2>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">IELTS Band Score</p>
              <p className="text-3xl font-bold">{bandScore.toFixed(1)}</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="font-medium">Fluency</h3>
              <p className="text-2xl font-semibold">
                {(
                  results.reduce((acc, part) => acc + part.scores.fluency, 0) /
                  results.length
                ).toFixed(1)}
              </p>
            </div>
            <div>
              <h3 className="font-medium">Pronunciation</h3>
              <p className="text-2xl font-semibold">
                {(
                  results.reduce(
                    (acc, part) => acc + part.scores.pronunciation,
                    0
                  ) / results.length
                ).toFixed(1)}
              </p>
            </div>
            <div>
              <h3 className="font-medium">Grammar</h3>
              <p className="text-2xl font-semibold">
                {(
                  results.reduce((acc, part) => acc + part.scores.grammar, 0) /
                  results.length
                ).toFixed(1)}
              </p>
            </div>
            <div>
              <h3 className="font-medium">Vocabulary</h3>
              <p className="text-2xl font-semibold">
                {(
                  results.reduce(
                    (acc, part) => acc + part.scores.vocabulary,
                    0
                  ) / results.length
                ).toFixed(1)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        {results.map((result) => (
          <Card key={result.partNumber} className="p-6">
            <h2 className="mb-4 text-xl font-semibold">
              Part {result.partNumber} Analysis
            </h2>
            <div className="mb-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <h3 className="font-medium">Fluency</h3>
                <p className="text-2xl font-semibold">
                  {result.scores.fluency}
                </p>
              </div>
              <div>
                <h3 className="font-medium">Pronunciation</h3>
                <p className="text-2xl font-semibold">
                  {result.scores.pronunciation}
                </p>
              </div>
              <div>
                <h3 className="font-medium">Grammar</h3>
                <p className="text-2xl font-semibold">
                  {result.scores.grammar}
                </p>
              </div>
              <div>
                <h3 className="font-medium">Vocabulary</h3>
                <p className="text-2xl font-semibold">
                  {result.scores.vocabulary}
                </p>
              </div>
            </div>
            <div>
              <h3 className="mb-2 font-medium">Feedback</h3>
              <ul className="list-inside list-disc space-y-1">
                {result.feedback.map((item, index) => (
                  <li key={index} className="text-muted-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
