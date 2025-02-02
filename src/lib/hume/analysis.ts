export interface SpeakingScores {
  fluency: number;
  pronunciation: number;
  grammar: number;
  vocabulary: number;
  overall: number;
}

export interface SpeakingResult {
  partNumber: number;
  scores: SpeakingScores;
  feedback: string[];
  summary: string;
  timestamp: string;
  audioUrl?: string;
}

export interface SpeakingTestResult {
  userId: string;
  testId: string;
  results: SpeakingResult[];
  overallBandScore: number;
  createdAt: string;
}

// Calculate band score based on overall score
export const calculateBandScore = (score: number): number => {
  if (score >= 9) return 9;
  if (score >= 8) return 8.5;
  if (score >= 7.5) return 8;
  if (score >= 7) return 7.5;
  if (score >= 6.5) return 7;
  if (score >= 6) return 6.5;
  if (score >= 5.5) return 6;
  if (score >= 5) return 5.5;
  if (score >= 4.5) return 5;
  return 4;
};

// Store part result in session storage
export const storeSpeakingPartResult = (result: SpeakingResult) => {
  const key = `speaking-part-${result.partNumber}`;
  sessionStorage.setItem(key, JSON.stringify(result));
};

// Get all stored part results
export const getAllSpeakingResults = (): SpeakingResult[] => {
  const results: SpeakingResult[] = [];
  for (let i = 1; i <= 3; i++) {
    const key = `speaking-part-${i}`;
    const stored = sessionStorage.getItem(key);
    if (stored) {
      results.push(JSON.parse(stored));
    }
  }
  return results;
};

// Clear all stored results
export const clearSpeakingResults = () => {
  for (let i = 1; i <= 3; i++) {
    sessionStorage.removeItem(`speaking-part-${i}`);
  }
};

// Analyze speaking test recordings and generate results
export const analyzeSpeakingTest = async (
  recordings: { partNumber: number; audioUrl: string }[]
): Promise<SpeakingResult[]> => {
  // TODO: Implement actual Hume AI analysis
  // This is a mock implementation for now
  return recordings.map((recording) => ({
    partNumber: recording.partNumber,
    scores: {
      fluency: Math.random() * 2 + 7,
      pronunciation: Math.random() * 2 + 7,
      grammar: Math.random() * 2 + 7,
      vocabulary: Math.random() * 2 + 7,
      overall: Math.random() * 2 + 7,
    },
    feedback: [
      'Good use of complex vocabulary',
      'Clear pronunciation with minor errors',
      'Maintained good fluency throughout',
    ],
    summary: 'Overall strong performance with good control of language',
    timestamp: new Date().toISOString(),
    audioUrl: recording.audioUrl,
  }));
};

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
