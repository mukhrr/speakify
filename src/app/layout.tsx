import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';

import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { MainNav } from '@/components/nav';
import { AuthHandler } from '@/components/auth/auth-handler';

const inter = Inter({ subsets: ['latin'] });

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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Speakify IELTS - AI-Powered Speaking Test Examiner',
    description:
      'Practice IELTS speaking with our AI-powered exam examiner. Get instant feedback and improve your speaking skills.',
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="speakify-theme"
        >
          <AuthHandler />
          <MainNav />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
