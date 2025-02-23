'use client';

import { useState } from 'react';
import { VoiceProvider } from '@humeai/voice-react';
import { useChatRules } from './hooks/useChatRules';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

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
  const [showMessages, setShowMessages] = useState(true);
  const { configId, handleMessage } = useChatRules({
    partNumber,
    onCompleteAction,
  });

  // Force messages to be visible in Part 2
  const isMessagesVisible = partNumber === 2 ? true : showMessages;

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
        {partNumber !== 2 && (
          <div className="absolute right-4 top-4 z-10 flex items-center space-x-2">
            <Switch
              id="show-messages"
              checked={showMessages}
              onCheckedChange={setShowMessages}
            />
            <Label
              htmlFor="show-messages"
              className="cursor-pointer select-none text-sm text-foreground"
            >
              Show Examiner Questions
            </Label>
          </div>
        )}
        {isMessagesVisible && <Messages partNumber={partNumber} />}
        <Controls partNumber={partNumber} onCompleteAction={onCompleteAction} />
        <StartCall partNumber={partNumber} />
      </VoiceProvider>
    </div>
  );
}
