import { useEffect, useState, useCallback } from 'react';
import { useAuth } from './use-auth';
import {
  TestResult,
  createNewTest,
  getTestResult,
  getUserTestHistory,
} from '@/lib/supabase/speaking-results';
import { useParams } from 'next/navigation';

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
  const params = useParams();

  // Load current test from session storage
  const loadCurrentTest = useCallback(async () => {
    const testId =
      localStorage.getItem('current-test-id') || (params?.testId as string);
    if (!testId || !isAuthenticated || !userId) return null;

    try {
      const test = await getTestResult(userId, testId);
      return test;
    } catch (error) {
      console.error('Error loading current test:', error);
      return null;
    }
  }, [isAuthenticated, userId, params]);

  // Load test history
  const loadTestHistory = useCallback(async () => {
    if (!isAuthenticated || !userId) return [];

    try {
      const history = await getUserTestHistory(userId);
      return history;
    } catch (error) {
      console.error('Error loading test history:', error);
      return [];
    }
  }, [isAuthenticated, userId]);

  // Refresh all results
  const refreshResults = useCallback(async () => {
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
  }, [loadCurrentTest, loadTestHistory]);

  // Start a new test
  const startNewTest = async () => {
    if (!isAuthenticated || !userId) throw new Error('User not authenticated');

    try {
      const testId = await createNewTest(userId);
      localStorage.setItem('current-test-id', testId);

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
  }, [isAuthenticated, userId, refreshResults]);

  return {
    currentTest,
    testHistory,
    isLoading,
    startNewTest,
    refreshResults,
  };
}
