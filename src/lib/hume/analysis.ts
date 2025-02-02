import { fetchAccessToken } from 'hume';

export interface SpeakingResult {
  partNumber: number;
  scores: {
    fluency: number;
    pronunciation: number;
    grammar: number;
    vocabulary: number;
    overall: number;
  };
  feedback: string[];
}

export async function analyzeSpeakingTest(
  recordings: { partNumber: number; audioUrl: string }[]
): Promise<SpeakingResult[]> {
  try {
    // Get Hume AI access token
    const token = await fetchAccessToken({
      apiKey: process.env.NEXT_PUBLIC_HUME_API_KEY!,
      secretKey: process.env.NEXT_PUBLIC_HUME_SECRET_KEY!,
    });

    // TODO: Implement actual Hume AI analysis
    // For now returning mock data
    const mockResults: SpeakingResult[] = recordings.map((recording) => ({
      partNumber: recording.partNumber,
      scores: {
        fluency: 7.0 + Math.random(),
        pronunciation: 7.0 + Math.random(),
        grammar: 7.0 + Math.random(),
        vocabulary: 7.0 + Math.random(),
        overall: 7.0 + Math.random(),
      },
      feedback: [
        'Good use of natural expressions',
        'Clear pronunciation with occasional errors',
        'Well-structured responses',
      ],
    }));

    return mockResults;
  } catch (error) {
    console.error('Error analyzing speaking test:', error);
    throw error;
  }
}

// Helper function to calculate band scores based on raw scores
export function calculateBandScore(score: number): number {
  // IELTS band score conversion (simplified)
  if (score >= 8.5) return 9;
  if (score >= 7.5) return 8;
  if (score >= 6.5) return 7;
  if (score >= 5.5) return 6;
  if (score >= 4.5) return 5;
  if (score >= 3.5) return 4;
  if (score >= 2.5) return 3;
  if (score >= 1.5) return 2;
  return 1;
}

// Generate feedback based on scores and analysis
export function generateFeedback(scores: SpeakingResult['scores']): string[] {
  const feedback: string[] = [];

  if (scores.fluency >= 7.5) {
    feedback.push('Excellent fluency with natural flow of speech');
  } else if (scores.fluency >= 6.5) {
    feedback.push('Good fluency with occasional hesitation');
  } else {
    feedback.push('Work on improving speech fluency and reducing hesitation');
  }

  if (scores.pronunciation >= 7.5) {
    feedback.push('Clear and accurate pronunciation throughout');
  } else if (scores.pronunciation >= 6.5) {
    feedback.push('Generally clear pronunciation with some minor errors');
  } else {
    feedback.push('Focus on improving pronunciation clarity');
  }

  if (scores.grammar >= 7.5) {
    feedback.push('Excellent use of complex grammatical structures');
  } else if (scores.grammar >= 6.5) {
    feedback.push('Good grammar with occasional errors');
  } else {
    feedback.push('Practice using more complex grammatical structures');
  }

  if (scores.vocabulary >= 7.5) {
    feedback.push('Rich and varied vocabulary usage');
  } else if (scores.vocabulary >= 6.5) {
    feedback.push('Good range of vocabulary with some repetition');
  } else {
    feedback.push('Work on expanding vocabulary range');
  }

  return feedback;
}
