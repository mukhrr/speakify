import { useEffect, useState } from 'react';
import { useExamResults } from './useExamResults';

interface ExamPartsStatus {
  part1Completed: boolean;
  part2Completed: boolean;
  part3Completed: boolean;
  isLoading: boolean;
}

export function useExamPartsStatus(): ExamPartsStatus {
  const { currentTest, isLoading } = useExamResults();
  const [partsStatus, setPartsStatus] = useState<ExamPartsStatus>({
    part1Completed: false,
    part2Completed: false,
    part3Completed: false,
    isLoading: true,
  });

  useEffect(() => {
    if (!isLoading && currentTest) {
      setPartsStatus({
        part1Completed: !!currentTest.part1,
        part2Completed: !!currentTest.part2,
        part3Completed: !!currentTest.part3,
        isLoading: false,
      });
    }
  }, [currentTest, isLoading]);

  return partsStatus;
}
