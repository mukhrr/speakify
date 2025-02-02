'use client';

import { useEffect, useState } from 'react';

interface TimerProps {
  isRunning: boolean;
}

export function Timer({ isRunning }: TimerProps) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className="shadow-glow rounded-lg bg-secondary px-4 py-2">
      <span className="font-mono text-lg font-medium text-secondary-foreground">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}
