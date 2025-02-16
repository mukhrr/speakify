import { useEffect, useState } from 'react';
import { useVoice } from '@humeai/voice-react';

interface UseExamTimerProps {
  partNumber: 1 | 2 | 3;
}

interface ExamTimer {
  timeLeft: number;
  isPreparationTime: boolean;
  isRunning: boolean;
}

export function useExamTimer({ partNumber }: UseExamTimerProps): ExamTimer {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPreparationTime, setIsPreparationTime] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const { messages } = useVoice();

  useEffect(() => {
    if (partNumber !== 2) return;

    if (messages?.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (
        lastMessage.type === 'assistant_message' &&
        typeof lastMessage.message?.content === 'string'
      ) {
        const content = lastMessage.message.content.toLowerCase();

        // Start preparation timer (1 minute)
        if (content.includes('one minute to prepare')) {
          setTimeLeft(60); // 60 seconds
          setIsPreparationTime(true);
          setIsRunning(true);
        }

        // Start speaking timer (2 minutes)
        if (content.includes("let's start if you are ready")) {
          setTimeLeft(120); // 120 seconds
          setIsPreparationTime(false);
          setIsRunning(true);
        }
      }
    }
  }, [messages, partNumber]);

  // Timer countdown
  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  return {
    timeLeft,
    isPreparationTime,
    isRunning,
  };
}
