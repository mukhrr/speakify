import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

export default function Home() {
  const examSections = [
    {
      title: 'Reading',
      description:
        'Test your reading comprehension with academic texts and passages.',
      href: '/exam/reading',
      icon: '📚',
    },
    {
      title: 'Writing',
      description: 'Practice your writing skills with IELTS-style tasks.',
      href: '/exam/writing',
      icon: '✍️',
    },
    {
      title: 'Listening',
      description:
        'Enhance your listening skills with various audio materials.',
      href: '/exam/listening',
      icon: '🎧',
    },
    {
      title: 'Speaking',
      description: 'Improve your speaking with AI-powered assessment.',
      href: '/exam/speaking',
      icon: '🎙️',
    },
  ];

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-4xl font-bold">IELTS Mock Exam Simulator</h1>
        <p className="text-lg text-muted-foreground">
          Practice all sections of the IELTS exam with our AI-powered platform
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {examSections.map((section) => (
          <Card key={section.title} className="transition-all hover:shadow-lg">
            <Link href={section.href}>
              <CardHeader>
                <div className="mb-2 text-3xl">{section.icon}</div>
                <CardTitle>{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Start Practice</Button>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </main>
  );
}
