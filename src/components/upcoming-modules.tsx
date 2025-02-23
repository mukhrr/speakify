'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  MessageSquare,
  BookOpen,
  Headphones,
  ChevronRight,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export function UpcomingModules() {
  const router = useRouter();

  return (
    <section className="relative overflow-hidden border-t bg-muted/5 py-20">
      <div className="container relative mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <Badge className="mb-4" variant="secondary">
            <Sparkles className="mr-1 h-3 w-3" />
            More Coming Soon
          </Badge>
          <h2 className="mb-4 text-3xl font-bold">
            Complete IELTS Preparation Suite
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            We&apos;re expanding our AI-powered platform to cover all IELTS
            modules. Start with Speaking today!
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="group relative rounded-lg border bg-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold">Speaking</h3>
            </div>
            <div className="mb-3 w-fit rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-500">
              Available Now
            </div>
            <p className="text-sm text-muted-foreground">
              Practice with our AI examiner and get instant feedback on your
              speaking skills.
            </p>
          </div>

          <div className="group relative flex items-center justify-center rounded-lg border bg-card p-6">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <Headphones className="h-5 w-5 text-primary" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold">
                More Modules Coming Soon
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Writing, Reading, and Listening modules are in development.
              </p>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => router.push('/exam')}
              >
                View All Modules <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
