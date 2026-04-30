'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, Loader2, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function LoginPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Force remove browser/extension eye icons
    const cleanIcons = () => {
      const intruders = document.querySelectorAll('form button:not([type="submit"]):not([data-our-icon])');
      intruders.forEach(el => {
        (el as HTMLElement).style.setProperty('display', 'none', 'important');
      });
      // Targeted CSS for browser icons
      const style = document.createElement('style');
      style.innerHTML = `
        input::-ms-reveal, input::-ms-clear, input::-webkit-password-toggle-button { display: none !important; }
      `;
      document.head.appendChild(style);
    };
    const interval = setInterval(cleanIcons, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data: { user }, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else if (user) {
      const isMasterAdmin = user.email === 'miansabmi7@gmail.com';
      const isAdminRole = user.user_metadata?.role === 'admin';

      if (isMasterAdmin || isAdminRole) {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-2xl shadow-purple-500/10 border border-gray-100 dark:border-gray-800 animate-bounce-in">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black mb-2">{t.auth.welcome}</h2>
          <p className="text-gray-500 dark:text-gray-400">{t.auth.subtitle}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5" autoComplete="off">
          <input type="text" name="fake-username" autoComplete="username" className="hidden" tabIndex={-1} />
          <input type="password" name="fake-password" autoComplete="current-password" className="hidden" tabIndex={-1} />
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
                name="login-email"
                autoComplete="off"
                suppressHydrationWarning
                className="auth-input w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">{t.auth.password}</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                name="login-password"
                autoComplete="new-password"
                suppressHydrationWarning
                className="auth-input w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button"
                data-our-icon="true"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors z-20"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="flex justify-end px-1">
              <Link href="/forgot-password" title="Recover your account password" className="text-[10px] font-black uppercase tracking-widest text-purple-600 hover:text-purple-500 transition-colors">
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : t.auth.login}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500 dark:text-gray-400">
          {t.auth.noAccount}{' '}
          <Link href="/signup" className="text-purple-600 font-bold hover:underline">
            {t.auth.signup}
          </Link>
        </p>
      </div>
    </div>
  );
}
