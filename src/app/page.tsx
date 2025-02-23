import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Mic,
  Clock,
  Layout,
  Timer,
  AlertCircle,
} from 'lucide-react';
import { Metadata } from 'next';

// Enhanced metadata for the home page
export const metadata: Metadata = {
  title: 'Speakify IELTS - Practice IELTS Speaking with AI-Powered Examiner',
  description:
    'Master IELTS speaking with our AI-powered examiner. Get real-time feedback, practice with authentic questions, and improve your band score.',
  openGraph: {
    title: 'Speakify IELTS - Practice IELTS Speaking with AI Examiner',
    description:
      'Master IELTS speaking with our AI-powered examiner. Get real-time feedback and improve your band score.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Speakify IELTS Speaking Practice',
      },
    ],
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden bg-gradient-to-b from-background to-muted/20 py-20"
        aria-labelledby="hero-heading"
      >
        {/* Background Grid */}
        <div
          className="bg-grid-white/[0.02] absolute inset-0 bg-[size:60px_60px]"
          aria-hidden="true"
        />

        {/* Decorative Blobs */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute -right-32 -top-32 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl" />
        </div>

        {/* Animated Lines */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-primary/20 via-primary/5 to-transparent" />
          <div className="absolute right-0 top-0 h-full w-1.5 bg-gradient-to-b from-primary/20 via-primary/5 to-transparent" />
        </div>

        <div className="container relative mx-auto max-w-5xl px-4 text-center">
          <Badge className="mb-4 rounded-full px-4 py-1.5" variant="secondary">
            <span role="img" aria-label="Target">
              🎯
            </span>{' '}
            Real IELTS Speaking Test Simulation
          </Badge>
          <h1
            id="hero-heading"
            className="mb-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl"
          >
            Feel the{' '}
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Authentic Pressure
            </span>{' '}
            of IELTS Speaking
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Practice IELTS speaking with our AI-powered examiner. Get instant
            feedback on your pronunciation, fluency, and coherence. Experience a
            real test environment with a professional examiner.
          </p>

          {/* Add structured data for rich results */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'SoftwareApplication',
                name: 'Speakify IELTS',
                applicationCategory: 'EducationalApplication',
                description:
                  'AI-powered IELTS speaking practice with professional examiner feedback',
                offers: {
                  '@type': 'Offer',
                  price: '0',
                  priceCurrency: 'USD',
                },
                operatingSystem: 'Web',
              }),
            }}
          />
          <div className="mb-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border bg-card/50 p-4 backdrop-blur">
              <div className="mb-2 flex items-center justify-center gap-2">
                <Timer className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Strict Timing</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Real 11-14 minute format with timed sections and preparation
                periods
              </p>
            </div>
            <div className="rounded-lg border bg-card/50 p-4 backdrop-blur">
              <div className="mb-2 flex items-center justify-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Test Pressure</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Experience the same intensity and pressure as the actual exam
              </p>
            </div>
            <div className="rounded-lg border bg-card/50 p-4 backdrop-blur">
              <div className="mb-2 flex items-center justify-center gap-2">
                <Layout className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Exact Format</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Follows official IELTS structure and examination patterns
              </p>
            </div>
          </div>
          <div className="mb-8 flex justify-center gap-4">
            <Link href="/auth/register">
              <Button size="lg" className="gap-2 font-semibold">
                Try For Free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg" className="font-semibold">
                Sign In
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Official IELTS Format</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Real-Time Exam Timer</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Professional AI Examiner</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative overflow-hidden py-20">
        {/* Background Pattern */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          <div className="bg-gradient-radial absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 from-primary/5 to-transparent" />
        </div>

        {/* Decorative Circles */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[10%] top-[20%] h-24 w-24 rounded-full border border-primary/10" />
          <div className="absolute right-[15%] top-[30%] h-16 w-16 rounded-full border border-primary/10" />
          <div className="absolute bottom-[15%] left-[20%] h-32 w-32 rounded-full border border-primary/10" />
        </div>

        <div className="container relative mx-auto max-w-6xl px-4">
          <h2 className="mb-4 text-center text-3xl font-bold">
            Experience the Real IELTS Format
          </h2>
          <p className="mb-12 text-center text-muted-foreground">
            Our exam follows the exact structure and timing of the official
            IELTS speaking test, conducted by a professional AI examiner
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="group relative rounded-lg border bg-card p-6 transition-all hover:shadow-lg">
              <div className="mb-4 inline-flex rounded-full bg-primary/10 p-3 text-primary">
                <Layout className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">
                Part 1: Introduction
              </h3>
              <p className="text-muted-foreground">
                4-5 minutes of general questions about yourself, your home,
                work, studies, and familiar topics - just like the real exam.
              </p>
            </div>
            <div className="group relative rounded-lg border bg-card p-6 transition-all hover:shadow-lg">
              <div className="mb-4 inline-flex rounded-full bg-primary/10 p-3 text-primary">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Part 2: Long Turn</h3>
              <p className="text-muted-foreground">
                2 minutes preparation, followed by a 2-minute speech about a
                specific topic. Includes authentic cue card format.
              </p>
            </div>
            <div className="group relative rounded-lg border bg-card p-6 transition-all hover:shadow-lg">
              <div className="mb-4 inline-flex rounded-full bg-primary/10 p-3 text-primary">
                <Mic className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Part 3: Discussion</h3>
              <p className="text-muted-foreground">
                4-5 minutes of in-depth discussion related to your Part 2 topic,
                with follow-up questions and detailed responses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative overflow-hidden border-t bg-muted/30 py-20">
        {/* Background Elements */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          {/* Diagonal Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,var(--primary)_1px,transparent_25%,transparent_50%,var(--primary)_1px,transparent_50%,transparent_75%,var(--primary)_1px,transparent_75%)] opacity-[0.02] [background-size:60px_60px]" />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        </div>

        <div className="container relative mx-auto max-w-4xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Authentic Exam Experience
          </h2>
          <div className="space-y-8">
            <div className="flex items-center gap-6 rounded-lg border bg-card p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                1
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold">
                  Professional Environment
                </h3>
                <p className="text-muted-foreground">
                  Our AI examiner follows official IELTS guidelines, asking
                  questions and providing instructions exactly as a human
                  examiner would.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 rounded-lg border bg-card p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                2
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold">
                  Real-Time Assessment
                </h3>
                <p className="text-muted-foreground">
                  Get evaluated on the official IELTS criteria: Fluency,
                  Pronunciation, Grammar, and Vocabulary Range.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 rounded-lg border bg-card p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                3
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold">
                  Detailed Feedback
                </h3>
                <p className="text-muted-foreground">
                  Receive examiner-style feedback and band scores for each
                  section, helping you understand your performance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-20">
        {/* Background Elements */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          {/* Center Glow */}
          <div className="bg-gradient-radial absolute left-1/2 top-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 from-primary/10 to-transparent" />

          {/* Corner Accents */}
          <div className="absolute left-0 top-0 h-32 w-32 bg-gradient-to-br from-primary/5 to-transparent" />
          <div className="absolute bottom-0 right-0 h-32 w-32 bg-gradient-to-tl from-primary/5 to-transparent" />
        </div>

        <div className="container relative mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Ready for Your Mock IELTS Speaking Test?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Experience a complete IELTS speaking test with a professional AI
            examiner in a realistic exam environment.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/auth/register">
              <Button size="lg" className="gap-2 font-semibold">
                Start For Totally Free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg" className="font-semibold">
                Sign In
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            No credit card required • Full 11-14 minute speaking test
          </p>
        </div>
      </section>
    </main>
  );
}
