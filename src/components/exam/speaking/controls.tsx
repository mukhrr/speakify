'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Video, Square, Loader2 } from 'lucide-react';
import {
  initializeEVI,
  startConversation,
  stopConversation,
  disconnectEVI,
} from '@/lib/hume/client';

interface ExamControlsProps {
  onPartComplete: () => void;
}

export function ExamControls({ onPartComplete }: ExamControlsProps) {
  const [isActive, setIsActive] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      stopConversation().catch(console.error);
      disconnectEVI().catch(console.error);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startSession = async () => {
    try {
      setIsInitializing(true);

      // Initialize camera
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Initialize Hume EVI
      await initializeEVI();
      await startConversation();

      setIsActive(true);
    } catch (error) {
      console.error('Failed to start session:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  const endSession = async () => {
    try {
      await stopConversation();
      await disconnectEVI();

      // Stop camera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      setIsActive(false);
      onPartComplete();
    } catch (error) {
      console.error('Failed to end session:', error);
    }
  };

  const handleSessionToggle = () => {
    if (isActive) {
      endSession();
    } else {
      startSession();
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* User's video feed */}
        <div className="shadow-glow relative aspect-video w-full overflow-hidden rounded-lg bg-secondary">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`h-full w-full object-cover ${
              isActive ? 'opacity-100' : 'opacity-0'
            }`}
          />
          {!isActive && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-muted-foreground">
                Your video feed will appear here
              </p>
            </div>
          )}
        </div>

        {/* AI Examiner visualization */}
        <div className="shadow-glow relative aspect-video w-full overflow-hidden rounded-lg bg-secondary">
          {isActive ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-primary">
                  AI Examiner
                </h3>
                <p className="text-muted-foreground">
                  Speaking with you in real-time
                </p>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-muted-foreground">
                AI examiner will appear here
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          onClick={handleSessionToggle}
          size="lg"
          variant={isActive ? 'destructive' : 'default'}
          className="shadow-glow hover:shadow-glow-md"
          disabled={isInitializing}
        >
          {isInitializing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Initializing...
            </>
          ) : isActive ? (
            <>
              <Square className="mr-2 h-4 w-4" />
              End Session
            </>
          ) : (
            <>
              <Video className="mr-2 h-4 w-4" />
              Start Session
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
