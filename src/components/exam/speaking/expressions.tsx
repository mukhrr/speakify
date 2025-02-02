'use client';

import { motion } from 'framer-motion';
import { CSSProperties } from 'react';
import * as R from 'remeda';

const expressionLabels: Record<string, string> = {
  admiration: 'Admiration',
  adoration: 'Adoration',
  aestheticAppreciation: 'Aesthetic Appreciation',
  amusement: 'Amusement',
  anger: 'Anger',
  anxiety: 'Anxiety',
  awe: 'Awe',
  calmness: 'Calmness',
  concentration: 'Concentration',
  confusion: 'Confusion',
  contentment: 'Contentment',
  determination: 'Determination',
  interest: 'Interest',
  joy: 'Joy',
  neutral: 'Neutral',
  satisfaction: 'Satisfaction',
};

const expressionColors: Record<string, string> = {
  admiration: '#ffc58f',
  adoration: '#ffc6cc',
  aestheticAppreciation: '#e2cbff',
  amusement: '#febf52',
  anger: '#b21816',
  anxiety: '#6e42cc',
  awe: '#7dabd3',
  calmness: '#a9cce1',
  concentration: '#336cff',
  confusion: '#c66a26',
  contentment: '#e5c6b4',
  determination: '#ff5c00',
  interest: '#a9cce1',
  joy: '#ffd600',
  neutral: '#879aa1',
  satisfaction: '#a6ddaf',
};

const isExpressionColor = (
  color: string
): color is keyof typeof expressionColors => {
  return color in expressionColors;
};

interface ExpressionsProps {
  values: Record<string, number>;
}

export function Expressions({ values }: ExpressionsProps) {
  const top3 = R.pipe(
    values,
    R.entries(),
    R.sortBy(([_, value]) => -value), // Sort by value in descending order
    R.take(3)
  );

  return (
    <div className="flex w-full flex-col gap-3 border-t border-border p-3 text-xs md:flex-row">
      {top3.map(([key, value]) => (
        <div key={key} className="w-full overflow-hidden">
          <div className="flex items-center justify-between gap-1 pb-1 font-mono">
            <div className="truncate font-medium">
              {expressionLabels[key] || key}
            </div>
            <div className="tabular-nums opacity-50">{value.toFixed(2)}</div>
          </div>
          <div
            className="relative h-1"
            style={
              {
                '--bg': isExpressionColor(key)
                  ? expressionColors[key]
                  : 'var(--bg)',
              } as CSSProperties
            }
          >
            <div className="absolute left-0 top-0 size-full rounded-full bg-[var(--bg)] opacity-10" />
            <motion.div
              className="absolute left-0 top-0 h-full rounded-full bg-[var(--bg)]"
              initial={{ width: 0 }}
              animate={{
                width: `${R.pipe(
                  value,
                  (v) => Math.max(0, Math.min(1, v)),
                  (v) => v * 100
                )}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
