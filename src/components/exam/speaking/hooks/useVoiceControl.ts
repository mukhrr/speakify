import { useEffect, useState } from 'react';
import { useVoice } from '@humeai/voice-react';

interface UseVoiceControlProps {
  partNumber: 1 | 2 | 3;
  onCompleteAction: (partId: number) => void;
}

interface VoiceControl {
  isScoring: boolean;
  isAudioMuted: boolean;
  handleVoiceToggle: () => void;
  disconnect: () => void;
}

export function useVoiceControl({
  partNumber,
  onCompleteAction,
}: UseVoiceControlProps): VoiceControl {
  const voice = useVoice();
  const [isScoring, setIsScoring] = useState(false);
  const { messages, muteAudio, unmuteAudio, isAudioMuted, disconnect } = voice;

  const handleVoiceToggle = () => {
    if (isAudioMuted) {
      unmuteAudio();
    } else {
      muteAudio();
    }
  };

  // Handle scoring and call completion
  useEffect(() => {
    if (messages?.length > 0 && partNumber === 2) {
      const lastMessage = messages[messages.length - 1];

      // Check for scoring message to show loading state
      if (
        lastMessage.type === 'assistant_message' &&
        typeof lastMessage.message?.content === 'string'
      ) {
        if (
          lastMessage.message.content
            .toLowerCase()
            .includes('you can make notes if you wish')
        ) {
          muteAudio();
          // TODO: make true when we have the scoring logic
          setIsScoring(false);
        }
      }

      // @ts-expect-error message name is not typed
      if (lastMessage.name === 'hang_up') onCompleteAction(partNumber);
    }
  }, [
    messages,
    muteAudio,
    unmuteAudio,
    disconnect,
    onCompleteAction,
    partNumber,
  ]);

  return {
    isScoring,
    isAudioMuted,
    handleVoiceToggle,
    disconnect,
  };
}
