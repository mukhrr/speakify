'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center space-y-4"
      >
        <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/20">
          <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
        </div>
        <h1 className="text-4xl font-bold tracking-tighter">
          Oops! Something went wrong
        </h1>
        <p className="max-w-[500px] text-muted-foreground">
          Don&apos;t worry, this won&apos;t affect your IELTS preparation.
          Please try again or contact our support team if the problem persists.
        </p>
        <div className="flex gap-4">
          <Button onClick={reset} variant="default" className="mt-4">
            Try again
          </Button>
          <Button
            onClick={() => (window.location.href = '/')}
            variant="outline"
            className="mt-4"
          >
            Go to Homepage
          </Button>
        </div>
        <a
          href="https://t.me/ieltsgurus_support_bot"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <MessageCircle className="h-4 w-4" />
          Get help on Telegram
        </a>
      </motion.div>
    </div>
  );
}
