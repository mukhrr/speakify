'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function FeedbackImage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Image
        src="/images/feedback-screenshot.png"
        alt="IELTS Speaking Test Feedback Example showing detailed scoring and comments"
        className="w-full object-cover"
        width={1200}
        height={750}
        priority
      />
    );
  }

  return (
    <Image
      src={
        theme === 'dark'
          ? '/images/feedback-screenshot-dark.png'
          : '/images/feedback-screenshot.png'
      }
      alt="IELTS Speaking Test Feedback Example showing detailed scoring and comments"
      className="w-full object-cover"
      width={1200}
      height={750}
      priority
    />
  );
}
