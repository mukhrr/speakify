import { useEffect, useState } from 'react';

interface ExamPartsStatus {
  part1Completed: boolean;
  part2Completed: boolean;
  part3Completed: boolean;
  isLoading: boolean;
}

export function useExamPartsStatus(): ExamPartsStatus {
  const [status, setStatus] = useState<ExamPartsStatus>({
    part1Completed: false,
    part2Completed: false,
    part3Completed: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check completion status for all parts
    const part1 = sessionStorage.getItem('speaking-part-1');
    const part2 = sessionStorage.getItem('speaking-part-2');
    const part3 = sessionStorage.getItem('speaking-part-3');

    setStatus({
      part1Completed: !!part1,
      part2Completed: !!part2,
      part3Completed: !!part3,
      isLoading: false,
    });
  }, []);

  return status;
}
