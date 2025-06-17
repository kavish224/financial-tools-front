'use client';

import { useEffect, useState } from 'react';
import { checkActionCode, applyActionCode } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function RecoverEmailHandler({ oobCode }: { oobCode: string }) {
    const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');
    const [message, setMessage] = useState('');
    const [, setRestoredEmail] = useState<string | null>(null);

    useEffect(() => {
        const recoverEmail = async () => {
            try {
                const info = await checkActionCode(auth, oobCode);
                const restored = info.data.email;
                setRestoredEmail(restored ?? null);

                await applyActionCode(auth, oobCode);
                setStatus('success');
                setMessage(`✅ Email address has been restored to ${restored}.`);
            } catch (error) {
                console.error(error);
                setStatus('error');
                setMessage('❌ Failed to recover email. The link may be invalid or expired.');
            }
        };

        recoverEmail();
    }, [oobCode]);

    return (
        <div className="recover-email-container flex flex-col justify-center items-center h-screen">
            <h1 className="text-2xl font-bold mb-4">Tools</h1>
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Recover Email</CardTitle>
                </CardHeader>
                <CardContent>
                    <p
                        className={`text-center ${status === 'success'
                                ? 'text-green-600'
                                : status === 'error'
                                    ? 'text-red-600'
                                    : 'text-gray-600'
                            }`}
                    >
                        {message || 'Processing recovery...'}
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
    );
}
