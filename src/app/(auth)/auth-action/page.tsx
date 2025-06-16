'use client';

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
    <div className="p-8">
      <h1 className="text-xl font-semibold mb-4">Account Action</h1>
      {actionComponent || <p>Loading...</p>}
    </div>
  );
}

// These are placeholders. Implement them as needed.
function ResetPasswordForm({ oobCode }: { oobCode: string }) {
  return <p>Render reset password form here for code: {oobCode}</p>;
}

function VerifyEmailHandler({ oobCode }: { oobCode: string }) {
  return <p>Verifying email with code: {oobCode}</p>;
}

function RecoverEmailHandler({ oobCode }: { oobCode: string }) {
  return <p>Recovering email for code: {oobCode}</p>;
}
