'use client';

import { Loader2, Mic, MicOff, Phone } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Timer } from './timer';
import MicFFT from './mic-fft';

import { useMicControl } from './hooks/useMicControl';
import { useVoiceControl } from './hooks/useVoiceControl';
import { useExamTimer } from './hooks/useExamTimer';

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

  const { isScoring, disconnect: disconnectVoice } = useVoiceControl({
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
    <div className="fixed inset-x-0 bottom-0 bg-gradient-to-t from-background/80 to-background/0 pb-4 pt-16">
      <AnimatePresence>
        {status.value === 'connected' ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="mx-auto flex max-w-3xl items-center justify-between rounded-lg border bg-card px-4 py-2 shadow-lg"
          >
            {isScoring ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Calculating score...</span>
              </div>
            ) : (
              <TooltipProvider>
                <>
                  {/* Left Section: Timer */}
                  <div className="flex items-center gap-2">
                    {partNumber === 2 && isRunning && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {isPreparationTime ? 'Preparation:' : 'Speaking:'}
                        </span>
                        <Timer timeLeft={timeLeft} />
                      </div>
                    )}
                  </div>

                  {/* Center Section: Controls */}
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-6">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Toggle
                            pressed={!isMuted}
                            onPressedChange={handleMuteToggle}
                            className="h-10 w-10 data-[state=on]:bg-green-500/20 data-[state=on]:text-green-500"
                          >
                            {isMuted ? (
                              <MicOff className="h-5 w-5" />
                            ) : (
                              <Mic className="h-5 w-5" />
                            )}
                          </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {isMuted ? 'Unmute microphone' : 'Mute microphone'}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    <div className="h-8 w-48">
                      <MicFFT fft={micFft} className="fill-current" />
                    </div>
                  </div>

                  {/* Right Section: End Call */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={handleEndCall}
                        variant="destructive"
                        size="sm"
                        className="h-8 gap-1.5 rounded-xl px-4"
                      >
                        <Phone className="h-4 w-4" strokeWidth={2} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>End the current speaking test</p>
                    </TooltipContent>
                  </Tooltip>
                </>
              </TooltipProvider>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
