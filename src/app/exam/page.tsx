'use client';

import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Clock,
  BookOpen,
  Headphones,
  MessageSquare,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const examTypes = [
  {
    title: 'Speaking',
    description: 'Practice your speaking skills with AI examiner',
    path: '/exam/speaking',
    duration: '11-14 minutes',
    parts: 3,
    icon: MessageSquare,
  },
  {
    title: 'Writing',
    description: 'Practice your writing skills with AI feedback',
    path: '/exam/writing',
    duration: '60 minutes',
    parts: 2,
    comingSoon: true,
    icon: BookOpen,
  },
  {
    title: 'Reading',
    description: 'Test your reading comprehension',
    path: '/exam/reading',
    duration: '60 minutes',
    parts: 3,
    comingSoon: true,
    icon: BookOpen,
  },
  {
    title: 'Listening',
    description: 'Improve your listening skills',
    path: '/exam/listening',
    duration: '30 minutes',
    parts: 4,
    comingSoon: true,
    icon: Headphones,
  },
];

export default function ExamPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleExamClick = (exam: (typeof examTypes)[0]) => {
    if (exam.comingSoon) {
      toast({
        title: 'Coming Soon!',
        description: `${exam.title} module will be available soon. Try our Speaking module in the meantime!`,
        duration: 5000,
      });
      return;
    }
    router.push(exam.path);
  };

  return (
    <div className="container mx-auto py-8">
      {/* Enhanced Introduction Section */}
      <section className="mb-12 text-center">
        <Badge className="mb-4" variant="secondary">
          <Sparkles className="mr-1 h-3 w-3" />
          AI-Powered IELTS Practice
        </Badge>
        <h1 className="mb-4 text-4xl font-bold tracking-tight">
          Complete IELTS Test Preparation
        </h1>
        <p className="mx-auto mb-6 max-w-2xl text-lg text-muted-foreground">
          Experience all four IELTS modules with our advanced AI technology.
          Start with our Speaking module today, with Writing, Reading, and
          Listening modules coming soon.
        </p>
        <div className="mx-auto mb-8 flex max-w-xl flex-wrap justify-center gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1">
            <MessageSquare className="h-3 w-3" />
            <span>AI Examiner</span>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1">
            <Clock className="h-3 w-3" />
            <span>Real-time Feedback</span>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1">
            <ArrowRight className="h-3 w-3" />
            <span>Instant Results</span>
          </div>
        </div>
      </section>

      {/* Available Tests Section */}
      <section>
        <div className="mb-8 space-y-4">
          <h2 className="text-2xl font-semibold">Available Tests</h2>
          <p className="text-muted-foreground">
            Choose a test module to practice. Each module is designed to match
            the official IELTS exam format and scoring criteria.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {examTypes.map((exam) => {
            const Icon = exam.icon;
            return (
              <Card
                key={exam.title}
                className={`group cursor-pointer shadow-sm transition-all hover:shadow-md ${
                  exam.comingSoon ? 'opacity-80' : ''
                }`}
                onClick={() => handleExamClick(exam)}
              >
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {Icon && (
                        <div className="rounded-lg bg-primary/10 p-2 text-primary">
                          <Icon className="h-6 w-6" />
                        </div>
                      )}
                      <h2 className="text-xl font-semibold">{exam.title}</h2>
                    </div>
                    {exam.comingSoon && (
                      <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <p className="mb-4 text-muted-foreground">
                    {exam.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{exam.duration}</span>
                    </div>
                    <span>•</span>
                    <span>{exam.parts} Parts</span>
                  </div>
                  <div className="mt-4">
                    <Button
                      variant={exam.comingSoon ? 'secondary' : 'default'}
                      className="w-full"
                      disabled={exam.comingSoon}
                    >
                      {exam.comingSoon ? 'Coming Soon' : 'Start Test'}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
