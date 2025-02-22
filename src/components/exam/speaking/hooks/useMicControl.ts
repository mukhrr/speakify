import { useEffect } from 'react';
import { useVoice } from '@humeai/voice-react';

interface MicControl {
  isMuted: boolean;
  status: {
    value: string;
  };
  micFft: number[];
  handleMuteToggle: () => void;
  disconnect: () => void;
}

export function useMicControl(): MicControl {
  const voice = useVoice();
  const { status, isMuted, unmute, mute, micFft, disconnect } = voice;
  // const [canUnmute, setCanUnmute] = useState(partNumber !== 2);

  const handleMuteToggle = () => {
    if (isMuted) unmute();
    else mute();
  };

  // Listen for the start message in Part 2
  // useEffect(() => {
  //   if (partNumber === 2 && messages?.length > 0) {
  //     const lastMessage = messages[messages.length - 1];
  //     if (
  //       lastMessage.type === 'assistant_message' &&
  //       lastMessage.message?.content?.includes('now, please begin speaking')
  //     ) {
  //       setCanUnmute(true);
  //     }
  //   }
  // }, [partNumber, messages]);

  // Automatically mute/unmute mic based on AI speaking status
  useEffect(() => {
    if (voice.isPlaying) {
      voice.mute();
    } else if (voice.status.value === 'connected') {
      voice.unmute();
    }
  }, [voice.isPlaying, voice.status.value, voice.mute, voice.unmute]);

  return {
    isMuted,
    status,
    micFft,
    handleMuteToggle,
    disconnect,
  };
}
