import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';

import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { MainNav } from '@/components/nav';
import { AuthHandler } from '@/components/auth/auth-handler';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Speakify IELTS',
  description: 'AI-powered IELTS exam simulator',
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
