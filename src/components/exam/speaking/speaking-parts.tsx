import { useEffect, useState } from 'react';
import { ChartBar } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Chat from './chat';

interface SpeakingPartsProps {
  accessToken?: string | null;
}

type PartStatus = 'not-started' | 'in-progress' | 'completed';

interface Part {
  id: 1 | 2 | 3;
  title: string;
  description: string;
  duration: string;
  status: PartStatus;
}

const STORAGE_KEY = 'speaking-parts-status';

export function SpeakingParts({ accessToken }: SpeakingPartsProps) {
  const router = useRouter();
  const [parts, setParts] = useState<Part[]>(() => {
    // Try to load saved state from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    }

    // Default state if nothing is saved
    return [
      {
        id: 1,
        title: 'Part 1: Introduction and Interview',
        description: 'General questions about yourself and familiar topics',
        duration: '4-5 minutes',
        status: 'not-started',
      },
      {
        id: 2,
        title: 'Part 2: Individual Long Turn',
        description: 'Speak about a particular topic using a task card',
        duration: '3-4 minutes',
        status: 'not-started',
      },
      {
        id: 3,
        title: 'Part 3: Two-Way Discussion',
        description: 'Further questions connected to the topic in Part 2',
        duration: '4-5 minutes',
        status: 'not-started',
      },
    ];
  });

  const [activePart, setActivePart] = useState<Part | null>(null);

  // Save to localStorage whenever parts state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parts));
  }, [parts]);

  const handleStartPart = (part: Part) => {
    setParts(
      parts.map((p) =>
        p.id === part.id ? { ...p, status: 'in-progress' as PartStatus } : p
      )
    );
    setActivePart(part);
  };

  const handleCompletePart = (partId: number) => {
    setParts(
      parts.map((p) =>
        p.id === partId ? { ...p, status: 'completed' as PartStatus } : p
      )
    );
    setActivePart(null);
  };

  // Handle completion from Controls component
  useEffect(() => {
    const handleStorageChange = () => {
      const savedPartsStr = localStorage.getItem(STORAGE_KEY);
      if (savedPartsStr) {
        const savedParts = JSON.parse(savedPartsStr);
        setParts(savedParts);
        setActivePart(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const allPartsCompleted = parts.every((part) => part.status === 'completed');
  const hasInProgressPart = parts.some((part) => part.status === 'in-progress');

  // Check if previous parts are completed
  const isPreviousPartsCompleted = (partId: number) => {
    return parts
      .filter((p) => p.id < partId)
      .every((p) => p.status === 'completed');
  };

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
        {parts.map((part) => (
          <Card key={part.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{part.title}</h3>
                <p className="text-gray-600">{part.description}</p>
                <p className="text-sm text-gray-500">
                  Duration: {part.duration}
                </p>
                {part.status === 'not-started' &&
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
                  (part.status === 'completed' && !allPartsCompleted) ||
                  (hasInProgressPart && part.status !== 'in-progress') ||
                  (!isPreviousPartsCompleted(part.id) &&
                    part.status !== 'completed')
                }
                variant={part.status === 'completed' ? 'outline' : 'default'}
              >
                {part.status === 'completed'
                  ? '✓ Completed'
                  : part.status === 'in-progress'
                    ? 'Continue Conversation'
                    : !isPreviousPartsCompleted(part.id)
                      ? 'Locked'
                      : 'Start Conversation'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {allPartsCompleted && (
        <div className="flex justify-center">
          <Button
            size="lg"
            className="flex items-center gap-2"
            onClick={() => router.replace('/exam/speaking/results')}
          >
            <ChartBar className="size-4" />
            See Your Results
          </Button>
        </div>
      )}
    </div>
  );
}
