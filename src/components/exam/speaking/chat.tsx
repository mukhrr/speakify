'use client';

import { useRef } from 'react';
import { VoiceProvider } from '@humeai/voice-react';
import { useChatRules } from './hooks/useChatRules';

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
  const messagesRef = useRef<HTMLDivElement>(
    null
  ) as React.RefObject<HTMLDivElement>;
  const { configId, handleMessage } = useChatRules({
    partNumber,
    onCompleteAction,
    messagesRef,
  });

  return (
    <div
      className={
        'relative mx-auto flex h-full w-full grow flex-col overflow-hidden'
      }
    >
      <VoiceProvider
        auth={{ type: 'accessToken', value: accessToken }}
        configId={configId}
        onMessage={handleMessage}
      >
        <Messages ref={messagesRef} partNumber={partNumber} />
        <Controls partNumber={partNumber} onCompleteAction={onCompleteAction} />
        <StartCall partNumber={partNumber} />
      </VoiceProvider>
    </div>
  );
}
