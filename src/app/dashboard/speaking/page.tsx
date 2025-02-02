'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { fetchAccessToken } from 'hume';
import { VoiceProvider } from '@humeai/voice-react';
import { ExamControls } from '@/components/exam/speaking/controls';
import { ExamMessages } from '@/components/exam/speaking/messages';
import { Timer } from '@/components/exam/speaking/timer';

export default function SpeakingExamPage() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [examPart, setExamPart] = useState<1 | 2 | 3>(1);
  const [isExamStarted, setIsExamStarted] = useState(false);

  useEffect(() => {
    // In a real app, this should be done server-side
    const initializeHume = async () => {
      try {
        const token = await fetchAccessToken({
          apiKey: process.env.NEXT_PUBLIC_HUME_API_KEY!,
          secretKey: process.env.NEXT_PUBLIC_HUME_SECRET_KEY!,
        });
        setAccessToken(token);
      } catch (error) {
        console.error('Failed to initialize Hume:', error);
      }
    };

    initializeHume();
  }, []);

  if (!accessToken) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading exam environment...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold">IELTS Speaking Test</h1>
        <p className="text-gray-600">
          This is a simulated IELTS speaking test using AI technology. The test
          is divided into three parts and will take approximately 11-14 minutes.
        </p>
      </div>

      {!isExamStarted ? (
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Before You Start</h2>
          <ul className="mb-6 list-inside list-disc space-y-2">
            <li>Ensure you are in a quiet environment</li>
            <li>Check your microphone is working properly</li>
            <li>Have your ID ready (if required)</li>
            <li>The test will be recorded for assessment</li>
          </ul>
          <Button
            onClick={() => setIsExamStarted(true)}
            size="lg"
            className="w-full"
          >
            Start Speaking Test
          </Button>
        </Card>
      ) : (
        <VoiceProvider auth={{ type: 'accessToken', value: accessToken }}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="col-span-2 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Part {examPart}{' '}
                  {examPart === 1 && '- Introduction & Interview'}
                  {examPart === 2 && '- Individual Long Turn'}
                  {examPart === 3 && '- Two-Way Discussion'}
                </h2>
                <Timer isRunning={isExamStarted} />
              </div>
              <ExamMessages part={examPart} />
              <ExamControls
                onPartComplete={() => {
                  if (examPart < 3) {
                    setExamPart((prev) => (prev + 1) as 1 | 2 | 3);
                  }
                }}
              />
            </Card>

            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold">
                Part {examPart} Info
              </h3>
              {examPart === 1 && (
                <div className="space-y-3">
                  <p>Duration: 4-5 minutes</p>
                  <p>The examiner will ask you general questions about:</p>
                  <ul className="list-inside list-disc">
                    <li>Your home/work/studies</li>
                    <li>Your interests</li>
                    <li>Your future plans</li>
                  </ul>
                </div>
              )}
              {examPart === 2 && (
                <div className="space-y-3">
                  <p>Duration: 3-4 minutes</p>
                  <p>You will:</p>
                  <ul className="list-inside list-disc">
                    <li>Receive a topic card</li>
                    <li>Have 1 minute to prepare</li>
                    <li>Speak for 1-2 minutes</li>
                    <li>Answer follow-up questions</li>
                  </ul>
                </div>
              )}
              {examPart === 3 && (
                <div className="space-y-3">
                  <p>Duration: 4-5 minutes</p>
                  <p>You will discuss more abstract issues related to Part 2</p>
                  <ul className="list-inside list-disc">
                    <li>Express and justify opinions</li>
                    <li>Analyze and discuss issues</li>
                    <li>Speculate about situations</li>
                  </ul>
                </div>
              )}
            </Card>
          </div>
        </VoiceProvider>
      )}
    </div>
  );
}
