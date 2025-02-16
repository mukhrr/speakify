import { useEffect, useState } from 'react';
import { SpeakingResult } from '@/lib/hume/analysis';

interface ExamResults {
  part1: SpeakingResult | null;
  part2: SpeakingResult | null;
  part3: SpeakingResult | null;
  overallScore: number | null;
  isLoading: boolean;
}

export function useExamResults(): ExamResults {
  const [results, setResults] = useState<ExamResults>({
    part1: null,
    part2: null,
    part3: null,
    overallScore: null,
    isLoading: true,
  });

  useEffect(() => {
    const loadResults = () => {
      try {
        // Load results for each part from session storage
        const part1 = sessionStorage.getItem('speaking-part-1');
        const part2 = sessionStorage.getItem('speaking-part-2');
        const part3 = sessionStorage.getItem('speaking-part-3');

        // Parse results
        const part1Result = part1
          ? (JSON.parse(part1) as SpeakingResult)
          : null;
        const part2Result = part2
          ? (JSON.parse(part2) as SpeakingResult)
          : null;
        const part3Result = part3
          ? (JSON.parse(part3) as SpeakingResult)
          : null;

        // Calculate overall score if all parts are complete
        let overallScore = null;
        if (part1Result && part2Result && part3Result) {
          const scores = [
            part1Result.scores.overall,
            part2Result.scores.overall,
            part3Result.scores.overall,
          ];
          overallScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        }

        setResults({
          part1: part1Result,
          part2: part2Result,
          part3: part3Result,
          overallScore,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error loading exam results:', error);
        setResults((prev) => ({ ...prev, isLoading: false }));
      }
    };

    loadResults();
  }, []);

  return results;
}
