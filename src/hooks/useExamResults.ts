import { useEffect, useState } from 'react';
import { useAuth } from './use-auth';
import {
  TestResult,
  createNewTest,
  getTestResult,
  getUserTestHistory,
} from '@/lib/supabase/speaking-results';

interface UseExamResults {
  currentTest: TestResult | null;
  testHistory: TestResult[];
  isLoading: boolean;
  startNewTest: () => Promise<string>;
  refreshResults: () => Promise<void>;
}

export function useExamResults(): UseExamResults {
  const [currentTest, setCurrentTest] = useState<TestResult | null>(null);
  const [testHistory, setTestHistory] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, userId } = useAuth();

  // Load current test from session storage
  const loadCurrentTest = async () => {
    const testId = sessionStorage.getItem('current-test-id');
    if (!testId || !isAuthenticated || !userId) return null;

    try {
      const test = await getTestResult(userId, testId);
      return test;
    } catch (error) {
      console.error('Error loading current test:', error);
      return null;
    }
  };

  // Load test history
  const loadTestHistory = async () => {
    if (!isAuthenticated || !userId) return [];

    try {
      const history = await getUserTestHistory(userId);
      return history;
    } catch (error) {
      console.error('Error loading test history:', error);
      return [];
    }
  };

  // Refresh all results
  const refreshResults = async () => {
    setIsLoading(true);
    try {
      const [test, history] = await Promise.all([
        loadCurrentTest(),
        loadTestHistory(),
      ]);
      setCurrentTest(test);
      setTestHistory(history);
    } catch (error) {
      console.error('Error refreshing results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Start a new test
  const startNewTest = async () => {
    if (!isAuthenticated || !userId) throw new Error('User not authenticated');

    try {
      // Check for existing in-progress test
      const existingTestId = sessionStorage.getItem('current-test-id');
      if (existingTestId) {
        const existingTest = await getTestResult(userId, existingTestId);
        if (existingTest && existingTest.status === 'in_progress') {
          setCurrentTest(existingTest);
          return existingTestId;
        }
      }

      // If no in-progress test found, create a new one
      const testId = await createNewTest(userId);
      sessionStorage.setItem('current-test-id', testId);

      const newTest = await getTestResult(userId, testId);
      setCurrentTest(newTest);

      return testId;
    } catch (error) {
      console.error('Error starting new test:', error);
      throw error;
    }
  };

  // Initial load
  useEffect(() => {
    if (isAuthenticated && userId) {
      refreshResults();
    }
  }, [isAuthenticated, userId]);

  return {
    currentTest,
    testHistory,
    isLoading,
    startNewTest,
    refreshResults,
  };
}
