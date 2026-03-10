'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') || '');
    const password = String(form.get('password') || '');

    if (mode === 'register') {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to register');
        setLoading(false);
        return;
      }
    }

    const login = await signIn('credentials', { email, password, redirect: false });

    if (login?.error) {
      setError(login.error);
    } else {
      router.push('/dashboard');
      router.refresh();
    }

    setLoading(false);
  }

  return (
    <form className="space-y-4 rounded-xl border border-border bg-card p-6" onSubmit={onSubmit}>
      <div>
        <label className="mb-1 block text-sm">Email</label>
        <input className="input" name="email" type="email" required />
      </div>
      <div>
        <label className="mb-1 block text-sm">Password</label>
        <input className="input" name="password" type="password" minLength={6} required />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button className="btn w-full" disabled={loading} type="submit">
        {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
      </button>
      <button
        type="button"
        onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
        className="w-full text-sm text-slate-300 underline"
      >
        {mode === 'login' ? 'Need an account? Register' : 'Already have an account? Login'}
      </button>
    </form>
  );
}
