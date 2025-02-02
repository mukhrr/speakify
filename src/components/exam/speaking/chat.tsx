'use client';

import { useRef } from 'react';
import { VoiceProvider } from '@humeai/voice-react';

import Messages from './messages';
import Controls from './controls';
import StartCall from './start-call';

interface ChatProps {
  accessToken: string;
  partNumber: 1 | 2 | 3;
  onCompleteAction: (partId: number) => void;
}

export default function Chat({
  accessToken,
  partNumber,
  onCompleteAction,
}: ChatProps) {
  const timeout = useRef<number | null>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

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

  return (
    <div
      className={
        'relative mx-auto flex h-full w-full grow flex-col overflow-hidden'
      }
    >
      <VoiceProvider
        auth={{ type: 'accessToken', value: accessToken }}
        onMessage={onMessage}
      >
        <Messages ref={messagesRef} partNumber={partNumber} />
        <Controls partNumber={partNumber} onCompleteAction={onCompleteAction} />
        <StartCall partNumber={partNumber} />
      </VoiceProvider>
    </div>
  );
}
