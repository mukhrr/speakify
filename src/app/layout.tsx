import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import { Suspense } from 'react';
import { cn } from '@/lib/utils';

import './globals.css';

import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { MainNav } from '@/components/nav';
import { AuthHandler } from '@/components/auth/auth-handler';

const montserrat = Montserrat({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Speakify IELTS - AI-Powered Speaking Test Examiner',
  description:
    'Practice IELTS speaking with our AI-powered exam examiner. Get instant feedback, realistic questions, and improve your speaking skills with advanced speech analysis.',
  keywords:
    'IELTS speaking, IELTS practice, speaking test examiner, AI language assessment, IELTS preparation, English speaking practice',
  authors: [{ name: 'Speakify IELTS Team' }],
  creator: 'Speakify IELTS',
  publisher: 'Speakify IELTS',
  openGraph: {
    title: 'Speakify IELTS - AI-Powered Speaking Test Examiner',
    description:
      'Practice IELTS speaking with our AI-powered exam examiner. Get instant feedback, realistic questions, and improve your speaking skills.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Speakify IELTS',
    images: [
      {
        url: '/images/main-page.png',
        width: 1200,
        height: 675,
        alt: 'IELTS Speaking Practice Platform - Professional AI examiner interface',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Speakify IELTS - AI-Powered Speaking Test Examiner',
    description:
      'Practice IELTS speaking with our AI-powered exam examiner. Get instant feedback and improve your speaking skills.',
    images: ['/images/main-page.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'verification_token',
  },
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: '32x32',
      },
      {
        url: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#5bbad5',
      },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background antialiased',
          !montserrat.className
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Suspense>
            <AuthHandler />
          </Suspense>
          <MainNav />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
