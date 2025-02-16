import { supabase } from '@/lib/supabase/client';

// Types for individual part results
export interface PartResult {
  partNumber: 1 | 2 | 3;
  scores: {
    fluency: number;
    pronunciation: number;
    grammar: number;
    vocabulary: number;
    overall: number;
  };
  feedback: string[];
  summary: string;
  timestamp: string;
}

// Types for complete test results
export interface TestResult {
  userId: string;
  testId: string;
  part1?: PartResult;
  part2?: PartResult;
  part3?: PartResult;
  overallBandScore?: number;
  createdAt?: string;
  status: 'in_progress' | 'completed';
}

// Save individual part result
export const savePartResult = async (
  userId: string,
  testId: string,
  partResult: PartResult
): Promise<void> => {
  try {
    const { error } = await supabase.from('speaking_test_parts').insert({
      user_id: userId,
      test_id: testId,
      part_number: partResult.partNumber,
      scores: partResult.scores,
      feedback: partResult.feedback,
      summary: partResult.summary,
    });

    if (error) throw error;

    // Update test status in speaking_tests table
    await updateTestStatus(userId, testId);
  } catch (error) {
    console.error('Error saving part result:', error);
    throw error;
  }
};

// Update test status based on completed parts
const updateTestStatus = async (userId: string, testId: string) => {
  try {
    // Get all parts for this test
    const { data: parts, error } = await supabase
      .from('speaking_test_parts')
      .select('part_number')
      .eq('test_id', testId)
      .eq('user_id', userId);

    if (error) throw error;

    // Check if all parts are completed
    const isCompleted = parts && parts.length === 3;

    if (isCompleted) {
      // Calculate overall score
      const { data: allParts } = await supabase
        .from('speaking_test_parts')
        .select('scores')
        .eq('test_id', testId)
        .eq('user_id', userId);

      const overallScore =
        allParts && allParts.length > 0
          ? allParts.reduce((acc, part) => acc + part.scores.overall, 0) /
            allParts.length
          : 0;

      // Update test status and overall score
      await supabase
        .from('speaking_tests')
        .update({
          status: 'completed',
          overall_band_score: overallScore,
          completed_at: new Date().toISOString(),
        })
        .eq('test_id', testId)
        .eq('user_id', userId);
    }
  } catch (error) {
    console.error('Error updating test status:', error);
    throw error;
  }
};

// Create new test
export const createNewTest = async (userId: string): Promise<string> => {
  try {
    const testId = crypto.randomUUID();
    const { error } = await supabase.from('speaking_tests').insert({
      user_id: userId,
      test_id: testId,
      status: 'in_progress',
    });

    if (error) throw error;
    return testId;
  } catch (error) {
    console.error('Error creating new test:', error);
    throw error;
  }
};

// Get user's test history
export const getUserTestHistory = async (
  userId: string
): Promise<TestResult[]> => {
  try {
    // Get all tests
    const { data: tests, error: testsError } = await supabase
      .from('speaking_tests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (testsError) throw testsError;

    // Get all parts for these tests
    const { data: parts, error: partsError } = await supabase
      .from('speaking_test_parts')
      .select('*')
      .eq('user_id', userId)
      .in('test_id', tests?.map((t) => t.test_id) || []);

    if (partsError) throw partsError;

    // Combine tests with their parts
    return (tests || []).map((test) => {
      const testParts = parts?.filter((p) => p.test_id === test.test_id) || [];
      return {
        userId: test.user_id,
        testId: test.test_id,
        part1: testParts.find((p) => p.part_number === 1) as PartResult,
        part2: testParts.find((p) => p.part_number === 2) as PartResult,
        part3: testParts.find((p) => p.part_number === 3) as PartResult,
        overallBandScore: test.overall_band_score,
        createdAt: test.created_at,
        status: test.status,
      };
    });
  } catch (error) {
    console.error('Error fetching test history:', error);
    throw error;
  }
};

// Get specific test result
export const getTestResult = async (
  userId: string,
  testId: string
): Promise<TestResult | null> => {
  try {
    const { data: test, error: testError } = await supabase
      .from('speaking_tests')
      .select('*')
      .eq('user_id', userId)
      .eq('test_id', testId)
      .single();

    if (testError) throw testError;
    if (!test) return null;

    const { data: parts, error: partsError } = await supabase
      .from('speaking_test_parts')
      .select('*')
      .eq('user_id', userId)
      .eq('test_id', testId);

    if (partsError) throw partsError;

    return {
      userId: test.user_id,
      testId: test.test_id,
      part1: parts?.find((p) => p.part_number === 1) as PartResult,
      part2: parts?.find((p) => p.part_number === 2) as PartResult,
      part3: parts?.find((p) => p.part_number === 3) as PartResult,
      overallBandScore: test.overall_band_score,
      createdAt: test.created_at,
      status: test.status,
    };
  } catch (error) {
    console.error('Error fetching test result:', error);
    throw error;
  }
};
