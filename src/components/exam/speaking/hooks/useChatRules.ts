import { useRef } from 'react';
import { JSONMessage } from '@humeai/voice-react';
import { savePartResult } from '@/lib/supabase/speaking-results';
import { useAuth } from '@/hooks/use-auth';

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
  const { userId } = useAuth();

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

  const extractScores = (content: string) => {
    const scores = {
      overall: 0,
    };

    // const fluencyMatch = content.match(/fluency:\s*(\d+(\.\d+)?)/i);
    // const pronunciationMatch = content.match(/pronunciation:\s*(\d+(\.\d+)?)/i);
    // const grammarMatch = content.match(/grammar:\s*(\d+(\.\d+)?)/i);
    // const vocabularyMatch = content.match(/vocabulary:\s*(\d+(\.\d+)?)/i);
    const overallMatch = content.match(/overall:\s*(\d+(\.\d+)?)/i);

    if (!overallMatch) {
      return null;
    }

    scores.overall = parseFloat(overallMatch[1]);

    console.log('scores', scores);

    return scores;
  };

  const handlePartCompletion = async (content: string) => {
    if (!userId) return;

    console.log('content', content);
    const scores = extractScores(content);
    if (!scores) return;

    const testId = sessionStorage.getItem('current-test-id');
    if (!testId) return;

    const partResult = {
      partNumber,
      scores,
      feedback: [],
      summary: content,
      timestamp: new Date().toISOString(),
    };

    try {
      await savePartResult(userId, testId, partResult);
      onCompleteAction(partNumber);
    } catch (error) {
      console.error('Error saving part result:', error);
    }
  };

  const handleMessage = (message: JSONMessage) => {
    if (
      message.type === 'assistant_message' &&
      typeof message.message?.content === 'string'
    ) {
      const content = message.message.content;

      if (content.toLowerCase().includes('overall:')) {
        handlePartCompletion(content);
      }
    }

    onMessage();
  };

  return {
    configId,
    handleMessage,
  };
}
