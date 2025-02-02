'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Mic, MicOff, Phone } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/utils';
import { MicFFT } from './mic-fft';
import {
  initializeEVI,
  startConversation,
  stopConversation,
  disconnectEVI,
  toggleMute,
} from '@/lib/hume/client';

interface ExamControlsProps {
  onPartComplete: () => void;
}

export function ExamControls({ onPartComplete }: ExamControlsProps) {
  const [status, setStatus] = useState<
    'disconnected' | 'connecting' | 'connected'
  >('disconnected');
  const [isMuted, setIsMuted] = useState(false);
  const [micFft, setMicFft] = useState<number[]>(Array(24).fill(0));

  useEffect(() => {
    return () => {
      disconnectEVI().catch(console.error);
    };
  }, []);

  const handleConnect = async () => {
    try {
      setStatus('connecting');
      await initializeEVI();
      await startConversation();
      setStatus('connected');
    } catch (error) {
      console.error('Failed to connect:', error);
      setStatus('disconnected');
    }
  };

  const handleDisconnect = async () => {
    try {
      await stopConversation();
      await disconnectEVI();
      setStatus('disconnected');
      onPartComplete();
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  };

  const handleMuteToggle = () => {
    toggleMute();
    setIsMuted(!isMuted);
  };

  if (status !== 'connected') {
    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-background p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.5 }}
          >
            <Button
              className="z-50 flex items-center gap-1.5"
              onClick={handleConnect}
              disabled={status === 'connecting'}
            >
              <Phone className="size-4 opacity-50" strokeWidth={2} />
              <span>
                {status === 'connecting' ? 'Connecting...' : 'Start Call'}
              </span>
            </Button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 flex w-full items-center justify-center p-4',
        'bg-gradient-to-t from-card via-card/90 to-card/0'
      )}
    >
      <AnimatePresence>
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 shadow-sm"
        >
          <Toggle pressed={!isMuted} onPressedChange={handleMuteToggle}>
            {isMuted ? (
              <MicOff className="size-4" />
            ) : (
              <Mic className="size-4" />
            )}
          </Toggle>

          <div className="relative grid h-8 w-48 shrink grow-0">
            <MicFFT fft={micFft} className="fill-current" />
          </div>

          <Button
            className="flex items-center gap-1"
            onClick={handleDisconnect}
            variant="destructive"
          >
            <Phone className="size-4 opacity-50" strokeWidth={2} />
            <span>End Call</span>
          </Button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
