'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function VerifyPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 px-4 py-8 text-center">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Check your email</h1>
          <p className="text-gray-600">
            We've sent you a verification link to your email address. Please
            click the link to verify your account.
          </p>
          <p className="text-sm text-gray-500">
            If you don't see the email, check your spam folder.
          </p>
        </div>

        <div className="pt-4">
          <Link href="/auth/login">
            <Button variant="outline" className="w-full">
              Back to Sign in
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
