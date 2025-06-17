'use client';

import { RecoverEmailHandler } from '@/components/RecoverEmail';
import { ResetPasswordForm } from '@/components/ResetPass';
import { VerifyEmailHandler } from '@/components/VerifyEmail';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthActionPage() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const oobCode = searchParams.get('oobCode');
  const [actionComponent, setActionComponent] = useState<JSX.Element | null>(null);

  useEffect(() => {
    if (!mode || !oobCode) return;

    switch (mode) {
      case 'resetPassword':
        setActionComponent(<ResetPasswordForm oobCode={oobCode} />);
        break;
      case 'verifyEmail':
        setActionComponent(<VerifyEmailHandler oobCode={oobCode} />);
        break;
      case 'recoverEmail':
        setActionComponent(<RecoverEmailHandler oobCode={oobCode} />);
        break;
      default:
        setActionComponent(<p>Invalid action.</p>);
    }
  }, [mode, oobCode]);

  return (
    <div>
      {actionComponent || <p>Loading...</p>}
    </div>
  );
}
