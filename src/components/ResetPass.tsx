'use client';

import { useState } from 'react';
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function ResetPasswordForm({ oobCode }: { oobCode: string }) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError("Passwords don't match");
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCode, password);
      setSuccess(true);
    } catch (err) {
      if (err instanceof Error) {
        console.error(err);
        setError(err.message || 'Failed to reset password');
      }
    }
  };

  if (success) {
    return <p className="text-green-600">✅ Password reset successful! You can now log in.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1">New Password</label>
        <input
          type="password"
          className="border p-2 w-full rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block mb-1">Confirm Password</label>
        <input
          type="password"
          className="border p-2 w-full rounded"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
      </div>
      {error && <p className="text-red-600">{error}</p>}
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Reset Password
      </button>
    </form>
  );
}
