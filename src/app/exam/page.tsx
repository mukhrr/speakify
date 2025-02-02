import { Card } from '@/components/ui/card';
import Link from 'next/link';

const examTypes = [
  {
    title: 'Speaking',
    description: 'Practice your speaking skills with AI examiner',
    path: '/exam/speaking',
    duration: '11-14 minutes',
    parts: 3,
  },
  {
    title: 'Writing',
    description: 'Practice your writing skills with AI feedback',
    path: '/exam/writing',
    duration: '60 minutes',
    parts: 2,
    comingSoon: true,
  },
  {
    title: 'Reading',
    description: 'Test your reading comprehension',
    path: '/exam/reading',
    duration: '60 minutes',
    parts: 3,
    comingSoon: true,
  },
  {
    title: 'Listening',
    description: 'Improve your listening skills',
    path: '/exam/listening',
    duration: '30 minutes',
    parts: 4,
    comingSoon: true,
  },
];

export default function ExamPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold">IELTS Practice Tests</h1>
        <p className="text-muted-foreground">
          Choose a test module to practice. Each module simulates the real IELTS
          exam environment.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {examTypes.map((exam) => (
          <Card
            key={exam.title}
            className={`shadow-glow hover:shadow-glow-md relative overflow-hidden border-border bg-card p-6 transition-all ${
              exam.comingSoon ? 'opacity-60' : ''
            }`}
          >
            {exam.comingSoon && (
              <div className="shadow-glow absolute right-4 top-4 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                Coming Soon
              </div>
            )}
            <h2 className="text-xl font-semibold text-card-foreground">
              {exam.title}
            </h2>
            <p className="mt-2 text-muted-foreground">{exam.description}</p>
            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              <span>Duration: {exam.duration}</span>
              <span>Parts: {exam.parts}</span>
            </div>
            {!exam.comingSoon && (
              <Link
                href={exam.path}
                className="shadow-glow hover:shadow-glow-md mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90"
              >
                Start Test
              </Link>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
