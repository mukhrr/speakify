import { useEffect, useCallback, useMemo } from 'react';
import { useVoice } from '@humeai/voice-react';

interface UseVoiceControlProps {
  partNumber: 1 | 2 | 3;
  onCompleteAction: (partId: number) => void;
}

interface VoiceControl {
  isAudioMuted: boolean;
  handleVoiceToggle: () => void;
  disconnect: () => void;
}

export type TMessage = {
  type: string;
  message?: {
    content?: string;
  };
  name?: string;
};

export function useVoiceControl({
  partNumber,
  onCompleteAction,
}: UseVoiceControlProps): VoiceControl {
  const voice = useVoice();
  const { messages, muteAudio, mute, unmuteAudio, isAudioMuted, disconnect } =
    voice;

  const handleVoiceToggle = useCallback(() => {
    if (isAudioMuted) {
      unmuteAudio();
    } else {
      muteAudio();
    }
  }, [isAudioMuted, muteAudio, unmuteAudio]);

  useEffect(() => {
    if (!messages?.length || partNumber !== 2) return;

    const lastMessage = messages[messages.length - 1] as TMessage;

    if (lastMessage.name === 'hang_up') {
      onCompleteAction(partNumber);
    }
  }, [messages, mute, onCompleteAction, partNumber]);

  const controls = useMemo(
    () => ({
      isAudioMuted,
      handleVoiceToggle,
      disconnect,
    }),
    [isAudioMuted, handleVoiceToggle, disconnect]
  );

  return controls;
}
