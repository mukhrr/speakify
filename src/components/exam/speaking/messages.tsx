'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { cn } from '@/utils';
import { useQuestionMessages } from '@/hooks/useQuestionMessages';
import { AssistantMessage } from 'hume/api/resources/empathicVoice/types/AssistantMessage';

interface MessagesProps {
  partNumber: 1 | 2 | 3;
}

const Messages = ({ partNumber }: MessagesProps) => {
  const messagesRef = useRef<HTMLDivElement>(null);
  const questionMessages: AssistantMessage[] = useQuestionMessages(partNumber);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (messagesRef.current) {
      const scrollContainer = messagesRef.current;
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [questionMessages]);

  return (
    <motion.div
      layoutScroll
      className="grow overflow-auto scroll-smooth rounded-md p-4"
      ref={messagesRef}
    >
      <motion.div className="mx-auto flex w-full max-w-2xl flex-col gap-4 pb-24">
        <AnimatePresence mode="popLayout">
          {questionMessages.map((msg, index) => (
            <motion.div
              key={msg.type + index}
              className={cn(
                'w-[80%]',
                'bg-card',
                'rounded border border-border'
              )}
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: 0,
              }}
            >
              <div
                className={cn(
                  'px-3 pt-4 text-xs font-medium capitalize leading-none opacity-50'
                )}
              >
                Examiner
              </div>
              <div className="px-3 pb-3">{msg.message?.content}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default Messages;
