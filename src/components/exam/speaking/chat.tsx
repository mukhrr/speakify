'use client';

import { useRef, useEffect, useState } from 'react';
import { VoiceProvider, useVoice } from '@humeai/voice-react';
import { IELTSExaminer } from '@/lib/hume/examiner';

import Messages from './messages';
import Controls from './controls';
import StartCall from './start-call';
import { Timer } from './timer';

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
  const examinerRef = useRef<IELTSExaminer>(new IELTSExaminer(partNumber));
  const [shouldStartTimer, setShouldStartTimer] = useState(partNumber !== 2);
  const configId =
    partNumber === 1
      ? process.env.NEXT_PUBLIC_HUME_CONFIG_ID_1
      : partNumber === 2
        ? process.env.NEXT_PUBLIC_HUME_CONFIG_ID_2
        : process.env.NEXT_PUBLIC_HUME_CONFIG_ID_3;

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

  // const onEndCall = () => onCompleteAction(partNumber);

  // Handle message content to start timer for Part 2
  const handleMessage = (message: any) => {
    if (
      partNumber === 2 &&
      message.type === 'assistant_message' &&
      message.message.content.includes("let's start if you are ready")
    ) {
      setShouldStartTimer(true);
    }
    onMessage();
  };

  // Check for time up and handle part completion
  useEffect(() => {
    const interval = setInterval(() => {
      if (examinerRef.current.isTimeUp()) {
        onCompleteAction(partNumber);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [partNumber, onCompleteAction]);

  const maxTime = partNumber === 2 ? 120 : 300; // 2 minutes for part 2, 5 minutes for others

  return (
    <div
      className={
        'relative mx-auto flex h-full w-full grow flex-col overflow-hidden'
      }
    >
      <div className="absolute right-4 top-4 z-10">
        {partNumber === 2 && (
          <Timer
            isRunning={shouldStartTimer}
            maxTime={maxTime}
            onTimeUp={() => onCompleteAction(partNumber)}
          />
        )}
      </div>
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
