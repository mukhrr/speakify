import { useEffect, useState } from 'react';
import { useVoice } from '@humeai/voice-react';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
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
    if (messages?.length > 0) {
      const lastMessage = messages[messages.length - 1];

      // Check for scoring message to show loading state
      if (
        lastMessage.type === 'assistant_message' &&
        typeof lastMessage.message?.content === 'string' &&
        lastMessage.message.content.toLowerCase().includes('overall score')
      ) {
        muteAudio();
        setIsScoring(true);
      }

      // Handle call completion on assistant_end
      if (lastMessage.type === 'assistant_end') {
        // Short delay to ensure scoring state is shown
        const timer = setTimeout(() => {
          disconnect();
          onCompleteAction(partNumber);

          // Navigate based on part number
          if (partNumber === 3) {
            router.push('/exam/speaking/results');
          } else {
            router.push('/exam/speaking');
          }
        }, 1500); // 1.5 seconds delay

        return () => clearTimeout(timer);
      }
    }
  }, [messages, muteAudio, disconnect, onCompleteAction, partNumber, router]);

  return {
    isScoring,
    isAudioMuted,
    handleVoiceToggle,
    disconnect,
  };
}
