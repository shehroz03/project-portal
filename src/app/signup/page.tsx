'use client';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSubmitted(true);
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 text-center">
          <div className="w-20 h-20 bg-purple-500/10 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <h2 className="text-2xl font-black mb-2">Check Your Email</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">We've sent a verification link to <span className="font-bold text-gray-900 dark:text-white">{email}</span>. Please click it to activate your account.</p>
          <Link href="/login" className="text-sm font-black text-purple-600 hover:underline">Back to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 animate-fade-in">
        <div>
          <h2 className="text-center text-3xl font-black">Join BSt</h2>
          <p className="text-center text-sm text-gray-500 mt-2">Professional academic help at your fingertips</p>
        </div>
        {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold text-center">{error}</div>}
        <form className="mt-8 space-y-6" onSubmit={handleSignup} autoComplete="off">
          <input type="text" name="fake-username" autoComplete="username" className="hidden" tabIndex={-1} />
          <input type="password" name="fake-password" autoComplete="current-password" className="hidden" tabIndex={-1} />
          <div className="space-y-4">
            <input
              type="text"
              required
              autoComplete="off"
              className="auth-input appearance-none relative block w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <input
              type="email"
              required
              name="signup-email"
              autoComplete="off"
              className="auth-input appearance-none relative block w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                name="signup-password"
                autoComplete="new-password"
                className="auth-input appearance-none relative block w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-gray-400 hover:text-purple-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-4 px-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white text-sm font-black rounded-2xl hover:shadow-xl hover:shadow-purple-500/30 transition-all focus:outline-none disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Create Account'}
            </button>
          </div>

          <div className="text-center">
            <Link href="/login" className="text-sm font-bold text-purple-600 hover:text-purple-500">
              Already have an account? Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
