'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { RecoverEmailHandler } from '@/components/RecoverEmail';
import { ResetPasswordForm } from '@/components/ResetPass';
import { VerifyEmailHandler } from '@/components/VerifyEmail';

export default function AuthActionPage(): JSX.Element {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const oobCode = searchParams.get('oobCode');
  const [actionComponent, setActionComponent] = useState<JSX.Element | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!mode || !oobCode) {
      setActionComponent(<p className="text-center text-red-500">Missing or invalid parameters.</p>);
      setInitialized(true);
      return;
    }

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
        setActionComponent(<p className="text-center text-red-500">Invalid action.</p>);
    }

    setInitialized(true);
  }, [mode, oobCode]);

  return (
    <div>
      {initialized ? actionComponent : <p className="text-center">Loading...</p>}
    </div>
  );
}
