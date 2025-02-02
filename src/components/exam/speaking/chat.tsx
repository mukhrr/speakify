'use client';

import { ComponentRef, useRef } from 'react';
import { VoiceProvider } from '@humeai/voice-react';

import Messages from './messages';
import Call from './controls';
import StartCall from './start-call';

export default function ClientComponent({
  accessToken,
}: {
  accessToken: string;
}) {
  const timeout = useRef<number | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);

  // optional: use configId from environment variable
  const configId = process.env['NEXT_PUBLIC_HUME_CONFIG_ID'];

  return (
    <div
      className={
        'relative mx-auto flex h-[0px] w-full grow flex-col overflow-hidden'
      }
    >
      <VoiceProvider
        auth={{ type: 'accessToken', value: accessToken }}
        configId={configId}
        onMessage={() => {
          if (timeout.current) {
            window.clearTimeout(timeout.current);
          }

          timeout.current = window.setTimeout(() => {
            if (ref.current) {
              const scrollHeight = ref.current.scrollHeight;

              ref.current.scrollTo({
                top: scrollHeight,
                behavior: 'smooth',
              });
            }
          }, 200);
        }}
      >
        <Messages ref={ref} />
        <Call />
        <StartCall />
      </VoiceProvider>
    </div>
  );
}
