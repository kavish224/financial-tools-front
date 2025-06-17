'use client';

import { useEffect, useState } from 'react';
import { applyActionCode } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function VerifyEmailHandler({ oobCode }: { oobCode: string }) {
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await applyActionCode(auth, oobCode);
        setStatus('success');
        setMessage('✅ Email verified successfully!');
      } catch (error) {
        console.error(error);
        setStatus('error');
        setMessage('❌ Failed to verify email. The link may have expired or already been used.');
      }
    };

    verifyEmail();
  }, [oobCode]);

  return (
    <div>
      <div className="verify-email-container flex flex-col justify-center items-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Tools</h1>
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Email Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={`text-center ${
                status === 'success'
                  ? 'text-green-600'
                  : status === 'error'
                  ? 'text-red-600'
                  : 'text-gray-600'
              }`}
            >
              {message || 'Verifying your email...'}
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            {status !== 'pending' && (
              <Link href="/login" className="underline">
                <Button variant="link">Back to Login</Button>
              </Link>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
