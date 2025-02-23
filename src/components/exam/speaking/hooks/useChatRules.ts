import { JSONMessage } from '@humeai/voice-react';
import { savePartResult } from '@/lib/supabase/speaking-results';
import { useAuth } from '@/hooks/use-auth';
import { generateFeedback } from '@/lib/hume/analysis';

interface UseChatRulesProps {
  partNumber: 1 | 2 | 3;
  onCompleteAction: (partId: number) => void;
}

interface ChatRules {
  configId: string | undefined;
  handleMessage: (message: JSONMessage) => void;
}

export function useChatRules({
  partNumber,
  onCompleteAction,
}: UseChatRulesProps): ChatRules {
  const { userId } = useAuth();

  const configId =
    partNumber === 1
      ? process.env.HUME_CONFIG_ID_1
      : partNumber === 2
        ? process.env.HUME_CONFIG_ID_2
        : process.env.HUME_CONFIG_ID_3;

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
    return scores;
  };

  const handlePartCompletion = async (content: string) => {
    if (!userId) return;

    const scores = extractScores(content);
    if (!scores) return;

    const testId = sessionStorage.getItem('current-test-id');
    if (!testId) return;

    const partResult = {
      partNumber,
      scores,
      feedback: generateFeedback(scores),
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
  };

  return {
    configId,
    handleMessage,
  };
}
