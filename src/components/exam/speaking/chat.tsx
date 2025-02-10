'use client';

import { useRef, useEffect, useState } from 'react';
import { VoiceProvider, JSONMessage } from '@humeai/voice-react';
import { IELTSExaminer } from '@/lib/hume/examiner';
import { storeSpeakingPartResult, SpeakingResult } from '@/lib/hume/analysis';

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

  const extractOverallScore = (content: string): number | null => {
    const match = content.match(/overall score:\s*(\d+(\.\d+)?)/i);
    return match ? parseFloat(match[1]) : null;
  };

  const handlePartCompletion = async (summary: SpeakingResult) => {
    const result: SpeakingResult = {
      partNumber,
      scores: {
        fluency: summary.scores.fluency || 0,
        pronunciation: summary.scores.pronunciation || 0,
        grammar: summary.scores.grammar || 0,
        vocabulary: summary.scores.vocabulary || 0,
        overall: summary.scores.overall || 0,
      },
      feedback: summary.feedback || [],
      summary: summary.summary || '',
      timestamp: new Date().toISOString(),
    };

    // Store part result in session storage
    await storeSpeakingPartResult(result);

    // Call the completion action
    onCompleteAction(partNumber);
  };

  const handleMessage = (message: JSONMessage) => {
    if (
      partNumber === 2 &&
      message.type === 'assistant_message' &&
      message.message?.content?.includes("let's start if you are ready")
    ) {
      setShouldStartTimer(true);
    }

    // Check for summary in assistant message
    if (
      message.type === 'assistant_message' &&
      typeof message.message?.content === 'string'
    ) {
      // Check if this is a summary message
      if (
        message.message.content
          .toLowerCase()
          .includes('here is your assessment')
      ) {
        const scores = extractScores(message.message.content);
        if (scores) {
          handlePartCompletion({
            partNumber,
            scores,
            feedback: extractFeedback(message.message.content),
            summary: message.message.content,
            timestamp: new Date().toISOString(),
          });
        }
      }
      // Check for overall score
      const score = extractOverallScore(message.message.content);
      if (score !== null) {
        const result: SpeakingResult = {
          partNumber,
          scores: {
            fluency: score,
            pronunciation: score,
            grammar: score,
            vocabulary: score,
            overall: score,
          },
          feedback: ['Score extracted from overall assessment'],
          summary: message.message.content,
          timestamp: new Date().toISOString(),
        };
        storeSpeakingPartResult(result);
      }
    }

    onMessage();
  };

  const extractScores = (content: string) => {
    const scores = {
      fluency: 0,
      pronunciation: 0,
      grammar: 0,
      vocabulary: 0,
      overall: 0,
    };

    const scorePatterns = {
      fluency: /fluency:\s*(\d+(\.\d+)?)/i,
      pronunciation: /pronunciation:\s*(\d+(\.\d+)?)/i,
      grammar: /grammar:\s*(\d+(\.\d+)?)/i,
      vocabulary: /vocabulary:\s*(\d+(\.\d+)?)/i,
      overall: /overall:\s*(\d+(\.\d+)?)/i,
    };

    let foundAny = false;
    Object.entries(scorePatterns).forEach(([key, pattern]) => {
      const match = content.match(pattern);
      if (match) {
        scores[key as keyof typeof scores] = parseFloat(match[1]);
        foundAny = true;
      }
    });

    return foundAny ? scores : null;
  };

  const extractFeedback = (content: string): string[] => {
    const feedbackSection = content.split(/feedback:/i)[1];
    if (!feedbackSection) return [];

    return feedbackSection
      .split(/[.•\n]/) // Split by periods, bullets, or newlines
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
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
