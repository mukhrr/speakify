export interface SpeakingScores {
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
  localStorage.setItem(key, JSON.stringify(result));
};

// Get all stored part results
export const getAllSpeakingResults = (): SpeakingResult[] => {
  const results: SpeakingResult[] = [];
  for (let i = 1; i <= 3; i++) {
    const key = `speaking-part-${i}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      results.push(JSON.parse(stored));
    }
  }
  return results;
};

// Clear all stored results
export const clearSpeakingResults = () => {
  for (let i = 1; i <= 3; i++) {
    localStorage.removeItem(`speaking-part-${i}`);
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
  const overall = scores.overall;

  if (overall >= 8.5) {
    feedback.push(
      'Speaks fluently with only rare repetition or self-correction'
    );
    feedback.push('Uses a full range of pronunciation features with precision');
    feedback.push(
      'Uses a wide range of complex structures with full flexibility'
    );
    feedback.push(
      'Uses precise vocabulary with natural and sophisticated control'
    );
  } else if (overall >= 7.5) {
    feedback.push('Speaks at length without noticeable effort');
    feedback.push(
      'Shows all the positive features of Band 7 and some of Band 9'
    );
    feedback.push('Uses a wide range of structures with good flexibility');
    feedback.push('Uses vocabulary flexibly and effectively');
  } else if (overall >= 6.5) {
    feedback.push(
      'Willing to speak at length, though may lose coherence at times'
    );
    feedback.push(
      'Can generally be understood throughout, with some pronunciation errors'
    );
    feedback.push(
      'Uses a mix of simple and complex structures with some flexibility'
    );
    feedback.push('Has a good range of vocabulary for familiar topics');
  } else if (overall >= 5.5) {
    feedback.push(
      'Can usually maintain flow of speech but uses repetition and self-correction'
    );
    feedback.push('Can be understood despite pronunciation errors');
    feedback.push('Uses basic sentence forms with limited accuracy');
    feedback.push('Uses adequate vocabulary for basic discussions');
  } else {
    feedback.push('Speaks with long pauses and limited expression');
    feedback.push(
      'Shows basic pronunciation errors that may cause strain for the listener'
    );
    feedback.push('Uses simple sentences with frequent grammatical errors');
    feedback.push('Uses limited vocabulary that restricts discussion');
  }

  return feedback;
}
