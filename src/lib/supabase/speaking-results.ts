import { SpeakingTestResult } from '../hume/analysis';
import { supabase } from './client';

export const saveSpeakingTestResult = async (
  result: SpeakingTestResult
): Promise<void> => {
  try {
    const { error } = await supabase.from('speaking_test_results').insert({
      user_id: result.userId,
      test_id: result.testId,
      results: result.results,
      overall_band_score: result.overallBandScore,
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error saving speaking test result:', error);
    throw error;
  }
};

export const getUserSpeakingHistory = async (
  userId: string
): Promise<SpeakingTestResult[]> => {
  try {
    const { data, error } = await supabase
      .from('speaking_test_results')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((row) => ({
      userId: row.user_id,
      testId: row.test_id,
      results: row.results,
      overallBandScore: row.overall_band_score,
      createdAt: row.created_at,
    }));
  } catch (error) {
    console.error('Error fetching speaking test history:', error);
    throw error;
  }
};
