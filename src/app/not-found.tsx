'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center">
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center space-y-4"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Search className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-4xl font-bold tracking-tighter">Page Not Found</h1>
        <p className="max-w-[500px] text-muted-foreground">
          Looks like you&apos;ve ventured into uncharted territory. Don&apos;t
          worry, your IELTS journey continues from here.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
          <Button asChild variant="default">
            <Link href="/exam/speaking">Start Speaking Test</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Return to Homepage</Link>
          </Button>
        </div>
        <a
          href="https://t.me/ieltsgurus_support_bot"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <MessageCircle className="h-4 w-4" />
          Contact Support on Telegram
        </a>
      </motion.div>
    </div>
  );
}
