'use client';

import { signInUser } from '@/app/actions';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full py-3 px-4 rounded-xl text-white font-semibold transition-all duration-300 shadow-xl ${
        pending ? 'bg-indigo-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 hover:shadow-indigo-500/30'
      }`}
    >
      {pending ? 'Signing In...' : 'Sign In'}
    </button>
  );
}

export default function SignInPage() {
  const [state, formAction] = useActionState(signInUser, null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-[#0a0a0a] to-[#0a0a0a] p-6 relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-white/10 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg rotate-3 shadow-indigo-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white -rotate-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to your account</p>
        </div>

        <form action={formAction} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email or Username</label>
              <input
                type="text"
                name="identifier"
                required
                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <input
                type="password"
                name="password"
                required
                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {state?.error && (
             <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
               {state.error}
             </div>
          )}

          <SubmitButton />
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          Don't have an account?{' '}
          <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}