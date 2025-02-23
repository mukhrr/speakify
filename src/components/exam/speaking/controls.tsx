'use client';

import { Mic, MicOff, Phone, Volume2, VolumeX } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import MicFFT from './mic-fft';
import { cn } from '@/utils';
import { useMicControl } from './hooks/useMicControl';
import { useVoiceControl } from './hooks/useVoiceControl';
import { useExamTimer } from './hooks/useExamTimer';
import { Timer } from './timer';
import { Loader2 } from 'lucide-react';

interface ControlsProps {
  partNumber: 1 | 2 | 3;
  onCompleteAction: (partId: number) => void;
}

export default function Controls({
  partNumber,
  onCompleteAction,
}: ControlsProps) {
  const {
    status,
    isMuted,
    handleMuteToggle,
    disconnect: disconnectMic,
    micFft,
  } = useMicControl();

  const {
    isScoring,
    isAudioMuted,
    handleVoiceToggle,
    disconnect: disconnectVoice,
  } = useVoiceControl({
    partNumber,
    onCompleteAction,
  });

  const { timeLeft, isPreparationTime, isRunning } = useExamTimer({
    partNumber,
  });

  const router = useRouter();

  const handleEndCall = () => {
    const confirmMessage = `Are you sure you want to end the speaking test? This will not complete current part. You will have to re-take the test!`;

    const confirmed = window.confirm(confirmMessage);
    const sessionId = sessionStorage.getItem('current-test-id');

    if (confirmed) {
      disconnectMic();
      disconnectVoice();
      onCompleteAction(partNumber);

      router.push(`/exam/speaking/${sessionId}`);
    }
  };

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 flex w-full items-center justify-center p-4',
        'bg-gradient-to-t from-card via-card/90 to-card/0'
      )}
    >
      <AnimatePresence>
        {status.value === 'connected' ? (
          <motion.div
            initial={{
              y: '100%',
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: '100%',
              opacity: 0,
            }}
            className={
              'flex items-center gap-4 rounded-lg border border-border bg-card p-4 shadow-sm'
            }
          >
            {isScoring ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Calculating score...</span>
              </div>
            ) : (
              <>
                {partNumber === 2 && isRunning && (
                  <Timer
                    timeLeft={timeLeft}
                    isPreparationTime={isPreparationTime}
                  />
                )}

                <Toggle pressed={!isMuted} onPressedChange={handleMuteToggle}>
                  {isMuted ? (
                    <MicOff className={'size-4'} />
                  ) : (
                    <Mic className={'size-4'} />
                  )}
                </Toggle>

                <Toggle
                  pressed={!isAudioMuted}
                  onPressedChange={handleVoiceToggle}
                >
                  {isAudioMuted ? (
                    <VolumeX className={'size-4'} />
                  ) : (
                    <Volume2 className={'size-4'} />
                  )}
                </Toggle>

                <div className={'relative grid h-8 w-48 shrink grow-0'}>
                  <MicFFT fft={micFft} className={'fill-current'} />
                </div>

                <Button
                  className={'flex items-center gap-1.5'}
                  onClick={handleEndCall}
                  variant={'destructive'}
                >
                  <Phone className={'size-4 opacity-50'} strokeWidth={2} />
                  <span>End Test</span>
                </Button>
              </>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
