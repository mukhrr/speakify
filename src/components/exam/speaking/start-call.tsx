import { useVoice } from '@humeai/voice-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Phone } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface StartCallProps {
  partNumber: 1 | 2 | 3;
}

const partTitles = {
  1: 'Introduction and Interview',
  2: 'Individual Long Turn',
  3: 'Two-Way Discussion',
};

export default function StartCall({ partNumber }: StartCallProps) {
  const { status, connect } = useVoice();
  const [isPartCompleted, setIsPartCompleted] = useState(false);

  useEffect(() => {
    // Check if this part is already completed
    const result = sessionStorage.getItem(`speaking-part-${partNumber}`);
    setIsPartCompleted(!!result);
  }, [partNumber]);

  if (isPartCompleted) {
    return null;
  }

  return (
    <AnimatePresence>
      {status.value !== 'connected' ? (
        <motion.div
          className={
            'fixed inset-0 flex items-center justify-center bg-background p-4'
          }
          initial="initial"
          animate="enter"
          exit="exit"
          variants={{
            initial: { opacity: 0 },
            enter: { opacity: 1 },
            exit: { opacity: 0 },
          }}
        >
          <AnimatePresence>
            <motion.div
              variants={{
                initial: { scale: 0.5 },
                enter: { scale: 1 },
                exit: { scale: 0.5 },
              }}
            >
              <Card className="w-[400px] border-input p-6 shadow-md">
                <h2 className="mb-4 text-xl font-semibold">
                  Part {partNumber}: {partTitles[partNumber]}
                </h2>
                <ul className="mb-6 list-inside list-disc space-y-2">
                  <li>Ensure you are in a quiet environment</li>
                  <li>Check your microphone is working properly</li>
                </ul>
                <Button
                  className={'flex w-full items-center justify-center gap-1.5'}
                  size="lg"
                  onClick={() => {
                    connect()
                      .then(() => {})
                      .catch(() => {})
                      .finally(() => {});
                  }}
                >
                  <Phone className={'size-4 opacity-50'} strokeWidth={2} />
                  <span>Start Part {partNumber}</span>
                </Button>
              </Card>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
