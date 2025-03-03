import { useVoice } from '@humeai/voice-react';
import { AssistantMessage } from 'hume/api/resources/empathicVoice/types/AssistantMessage';
export const useQuestionMessages = (partNumber: 1 | 2 | 3) => {
  const { messages } = useVoice();

  const questionMessages = messages.filter((msg) => {
    if (msg.type !== 'assistant_message' || !msg.message?.content) return false;

    const content = msg.message.content.toLowerCase();
    return (
      content.includes('?') ||
      (partNumber === 2 && content.includes("let's start")) ||
      content.includes('tell me about') ||
      content.includes('could you') ||
      content.includes('would you') ||
      content.includes('please explain') ||
      content.includes('you should say') ||
      content.includes('how') ||
      content.includes('what') ||
      content.includes('why') ||
      content.includes('when') ||
      content.includes('where') ||
      content.includes('which') ||
      content.includes('do you') ||
      content.includes('describe') ||
      content.includes('who')
    );
  });

  return questionMessages as AssistantMessage[];
};
