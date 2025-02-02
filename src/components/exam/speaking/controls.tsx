'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2, Square } from 'lucide-react';
import { analyzeAudio, humeConfig } from '@/lib/hume/client';

interface ExamControlsProps {
  onPartComplete: () => void;
}

export function ExamControls({ onPartComplete }: ExamControlsProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setAudioChunks((chunks) => [...chunks, e.data]);
        }
      };

      recorder.onstop = async () => {
        setIsProcessing(true);
        try {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          const result = await analyzeAudio(audioBlob, humeConfig);
          console.log('Hume Analysis Result:', result);

          // Reset audio chunks for next recording
          setAudioChunks([]);
        } catch (error) {
          console.error('Hume analysis error:', error);
        } finally {
          setIsProcessing(false);
        }
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      const tracks = mediaRecorder.stream.getTracks();
      tracks.forEach((track) => track.stop());
      setIsRecording(false);
      onPartComplete();
    }
  };

  const handleRecordToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="mt-6 flex items-center justify-end space-x-4">
      <Button
        onClick={handleRecordToggle}
        size="lg"
        variant={isRecording ? 'destructive' : 'default'}
        className="shadow-glow hover:shadow-glow-md"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : isRecording ? (
          <>
            <Square className="mr-2 h-4 w-4" />
            Stop Recording
          </>
        ) : (
          <>
            <Mic className="mr-2 h-4 w-4" />
            Start Recording
          </>
        )}
      </Button>
    </div>
  );
}
