'use client';

import { useRef } from 'react';
import { VoiceProvider } from '@humeai/voice-react';

import Messages from './messages';
import Controls from './controls';
import StartCall from './start-call';

export default function ClientComponent({
  accessToken,
}: {
  accessToken: string;
}) {
  const timeout = useRef<number | null>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={
        'relative mx-auto flex h-full w-full grow flex-col overflow-hidden'
      }
    >
      <VoiceProvider
        auth={{ type: 'accessToken', value: accessToken }}
        onMessage={() => {
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
        }}
      >
        <Messages ref={messagesRef} />
        <Controls />
        <StartCall />
      </VoiceProvider>
    </div>
  );
}
