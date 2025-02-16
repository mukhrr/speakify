import { useRef } from 'react';
import { JSONMessage } from '@humeai/voice-react';
import { storeSpeakingPartResult, SpeakingResult } from '@/lib/hume/analysis';

interface UseChatRulesProps {
  partNumber: 1 | 2 | 3;
  onCompleteAction: (partId: number) => void;
  messagesRef: React.RefObject<HTMLDivElement>;
}

interface ChatRules {
  configId: string | undefined;
  handleMessage: (message: JSONMessage) => void;
}

export function useChatRules({
  partNumber,
  onCompleteAction,
  messagesRef,
}: UseChatRulesProps): ChatRules {
  const timeout = useRef<number | null>(null);

  const configId =
    partNumber === 1
      ? process.env.NEXT_PUBLIC_HUME_CONFIG_ID_1
      : partNumber === 2
        ? process.env.NEXT_PUBLIC_HUME_CONFIG_ID_2
        : process.env.NEXT_PUBLIC_HUME_CONFIG_ID_3;

  const onMessage = () => {
    if (timeout.current) {
      window.clearTimeout(timeout.current);
    }

    timeout.current = window.setTimeout(() => {
      if (messagesRef.current) {
        const scrollHeight = messagesRef.current.scrollHeight;
        messagesRef.current.scrollTo({
          top: scrollHeight,
          behavior: 'smooth',
        });
      }
    }, 200);
  };

  const extractOverallScore = (content: string): number | null => {
    const match = content.match(/overall score:\s*(\d+(\.\d+)?)/i);
    return match ? parseFloat(match[1]) : null;
  };

  const extractScores = (content: string) => {
    const scores = {
      fluency: 0,
      pronunciation: 0,
      grammar: 0,
      vocabulary: 0,
      overall: 0,
    };

    const scorePatterns = {
      fluency: /fluency:\s*(\d+(\.\d+)?)/i,
      pronunciation: /pronunciation:\s*(\d+(\.\d+)?)/i,
      grammar: /grammar:\s*(\d+(\.\d+)?)/i,
      vocabulary: /vocabulary:\s*(\d+(\.\d+)?)/i,
      overall: /overall:\s*(\d+(\.\d+)?)/i,
    };

    let foundAny = false;
    Object.entries(scorePatterns).forEach(([key, pattern]) => {
      const match = content.match(pattern);
      if (match) {
        scores[key as keyof typeof scores] = parseFloat(match[1]);
        foundAny = true;
      }
    });

    return foundAny ? scores : null;
  };

  const extractFeedback = (content: string): string[] => {
    const feedbackSection = content.split(/feedback:/i)[1];
    if (!feedbackSection) return [];

    return feedbackSection
      .split(/[.•\n]/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  };

  const handlePartCompletion = async (summary: SpeakingResult) => {
    const result: SpeakingResult = {
      partNumber,
      scores: {
        fluency: summary.scores.fluency || 0,
        pronunciation: summary.scores.pronunciation || 0,
        grammar: summary.scores.grammar || 0,
        vocabulary: summary.scores.vocabulary || 0,
        overall: summary.scores.overall || 0,
      },
      feedback: summary.feedback || [],
      summary: summary.summary || '',
      timestamp: new Date().toISOString(),
    };

    await storeSpeakingPartResult(result);
    onCompleteAction(partNumber);
  };

  const handleMessage = (message: JSONMessage) => {
    if (
      message.type === 'assistant_message' &&
      typeof message.message?.content === 'string'
    ) {
      if (
        message.message.content
          .toLowerCase()
          .includes('here is your assessment')
      ) {
        const scores = extractScores(message.message.content);
        if (scores) {
          handlePartCompletion({
            partNumber,
            scores,
            feedback: extractFeedback(message.message.content),
            summary: message.message.content,
            timestamp: new Date().toISOString(),
          });
        }
      }

      const score = extractOverallScore(message.message.content);
      if (score !== null) {
        const result: SpeakingResult = {
          partNumber,
          scores: {
            fluency: score,
            pronunciation: score,
            grammar: score,
            vocabulary: score,
            overall: score,
          },
          feedback: ['Score extracted from overall assessment'],
          summary: message.message.content,
          timestamp: new Date().toISOString(),
        };
        storeSpeakingPartResult(result);
      }
    }

    onMessage();
  };

  return {
    configId,
    handleMessage,
  };
}
