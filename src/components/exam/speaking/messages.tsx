'use client';

import { Ref } from 'react';
import { useVoice } from '@humeai/voice-react';
import { AnimatePresence, motion } from 'framer-motion';

import { cn } from '@/utils';
import Expressions from './expressions';
import { useQuestionMessages } from '@/hooks/useQuestionMessages';

interface MessagesProps {
  ref?: Ref<HTMLDivElement>;
  partNumber: 1 | 2 | 3;
}

const Messages = ({ ref, partNumber }: MessagesProps) => {
  const questionMessages: any[] = useQuestionMessages(partNumber);

  return (
    <motion.div
      layoutScroll
      className={'grow overflow-auto rounded-md p-4'}
      ref={ref}
    >
      <motion.div
        className={'mx-auto flex w-full max-w-2xl flex-col gap-4 pb-24'}
      >
        <AnimatePresence mode={'popLayout'}>
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
              <div className={'px-3 pb-3'}>{msg.message?.content}</div>
              {msg.models?.prosody?.scores && (
                <Expressions values={msg.models.prosody.scores} />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default Messages;
