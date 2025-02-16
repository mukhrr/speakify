import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted/20 py-20">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Master IELTS Speaking with{' '}
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              AI-Powered Practice
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Get instant feedback on your speaking skills with our advanced AI
            technology. Practice anytime, anywhere, and improve your IELTS
            score.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/auth/register">
              <Button size="lg" className="font-semibold">
                Try for Free
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg" className="font-semibold">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Why Choose Speakify?
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-3 text-xl font-semibold">Real-time Feedback</h3>
              <p className="text-muted-foreground">
                Get instant feedback on your pronunciation, fluency, grammar,
                and vocabulary. Understand your strengths and areas for
                improvement.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-3 text-xl font-semibold">AI Examiner</h3>
              <p className="text-muted-foreground">
                Practice with our intelligent AI examiner that adapts to your
                responses and provides a realistic IELTS interview experience.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-3 text-xl font-semibold">
                Comprehensive Analysis
              </h3>
              <p className="text-muted-foreground">
                Receive detailed performance analytics and track your progress
                over time. Identify patterns and improve systematically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            How Speakify Works
          </h2>
          <div className="space-y-8">
            <div className="flex items-center gap-6 rounded-lg border bg-card p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                1
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold">
                  Start Your Practice Session
                </h3>
                <p className="text-muted-foreground">
                  Choose from our library of IELTS speaking topics and begin
                  your practice session with our AI examiner.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 rounded-lg border bg-card p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                2
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold">
                  Engage in Natural Conversation
                </h3>
                <p className="text-muted-foreground">
                  Have a natural conversation with our AI examiner, just like in
                  a real IELTS test. Practice all three parts of the speaking
                  test.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 rounded-lg border bg-card p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                3
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold">
                  Get Instant Feedback
                </h3>
                <p className="text-muted-foreground">
                  Receive detailed feedback on your performance, including
                  scores and suggestions for improvement in each area.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold">
            Ready to Improve Your IELTS Speaking?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join thousands of students who have improved their IELTS speaking
            scores with Speakify.
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="font-semibold">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
