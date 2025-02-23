'use client';

import { cn } from '@/utils';

interface TimerProps {
  timeLeft: number;
}

export function Timer({ timeLeft }: TimerProps) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  const isLowTime = timeLeft <= 10; // Last 10 seconds

  return (
    <div
      className={cn(
        'rounded-md border px-3 py-1 text-sm font-medium',
        isLowTime
          ? 'animate-pulse border-red-200 bg-red-50 text-red-700'
          : 'border-border bg-background text-foreground'
      )}
    >
      <span className={cn(isLowTime && 'text-red-700')}>{formattedTime}</span>
    </div>
  );
}
