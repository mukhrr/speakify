'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ExamMessagesProps {
  part: 1 | 2 | 3;
}

const part1Questions = [
  "Let's talk about your home. Can you describe where you live?",
  'What do you like most about living there?',
  'Would you prefer to live somewhere else in the future?',
  "Let's move on to talk about your work/studies. What do you do?",
  'Why did you choose this field?',
  'What are your plans for the future in your career?',
];

const part2Topics = [
  {
    topic: 'Describe a place you like to visit in your free time.',
    points: [
      'Where this place is',
      'When you go there',
      'What you do there',
      'Why you like going there',
    ],
  },
  {
    topic: 'Describe a skill you would like to learn.',
    points: [
      'What the skill is',
      'Why you want to learn it',
      'How you plan to learn it',
      'How it will be useful to you',
    ],
  },
];

const part3Questions = [
  'What are the main reasons people choose to learn new skills?',
  'Do you think the way people learn new things has changed in recent years?',
  'How do you think education will change in the future?',
  'What role does technology play in learning new skills?',
];

export function ExamMessages({ part }: ExamMessagesProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [preparationTime, setPreparationTime] = useState(60); // for part 2
  const [isPreparationTime, setIsPreparationTime] = useState(false);

  useEffect(() => {
    setCurrentQuestion(0);
    if (part === 2) {
      setIsPreparationTime(true);
      setPreparationTime(60);
    } else {
      setIsPreparationTime(false);
    }
  }, [part]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPreparationTime && preparationTime > 0) {
      interval = setInterval(() => {
        setPreparationTime((prev) => prev - 1);
      }, 1000);
    } else if (preparationTime === 0) {
      setIsPreparationTime(false);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPreparationTime, preparationTime]);

  const renderContent = () => {
    switch (part) {
      case 1:
        return (
          <div className="space-y-4">
            <p className="text-lg font-medium">
              {part1Questions[currentQuestion]}
            </p>
          </div>
        );
      case 2:
        const topic = part2Topics[0]; // You can randomize this
        return (
          <div className="space-y-4">
            {isPreparationTime ? (
              <>
                <div className="mb-4 text-center">
                  <p className="text-2xl font-bold">{preparationTime}</p>
                  <p className="text-sm text-gray-500">
                    Preparation Time Remaining
                  </p>
                </div>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="mb-4 font-semibold">{topic.topic}</h3>
                    <p className="mb-2 text-sm text-gray-600">
                      You should say:
                    </p>
                    <ul className="list-inside list-disc space-y-1">
                      {topic.points.map((point, index) => (
                        <li key={index} className="text-sm">
                          {point}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div>
                <p className="mb-4 text-lg font-medium">{topic.topic}</p>
                <p className="text-sm text-gray-600">
                  Please speak for 1-2 minutes on this topic.
                </p>
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <p className="text-lg font-medium">
              {part3Questions[currentQuestion]}
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return <div className="min-h-[200px]">{renderContent()}</div>;
}
