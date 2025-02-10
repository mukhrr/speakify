'use client';
import { useVoice } from '@humeai/voice-react';
import { useEffect } from 'react';
import { Mic, MicOff, Phone, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import MicFFT from './mic-fft';
import { cn } from '@/utils';

interface ControlsProps {
  partNumber: 1 | 2 | 3;
  onCompleteAction: (partId: number) => void;
}

export default function Controls({
  partNumber,
  onCompleteAction,
}: ControlsProps) {
  const { disconnect, status, isMuted, unmute, mute, micFft } = useVoice();
  const router = useRouter();
  const voice = useVoice();

  const handleEndCall = () => {
    const isLastPart = partNumber === 3;
    const confirmMessage = isLastPart
      ? 'Are you sure you want to end the speaking test? This will complete Part 3.'
      : `Are you sure you want to end Part ${partNumber}? You will proceed to Part ${partNumber + 1}.`;

    const confirmed = window.confirm(confirmMessage);

    if (confirmed) {
      disconnect();
      onCompleteAction(partNumber);

      // Navigate to results page if it's the last part, otherwise go back to overview
      if (isLastPart) {
        router.push('/exam/speaking/results');
      } else {
        router.push('/exam/speaking');
      }
    }
  };

  // Automatically mute/unmute mic based on AI speaking status
  useEffect(() => {
    if (voice.isPlaying) {
      voice.mute();
    } else if (voice.status.value === 'connected') {
      voice.unmute();
    }
  }, [voice.isPlaying, voice.status.value, voice.mute, voice.unmute]);

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
            <Toggle
              pressed={!isMuted}
              onPressedChange={() => {
                if (isMuted) {
                  unmute();
                } else {
                  mute();
                }
              }}
            >
              {isMuted ? (
                <MicOff className={'size-4'} />
              ) : (
                <Mic className={'size-4'} />
              )}
            </Toggle>

            <div className={'relative grid h-8 w-48 shrink grow-0'}>
              <MicFFT fft={micFft} className={'fill-current'} />
            </div>

            <Button
              className={'flex items-center gap-1.5'}
              onClick={handleEndCall}
              variant={partNumber === 3 ? 'destructive' : 'default'}
            >
              <span>
                {partNumber === 3 ? (
                  <Phone className={'size-4 opacity-50'} strokeWidth={2} />
                ) : (
                  <ArrowRight className={'size-4 opacity-50'} strokeWidth={2} />
                )}
              </span>
              <span>
                {partNumber === 3
                  ? 'End Speaking Test'
                  : 'I am Done, Next Section'}
              </span>
            </Button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
