import { useEffect, useCallback, useMemo, useState } from 'react';
import { useVoice } from '@humeai/voice-react';
import { TMessage } from './useVoiceControl';

type VoiceStatusValue = 'connected' | 'disconnected' | 'connecting' | 'error';

interface VoiceStatus {
  value: VoiceStatusValue;
}

interface MicControl {
  isMuted: boolean;
  status: VoiceStatus;
  micFft: number[];
  handleMuteToggle: () => void;
  disconnect: () => void;
}

const UNMUTE_TRIGGER_PHRASE = 'please begin speaking';

export function useMicControl({
  partNumber,
}: {
  partNumber: number;
}): MicControl {
  const {
    status,
    isMuted,
    unmute,
    mute,
    micFft,
    disconnect,
    isPlaying,
    messages,
  } = useVoice();
  const [canForceUnMute, setCanForceUnMute] = useState(false);

  // Memoize the check function since it's a static operation
  const shouldUnmuteUser = useMemo(
    () =>
      (content: string): boolean =>
        content.toLowerCase().includes(UNMUTE_TRIGGER_PHRASE),
    []
  );

  const handleMuteToggle = useCallback(() => {
    if (isMuted) {
      unmute();
    } else {
      mute();
    }
  }, [isMuted, unmute, mute]);

  // Automatically mute/unmute mic based on AI speaking status
  useEffect(() => {
    if (!status?.value || typeof status.value !== 'string') return;

    if (isPlaying) {
      mute();
    } else if (
      (status.value === 'connected' && partNumber !== 2) ||
      canForceUnMute
    ) {
      unmute();
    }
  }, [isPlaying, status?.value, mute, unmute, partNumber, canForceUnMute]);

  // Automatically mute/unmute mic based on AI speaking status
  useEffect(() => {
    const lastMessage = messages[messages.length - 1] as TMessage | undefined;
    if (
      lastMessage?.message?.content &&
      shouldUnmuteUser(lastMessage.message.content)
    ) {
      setCanForceUnMute(true);
      unmute();
    }
  }, [messages, shouldUnmuteUser, unmute]);

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(
    () => ({
      isMuted,
      status: status as VoiceStatus,
      micFft,
      handleMuteToggle,
      disconnect,
    }),
    [isMuted, status, micFft, handleMuteToggle, disconnect]
  );
}
