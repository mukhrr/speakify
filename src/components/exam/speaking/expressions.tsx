'use client';
import { expressionColors, isExpressionColor } from '@/utils/expressionColors';
import { expressionLabels } from '@/utils/expressionLabels';
import { motion } from 'framer-motion';
import { EmotionScores } from 'hume/api/resources/empathicVoice/types/EmotionScores';
import { CSSProperties } from 'react';
import * as R from 'remeda';

export default function Expressions({ values }: { values: EmotionScores }) {
  const top3 = R.pipe(
    values,
    R.entries(),
    R.sortBy(R.pathOr([1], 0)),
    R.reverse(),
    R.take(3)
  );

  return (
    <div
      className={
        'flex w-full flex-col gap-3 border-t border-border p-3 text-xs md:flex-row'
      }
    >
      {top3.map(([key, value]) => (
        <div key={key} className={'w-full overflow-hidden'}>
          <div
            className={'flex items-center justify-between gap-1 pb-1 font-mono'}
          >
            <div className={'truncate font-medium'}>
              {expressionLabels[key]}
            </div>
            <div className={'tabular-nums opacity-50'}>{value.toFixed(2)}</div>
          </div>
          <div
            className={'relative h-1'}
            style={
              {
                '--bg': isExpressionColor(key)
                  ? expressionColors[key]
                  : 'var(--bg)',
              } as CSSProperties
            }
          >
            <div
              className={
                'absolute left-0 top-0 size-full rounded-full bg-[var(--bg)] opacity-10'
              }
            />
            <motion.div
              className={
                'absolute left-0 top-0 h-full rounded-full bg-[var(--bg)]'
              }
              initial={{ width: 0 }}
              animate={{
                width: `${R.pipe(
                  value,
                  R.clamp({ min: 0, max: 1 }),
                  (value) => `${value * 100}%`
                )}`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
