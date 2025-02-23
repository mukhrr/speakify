import { useState } from 'react';
import { ChartBar } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Chat from './chat';
import { useExamResults } from '@/hooks/useExamResults';

interface SpeakingPartsProps {
  accessToken?: string | null;
  partId?: string;
}

type PartStatus = 'not-started' | 'in-progress' | 'completed';

interface Part {
  id: 1 | 2 | 3;
  title: string;
  description: string;
  duration: string;
}

const PARTS: Part[] = [
  {
    id: 1,
    title: 'Part 1: Introduction and Interview',
    description: 'General questions about yourself and familiar topics',
    duration: '4-5 minutes',
  },
  {
    id: 2,
    title: 'Part 2: Individual Long Turn',
    description: 'Speak about a particular topic using a task card',
    duration: '3-4 minutes',
  },
  {
    id: 3,
    title: 'Part 3: Two-Way Discussion',
    description: 'Further questions connected to the topic in Part 2',
    duration: '4-5 minutes',
  },
];

export function SpeakingParts({ accessToken, partId }: SpeakingPartsProps) {
  const router = useRouter();
  const testId = localStorage.getItem('current-test-id');
  const { currentTest, isLoading } = useExamResults();
  const [activePart, setActivePart] = useState<Part | null>(() => {
    if (partId) {
      const part = PARTS.find((p) => p.id === Number(partId));
      if (part) {
        return part;
      }
    }
    return null;
  });

  const handleStartPart = (part: Part) => {
    setActivePart(part);
  };

  const handleCompletePart = (partId: number) => {
    setActivePart(null);
    if (partId === 3) {
      router.push('/dashboard/history');
    } else {
      router.push(`/exam/speaking/${testId}`);
    }
  };

  if (isLoading) {
    return null;
  }

  const getPartStatus = (partId: number): PartStatus => {
    if (!currentTest) return 'not-started';

    switch (partId) {
      case 1:
        return currentTest.part1 ? 'completed' : 'not-started';
      case 2:
        return currentTest.part2 ? 'completed' : 'not-started';
      case 3:
        return currentTest.part3 ? 'completed' : 'not-started';
      default:
        return 'not-started';
    }
  };

  const isPreviousPartsCompleted = (partId: number) => {
    return PARTS.filter((p) => p.id < partId).every(
      (p) => getPartStatus(p.id) === 'completed'
    );
  };

  const allPartsCompleted = PARTS.every(
    (part) => getPartStatus(part.id) === 'completed'
  );

  if (activePart) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{activePart.title}</h2>
        </div>
        {accessToken && (
          <div className="flex grow flex-col">
            <Chat
              accessToken={accessToken}
              partNumber={activePart.id}
              onCompleteAction={handleCompletePart}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {PARTS.map((part) => {
          const status = getPartStatus(part.id);
          return (
            <Card key={part.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{part.title}</h3>
                  <p className="text-gray-600">{part.description}</p>
                  <p className="text-sm text-gray-500">
                    Duration: {part.duration}
                  </p>
                  {status === 'not-started' &&
                    !isPreviousPartsCompleted(part.id) && (
                      <p className="text-sm text-muted-foreground">
                        Complete previous {part.id === 3 ? 'parts' : 'part'} to
                        unlock
                      </p>
                    )}
                </div>
                <Button
                  onClick={() => handleStartPart(part)}
                  disabled={
                    status === 'completed' || !isPreviousPartsCompleted(part.id)
                  }
                  variant={status === 'completed' ? 'outline' : 'default'}
                >
                  {status === 'completed'
                    ? '✓ Completed'
                    : !isPreviousPartsCompleted(part.id)
                      ? 'Locked'
                      : 'Start Conversation'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {allPartsCompleted && (
        <div className="flex justify-center">
          <Button
            size="lg"
            className="flex items-center gap-2"
            onClick={() => router.replace('/dashboard/history')}
          >
            <ChartBar className="size-4" />
            See Your Results
          </Button>
        </div>
      )}
    </div>
  );
}
