'use client';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function ForgotPasswordPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-2xl shadow-purple-500/10 border border-gray-100 dark:border-gray-800">
        {!success ? (
          <>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black mb-2">Reset Password</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Enter your email and we'll send you a recovery link</p>
            </div>

            <form onSubmit={handleReset} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-2xl text-sm font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">{t.auth.email}</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors" size={20} />
                  <input
                    type="email"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none transition-all font-medium"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Send Reset Link'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-10">
            <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-2xl font-black mb-4">Email Sent!</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8">
              Check your inbox at <span className="font-bold text-gray-900 dark:text-white">{email}</span> for a link to reset your password.
            </p>
          </div>
        )}

        <div className="mt-8 pt-8 border-t border-gray-50 dark:border-gray-800 text-center">
          <Link href="/login" className="inline-flex items-center gap-2 text-purple-600 font-bold hover:gap-3 transition-all text-sm">
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
